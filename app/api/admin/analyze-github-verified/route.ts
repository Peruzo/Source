import { NextRequest, NextResponse } from 'next/server';
import { listAllOnboardingIds, listOnboardingEvents, OnboardingEvent } from '@/lib/storage/onboarding-events';
import { Storage } from '@google-cloud/storage';

const PROJECT_ID = process.env.GCP_PROJECT_ID;

/**
 * GET /api/admin/analyze-github-verified
 * 
 * READ-ONLY analys-endpoint för att identifiera onboarding-records där
 * github_repo_verified finns men GitHub OAuth inte kan verifieras retroaktivt.
 * 
 * Returnerar:
 * - onboardingId
 * - event-kedja (alla events)
 * - orsak (varför OAuth inte kan verifieras)
 */
export async function GET(request: NextRequest) {
  const BUCKET =
    process.env.GCS_BUCKET_CODE_PACKAGES ??
    process.env.GCS_BUCKET_ONBOARDING;

  if (!BUCKET) {
    return NextResponse.json(
      {
        error: 'GCS bucket not configured',
        detail: 'Neither GCS_BUCKET_CODE_PACKAGES nor GCS_BUCKET_ONBOARDING is set',
      },
      { status: 500 }
    );
  }

  try {
    // Hämta alla onboardingId
    const allOnboardingIds = await listAllOnboardingIds();
    console.log(`[Analyze GitHub Verified] Found ${allOnboardingIds.length} onboarding IDs`);

    const results: Array<{
      onboardingId: string;
      events: OnboardingEvent[];
      hasGithubRepoVerified: boolean;
      githubRepoVerifiedEvent?: OnboardingEvent;
      hasGitHubJobWithToken: boolean;
      githubJobIds: string[];
      reason: string;
    }> = [];

    // För varje onboardingId, kontrollera om det har github_repo_verified
    for (const onboardingId of allOnboardingIds) {
      const events = await listOnboardingEvents(onboardingId);
      
      // Hitta github_repo_verified event
      const githubRepoVerifiedEvent = events.find(
        (e) => e.type === 'github_repo_verified'
      );

      if (!githubRepoVerifiedEvent) {
        // Inte relevant för denna analys
        continue;
      }

      // Hitta GitHub-jobb för detta onboardingId
      // Jobbnamn: github-jobs/{jobId}.json där jobId kan innehålla onboardingId
      const storage = new Storage(PROJECT_ID ? { projectId: PROJECT_ID } : undefined);
      const bucket = storage.bucket(BUCKET);
      const [allJobFiles] = await bucket.getFiles({ prefix: 'github-jobs/' });

      const relevantJobs = allJobFiles.filter((file) => {
        try {
          const fileName = file.name;
          // JobId format: {onboardingId}-{timestamp}
          return fileName.includes(onboardingId);
        } catch {
          return false;
        }
      });

      // Läs jobb-filer och kontrollera om någon har githubToken
      const githubJobIds: string[] = [];
      let hasGitHubJobWithToken = false;

      for (const jobFile of relevantJobs) {
        try {
          const [contents] = await jobFile.download();
          const job = JSON.parse(contents.toString('utf8')) as {
            jobId: string;
            onboardingId: string;
            githubToken?: string;
          };

          if (job.onboardingId === onboardingId) {
            githubJobIds.push(job.jobId);
            if (job.githubToken) {
              hasGitHubJobWithToken = true;
            }
          }
        } catch (err) {
          console.error(`[Analyze GitHub Verified] Error reading job ${jobFile.name}:`, err);
        }
      }

      // Bestäm orsak
      let reason: string;
      if (hasGitHubJobWithToken) {
        reason = 'OK: GitHub-jobb med OAuth-token finns (kan vara temporärt)';
      } else if (githubJobIds.length > 0) {
        reason = 'PROBLEM: GitHub-jobb finns men saknar OAuth-token (token kan ha rensats)';
      } else {
        reason = 'PROBLEM: Inget GitHub-jobb finns för detta onboardingId (github_repo_verified skapades utan OAuth)';
      }

      results.push({
        onboardingId,
        events,
        hasGithubRepoVerified: true,
        githubRepoVerifiedEvent,
        hasGitHubJobWithToken,
        githubJobIds,
        reason,
      });
    }

    // Sortera resultat: problematiska först
    results.sort((a, b) => {
      if (a.reason.startsWith('PROBLEM') && !b.reason.startsWith('PROBLEM')) return -1;
      if (!a.reason.startsWith('PROBLEM') && b.reason.startsWith('PROBLEM')) return 1;
      return 0;
    });

    return NextResponse.json({
      summary: {
        totalOnboardingIds: allOnboardingIds.length,
        withGithubRepoVerified: results.length,
        problematic: results.filter((r) => r.reason.startsWith('PROBLEM')).length,
        ok: results.filter((r) => r.reason.startsWith('OK')).length,
      },
      results,
    });
  } catch (error) {
    console.error('[Analyze GitHub Verified] Error:', error);
    return NextResponse.json(
      {
        error: 'ANALYSIS_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
