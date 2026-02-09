import { NextRequest, NextResponse } from 'next/server';
import { getGitHubJob, updateJobStatus } from '@/lib/storage/github-jobs';
import { appendOnboardingEvent, listOnboardingEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';
import { patchAdminOnboarding, sendToAdminPortal } from '@/lib/api/admin-portal';
import { getAnonymousSessionId } from '@/lib/onboarding/anonymous-session';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * GET /api/github/job?jobId=...
 * Hämtar status för ett GitHub import-jobb.
 *
 * ARKITEKTURREGEL: Ingen Auth0. Åtkomst via jobId (hemlig UUID) + valfri match mot anonym cookie.
 * Om cookie finns och job.userSub inte matchar sessionId → 403.
 *
 * Om jobbet är 'running' eller 'queued', kontrolleras om ZIP-filen finns i GCS.
 * GCS används som sanningskälla - ingen callback från worker.
 */
export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    let job = await getGitHubJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const sessionId = await getAnonymousSessionId();
    if (sessionId && job.userSub !== sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // STEG 2: Kontrollera om ZIP-filen finns när status är 'running' eller 'queued'
    // Extern worker sparar ZIP på: gs://{BUCKET}/github/{jobId}.zip
    // När filen finns → uppdatera job-status till 'completed'
    if (job.status === 'running' || job.status === 'queued') {
      if (BUCKET) {
        try {
          const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
          const bucket = storage.bucket(BUCKET);
          const zipFileName = `github/${jobId}.zip`;
          const zipFile = bucket.file(zipFileName);
          
          const [exists] = await zipFile.exists();
          
          if (exists) {
            // ZIP-filen finns - hämta metadata för size
            const [metadata] = await zipFile.getMetadata();
            const sizeBytes = parseInt(String(metadata.size || '0'), 10);
            const sizeMB = Math.round((sizeBytes / 1024 / 1024) * 100) / 100;
            
            const gcsPath = `gs://${BUCKET}/${zipFileName}`;
            
            console.log(`[GitHub Job] ZIP file found for job ${jobId}, updating to completed. Size: ${sizeMB} MB`);
            
            // Uppdatera job-status till completed med GCS-path och size
            await updateJobStatus(jobId, 'completed', {
              completedAt: new Date().toISOString(),
              uploadResult: {
                objectUrl: gcsPath,
                sizeBytes,
                fileName: `${jobId}.zip`,
              },
            });

            // Backend-driven: mutera onboarding-session så att kod räknas som kopplad
            try {
              await appendOnboardingEvent(job.onboardingId, {
                type: 'code_submitted',
                payload: {
                  repoLink: job.repoUrl,
                  fileName: `${jobId}.zip`,
                  codeSource: 'github',
                  storageObjectUrl: gcsPath,
                },
              });
              console.log(`[GitHub Job] Onboarding ${job.onboardingId} updated with code_submitted (github)`);
            } catch (eventErr) {
              console.error('[GitHub Job] Failed to append code_submitted for onboarding:', eventErr);
            }

            // Hämta state för att kontrollera status och verifiering
            const events = await listOnboardingEvents(job.onboardingId);
            const state = reduceOnboarding(events, job.onboardingId, job.userSub);

            // FSM: Verifiera att onboarding är i korrekt status (github_verified eller code_completed)
            // Endast om repo är verifierat och status är korrekt ska vi synka till admin
            try {
              assertStatus(state, ['github_verified', 'code_completed']);
              
              // Ytterligare kontroll: GitHub-repo måste vara verifierat
              if (!state.github?.verified) {
                throw new Error('GitHub repo not verified');
              }
            } catch (statusError) {
              console.warn(`[GitHub Job] Skipping admin sync: Invalid status or unverified repo for onboarding ${job.onboardingId}:`, statusError);
              // Hoppa över admin-sync om status eller verifiering saknas
              job = await getGitHubJob(jobId);
              if (!job) {
                return NextResponse.json({ error: 'Job not found after update' }, { status: 404 });
              }
              const { githubToken: _githubToken, ...safeJob } = job;
              return NextResponse.json({
                job: safeJob,
                progress: safeJob.progress,
                status: safeJob.status,
              });
            }

            // Synka till admin-portalen så att onboarding visar "har kod" (admin läser från MongoDB, inte events)
            // Status och verifiering är nu bekräftade
            patchAdminOnboarding(job.onboardingId, 'code', {
              codePackage: {
                type: 'github',
                status: 'received',
                github: {
                  repoUrl: job.repoUrl,
                  storageObjectUrl: gcsPath,
                },
              },
            }).catch((err) => console.error('[GitHub Job] Admin PATCH code failed:', err));

            // FSM GUARD – prevent duplicate events from polling
            // FSM-events från polling måste vara edge-triggered, inte level-triggered
            // Skicka GitHub-steg till admin ingest endast när verifierat OCH inte redan notifierat
            if (!job.adminNotifiedAt) {
              const notifyTime = new Date().toISOString();
              // Markera som notifierat INNAN vi skickar (förhindrar race condition)
              await updateJobStatus(jobId, job.status, { adminNotifiedAt: notifyTime });
              
              // 🔥 ENDA stället FSM-event skickas för github_verified
              sendToAdminPortal('onboarding', {
                idempotencyKey: `onboarding-${job.onboardingId}-github-verified`,
                publicOnboardingId: job.onboardingId,
                user: state.email ? { email: state.email, sub: job.userSub } : { sub: job.userSub },
                step: 'github_verified',
                onboardingStatus: state.status, // Använd formell status från FSM
                data: {
                  repoUrl: job.repoUrl,
                  repoSlug: state.github.repoSlug,
                  verifiedAt: state.github.verifiedAt,
                },
                submittedAt: notifyTime,
                source: 'public_onboarding',
              }).catch((err) => {
                console.error('[GitHub Job] Admin ingest failed:', err);
                console.info(
                  '[FSM GUARD] Event blocked from retry',
                  { step: 'github_verified', jobId, adminNotifiedAt: notifyTime }
                );
              });

              // 🔥 ENDA stället FSM-transition till code_completed sker
              // Edge-triggered: körs exakt en gång när job är completed
              sendToAdminPortal('onboarding', {
                idempotencyKey: `onboarding-${job.onboardingId}-code-completed`,
                publicOnboardingId: job.onboardingId,
                user: state.email ? { email: state.email, sub: job.userSub } : { sub: job.userSub },
                step: 'code_completed',
                onboardingStatus: 'code_completed',
                data: {
                  repoUrl: job.repoUrl,
                  repoSlug: state.github.repoSlug,
                  storageObjectUrl: gcsPath,
                  completedAt: notifyTime,
                },
                submittedAt: notifyTime,
                source: 'public_onboarding',
              }).catch((err) => {
                console.error('[GitHub Job] Admin ingest code_completed failed:', err);
                console.info(
                  '[FSM GUARD] Event blocked from retry',
                  { step: 'code_completed', jobId, adminNotifiedAt: notifyTime }
                );
              });
            } else {
              console.info(
                '[FSM GUARD] Event blocked',
                { step: 'github_verified', fsmStatus: 'already_notified', adminNotifiedAt: job.adminNotifiedAt, jobId }
              );
              console.info(
                '[FSM GUARD] Event blocked',
                { step: 'code_completed', fsmStatus: 'already_notified', adminNotifiedAt: job.adminNotifiedAt, jobId }
              );
            }
            
            // Hämta uppdaterat jobb
            job = await getGitHubJob(jobId);
            if (!job) {
              return NextResponse.json({ error: 'Job not found after update' }, { status: 404 });
            }
          }
        } catch (gcsError) {
          // Logga men fortsätt - jobbet kan fortfarande vara processing
          console.warn(`[GitHub Job] Error checking GCS for job ${jobId}:`, gcsError);
        }
      }
    }

    // Null-guard efter GCS-kontroll (job kan ha uppdaterats)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Rensa känslig data från response (token ska aldrig exponeras)
    const { githubToken: _githubToken, ...safeJob } = job;

    return NextResponse.json({
      job: safeJob,
      // Progress information för UI
      progress: safeJob.progress,
      status: safeJob.status,
    });
  } catch (error) {
    console.error('[GitHub Job] Error:', error);
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}
