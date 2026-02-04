import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getGitHubJob, updateJobStatus } from '@/lib/storage/github-jobs';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';
import { patchAdminOnboarding } from '@/lib/api/admin-portal';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;
const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * GET /api/github/job?jobId=...
 * Hämtar status för ett GitHub import-jobb.
 * 
 * Om jobbet är 'running' eller 'queued', kontrollerar den om ZIP-filen finns i GCS.
 * Om filen finns, uppdateras jobbet till 'completed' med GCS-path och size.
 * 
 * GCS används som sanningskälla - ingen callback från worker.
 * Public website uppdaterar status baserat på GCS-filens existens.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 });
    }

    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    let job = await getGitHubJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verifiera att jobbet tillhör användaren
    if (job.userSub !== session.user.sub) {
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

            // Hämta state för att kontrollera om repo är verifierat
            const events = await listOnboardingEvents(job.onboardingId);
            const state = reduceOnboarding(events, job.onboardingId, job.userSub);

            // Synka till admin-portalen så att onboarding visar "har kod" (admin läser från MongoDB, inte events)
            // KRITISK: Skicka GitHub-steg endast om repo är verifierat (API-nivå verifiering)
            if (state.github?.verified) {
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

              // Skicka GitHub-steg till admin ingest endast när verifierat
              sendToAdminPortal('onboarding', {
                idempotencyKey: `onboarding-${job.onboardingId}-github-verified`,
                publicOnboardingId: job.onboardingId,
                user: state.email ? { email: state.email, sub: job.userSub } : { sub: job.userSub },
                step: 'github_verified',
                onboardingStatus: 'påbörjad',
                data: {
                  repoUrl: job.repoUrl,
                  repoSlug: state.github.repoSlug,
                  verifiedAt: state.github.verifiedAt,
                },
                submittedAt: new Date().toISOString(),
                source: 'public_onboarding',
              }).catch((err) => console.error('[GitHub Job] Admin ingest failed:', err));
            } else {
              console.warn(`[GitHub Job] Skipping admin sync: GitHub repo not verified for onboarding ${job.onboardingId}`);
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
