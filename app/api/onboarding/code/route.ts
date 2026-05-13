import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRepoAccess, parseGitHubRepoUrl } from '@/lib/github/repo-utils';
import { listOnboardingEvents, isGithubRepoVerifiedFromEvents } from '@/lib/storage/onboarding-events';
import { auth0 } from '@/lib/auth0';
import { triggerExternalGitHubWorker } from '@/lib/utils/github-worker';
import { streamUploadToWorker } from '@/lib/utils/worker-upload';
import { createGitHubJob } from '@/lib/storage/github-jobs';

/**
 * Sanitize filename: keep only alphanumerics, dots, dashes, underscores.
 * Prevents path traversal and worker-side injection.
 */
const FILENAME_RE = /[^a-zA-Z0-9._-]/g;
function sanitizeFilename(name: string): string {
  return name.replace(FILENAME_RE, '_').slice(0, 128);
}

export async function POST(request: Request) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const session = await auth0.getSession();

    if (!session?.user?.sub) {
      console.warn('[Onboarding Code] POST called without Auth0 authentication');
      return NextResponse.json(
        { error: 'AUTH_REQUIRED', message: 'User must be authenticated to submit code' },
        { status: 401 }
      );
    }

    const userSub = session.user.sub;
    console.log('[Onboarding Code] Using Auth0 userSub:', userSub);

    // ── Parse multipart/form-data ─────────────────────────────────────────────
    // TODO: replace with streaming multipart parser for files >32MB.
    // Next.js buffers the entire body when calling request.formData().
    // For now this is acceptable — worker handles large repos via OAuth/GitHub API.
    const formData = await request.formData();
    const providedOnboardingId = formData.get('onboardingId')?.toString();

    if (!providedOnboardingId) {
      return NextResponse.json(
        { success: false, error: 'MISSING_ONBOARDING_ID', message: 'Missing onboardingId. Call POST /api/onboarding/start first.' },
        { status: 400 }
      );
    }

    const onboardingId = providedOnboardingId;
    console.log('[Onboarding Code] Using onboardingId:', onboardingId);

    const repoLink = String(formData.get('repoLink') || '').trim();
    const codeText = String(formData.get('codeText') || '').trim();
    const file = formData.get('file') as File | null;

    // ── Plaintext removed in Phase 5 ─────────────────────────────────────────
    // Keep frontend backward-compatible until Phase 5b updates the UI.
    if (codeText && !repoLink && !file) {
      return NextResponse.json(
        { success: false, error: 'PLAINTEXT_NOT_SUPPORTED', message: 'Plaintext code submission is no longer supported. Upload a ZIP or provide a GitHub repo URL.' },
        { status: 400 }
      );
    }

    // ── Require at least one input ────────────────────────────────────────────
    if (!repoLink && !file) {
      return NextResponse.json(
        { success: false, error: 'MISSING_INPUT', message: 'Provide a GitHub repo URL or a ZIP file.' },
        { status: 400 }
      );
    }

    // ── Gate: repoLink requires github_repo_verified (single check) ───────────
    // This is the ONLY place this check runs. The duplicate further down has been removed.
    if (repoLink) {
      const events = await listOnboardingEvents(onboardingId);
      const githubVerification = isGithubRepoVerifiedFromEvents(events);

      if (!githubVerification.verified) {
        // Check if the repo is actually private before blocking
        const access = await checkRepoAccess(repoLink);
        const repoIsPrivate = !access.ok || access.private;

        if (repoIsPrivate) {
          console.warn('[Onboarding Code] HARD BLOCK: private repoLink without github_repo_verified', {
            onboardingId,
            repoLink,
          });
          return NextResponse.json(
            {
              success: false,
              error: 'GITHUB_OAUTH_REQUIRED',
              message: 'GitHub-repo kräver OAuth-auktorisering innan kod kan laddas upp.',
              nextStep: 'github_auth',
            },
            { status: 403 }
          );
        }
      }
    }

    // ── Branch: ZIP file upload ───────────────────────────────────────────────
    if (file) {
      const rawFilename = file.name || 'upload.zip';
      const filename = sanitizeFilename(rawFilename);
      const jobId = crypto.randomBytes(16).toString('hex'); // 32-char hex, matches worker regex

      console.log('[Onboarding Code] ZIP upload — streaming to worker', { jobId, onboardingId, filename, size: file.size });

      // Skapa GCS job-record så polling-endpointen kan hitta jobbet.
      // Utan detta returnerar /api/github/job?jobId=... alltid 404 → polling
      // fastnar för evigt → user-flödet kommer aldrig till Stripe-steget.
      try {
        await createGitHubJob({
          jobId,
          onboardingId,
          userSub,
          status: 'running',
        });
      } catch (err) {
        console.error('[Onboarding Code] Failed to create job record:', err);
        return NextResponse.json(
          { success: false, error: 'JOB_STORE_UNAVAILABLE', message: 'Could not create job record.' },
          { status: 502 }
        );
      }

      let workerResponse: Response;
      try {
        workerResponse = await streamUploadToWorker({
          jobId,
          onboardingId,
          filename,
          body: file.stream() as unknown as ReadableStream,
        });
      } catch (err) {
        console.error('[Onboarding Code] Worker upload error:', err);
        return NextResponse.json(
          { success: false, error: 'WORKER_UNAVAILABLE', message: 'Could not reach GitHub worker.' },
          { status: 502 }
        );
      }

      if (!workerResponse.ok) {
        const workerBody = await workerResponse.json().catch(() => null);
        console.error('[Onboarding Code] Worker rejected ZIP upload', { status: workerResponse.status, body: workerBody });
        return NextResponse.json(
          { success: false, error: 'WORKER_ERROR', workerStatus: workerResponse.status, workerBody },
          { status: workerResponse.status >= 400 && workerResponse.status < 500 ? workerResponse.status : 502 }
        );
      }

      return NextResponse.json({
        success: true,
        job: { status: 'started', jobId },
      });
    }

    // ── Branch: GitHub repo URL ───────────────────────────────────────────────
    if (repoLink) {
      const parsed = parseGitHubRepoUrl(repoLink);
      if (!parsed) {
        return NextResponse.json(
          { success: false, error: 'INVALID_REPO_URL', message: 'Could not parse GitHub repo URL. Expected https://github.com/owner/repo.' },
          { status: 400 }
        );
      }

      const repoSlug = `${parsed.owner}/${parsed.repo}`;

      // If OAuth-verified, the OAuth callback has already started a job — don't trigger a second one.
      const events = await listOnboardingEvents(onboardingId);
      const githubVerification = isGithubRepoVerifiedFromEvents(events);
      if (githubVerification.verified) {
        console.log('[Onboarding Code] GitHub repo already OAuth-verified, job started by callback', { onboardingId, repoSlug });
        return NextResponse.json({
          success: true,
          job: {
            status: 'already_running',
            message: 'GitHub job started by OAuth callback, poll /api/github/job',
          },
        });
      }

      // Public repo: trigger worker directly (no OAuth token needed)
      const jobId = crypto.randomBytes(16).toString('hex');

      console.log('[Onboarding Code] Public repo — triggering worker', { jobId, onboardingId, repoSlug });

      let result;
      try {
        result = await triggerExternalGitHubWorker(jobId, onboardingId, repoSlug, {});
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // Surface worker's HTTP status if embedded in error message
        const workerStatus = message.match(/worker failed: (\d+)/)?.[1];
        const status = workerStatus ? parseInt(workerStatus, 10) : 502;
        console.error('[Onboarding Code] Worker trigger error:', message);
        return NextResponse.json(
          { success: false, error: 'WORKER_ERROR', workerStatus: status, message },
          { status: status >= 400 && status < 600 ? status : 502 }
        );
      }

      return NextResponse.json({
        success: true,
        job: { status: 'started', jobId },
        workerResponse: result.body,
      });
    }

    // Should be unreachable given the guards above
    return NextResponse.json(
      { success: false, error: 'INTERNAL', message: 'Unhandled input combination.' },
      { status: 500 }
    );

  } catch (error) {
    console.error('[Onboarding Code] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'INTERNAL' }, { status: 500 });
  }
}
