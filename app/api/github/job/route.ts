import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getGitHubJob } from '@/lib/storage/github-jobs';

/**
 * GET /api/github/job?jobId=...
 * Hämtar status för ett GitHub import-jobb.
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

    const job = await getGitHubJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verifiera att jobbet tillhör användaren
    if (job.userSub !== session.user.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Rensa känslig data från response (token ska aldrig exponeras)
    const { githubToken, ...safeJob } = job;

    return NextResponse.json({ 
      job: safeJob,
      // Progress information för UI
      progress: job.progress,
      status: job.status,
    });
  } catch (error) {
    console.error('[GitHub Job] Error:', error);
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}
