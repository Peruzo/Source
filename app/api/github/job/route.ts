import { NextRequest, NextResponse } from 'next/server';
import { getGitHubJob, updateJobStatus, isValidJobId, jobBelongsToOnboarding } from '@/lib/storage/github-jobs';
import { appendOnboardingEvent, listOnboardingEvents, isGithubRepoAcceptedFromEvents } from '@/lib/storage/onboarding-events';
import { reduceOnboarding, assertStatus } from '@/lib/onboarding/reducer';
import { patchAdminOnboarding, sendToAdminPortal } from '@/lib/api/admin-portal';
import { auth0 } from '@/lib/auth0';
import { onboardingNotFound, requireOnboardingOwner } from '@/lib/onboarding/ownership';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * GET /api/github/job?jobId=...&onboardingId=...
 * Hämtar status för ett GitHub import-jobb.
 *
 * ÄGARSKAP: Auth0-session krävs och onboardingId måste vara bundet till anroparens userSub
 * (requireOnboardingOwner, samma hjälpare som övriga onboarding-routes). Jobbet måste
 * dessutom tillhöra just den onboardingen. Alla nekanden ger samma 404 så att giltiga
 * jobb- eller onboarding-id inte kan bekräftas.
 *
 * Om jobbet är 'running' eller 'queued', kontrolleras om ZIP-filen finns i GCS.
 * GCS används som sanningskälla - ingen callback från worker.
 */
export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');
    const onboardingId = request.nextUrl.searchParams.get('onboardingId');
    if (!isValidJobId(jobId) || !onboardingId) {
      return onboardingNotFound();
    }

    // ÄGARSKAP före läsning av jobbet
    const session = await auth0.getSession();
    const denied = await requireOnboardingOwner(session?.user?.sub, onboardingId);
    if (denied) return denied;

    let job = await getGitHubJob(jobId);
    if (!job || !jobBelongsToOnboarding(job, onboardingId)) {
      return onboardingNotFound();
    }

    // STEG 2: Kontrollera om ZIP-filen finns när status är 'running' eller 'queued'
    // Extern worker sparar ZIP på: gs://{BUCKET}/github/{jobId}.zip
    // När filen finns → uppdatera job-status till 'completed'
    if (job.status === 'running' || job.status === 'queued') {
      if (BUCKET) {
        try {
          const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
          const bucket = storage.bucket(BUCKET);

          // Worker sparar på två olika prefix beroende på flöde:
          //   github/{jobId}.zip   — run-job.js (GitHub-clone via /run-job)
          //   upload/{jobId}.zip   — upload-job.js (direkt ZIP via /jobs/upload)
          // Vi kollar båda så polling fungerar för ZIP-upload-flödet också.
          const githubPath = `github/${jobId}.zip`;
          const uploadPath = `upload/${jobId}.zip`;

          const githubFile = bucket.file(githubPath);
          const uploadFile = bucket.file(uploadPath);

          const [[githubExists], [uploadExists]] = await Promise.all([
            githubFile.exists(),
            uploadFile.exists(),
          ]);

          const zipFile = githubExists ? githubFile : uploadFile;
          const zipFileName = githubExists ? githubPath : uploadPath;
          const codeSource: 'github' | 'upload' = githubExists ? 'github' : 'upload';
          const exists = githubExists || uploadExists;

          if (exists) {
            // ZIP-filen finns - hämta metadata för size
            const [metadata] = await zipFile.getMetadata();
            const sizeBytes = parseInt(String(metadata.size || '0'), 10);
            const sizeMB = Math.round((sizeBytes / 1024 / 1024) * 100) / 100;

            const gcsPath = `gs://${BUCKET}/${zipFileName}`;
            
            
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
                  // repoLink finns bara för GitHub-flödet. För ZIP-upload är det undefined
                  // → FSM-guarden (kräver github_repo_verified om repoLink finns) triggas inte.
                  repoLink: codeSource === 'github' ? job.repoUrl : undefined,
                  fileName: `${jobId}.zip`,
                  codeSource,
                  storageObjectUrl: gcsPath,
                },
              });
            } catch (eventErr) {
              console.error('[GitHub Job] Failed to append code_submitted for onboarding:', eventErr);
            }

            // Hämta state för att kontrollera FSM-status
            const events = await listOnboardingEvents(job.onboardingId);
            const state = reduceOnboarding(events, job.onboardingId, job.userSub);

            // FSM-krav: Jobbet får endast köras när code är färdigt
            assertStatus(state, 'code_completed');

            // SÄKERHET: GitHub-repo MÅSTE vara godkänt (event-baserat): OAuth-verifierat
            // (github_repo_verified) eller bekräftat publikt av servern för just detta repo
            // (github_public_repo_confirmed). Skip för ZIP-upload-flöden — där finns inget repo.
            const repoAccess = codeSource === 'github'
              ? isGithubRepoAcceptedFromEvents(events, job.repoUrl)
              : { accepted: true, repoSlug: undefined, verifiedAt: undefined };
            const isVerified = {
              verified: repoAccess.accepted,
              repoSlug: repoAccess.repoSlug ?? null,
              verifiedAt: repoAccess.verifiedAt ?? null,
            };

            if (codeSource === 'github' && !isVerified.verified) {
              throw new Error('GitHub repo is neither OAuth-verified nor confirmed public');
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
              
              // 🔥 Skicka GitHub-verifiering till admin (github_repo_verified är INTE ett FSM-event)
              sendToAdminPortal('onboarding', {
                idempotencyKey: `onboarding-${job.onboardingId}-github-verified`,
                publicOnboardingId: job.onboardingId,
                user: state.email ? { email: state.email, sub: job.userSub } : { sub: job.userSub },
                step: 'github_verified',
                onboardingStatus: state.status, // Använd formell status från FSM
                data: {
                  repoUrl: job.repoUrl,
                  repoSlug: isVerified.repoSlug || job.repo,
                  verifiedAt: isVerified.verifiedAt,
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
                  repoSlug: isVerified.repoSlug || job.repo,
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
