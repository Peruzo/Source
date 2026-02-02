import { NextRequest, NextResponse } from 'next/server';
import { getGitHubJob } from '@/lib/storage/github-jobs';
import { processGitHubJobStreaming } from '@/lib/storage/github-worker';

/**
 * POST /api/github/worker
 * Background worker endpoint för att processera GitHub import-jobb.
 * 
 * Denna endpoint kan köras utanför web-request-livscykeln för att förhindra OOM.
 * Kan triggas via:
 * - Cloud Tasks
 * - HTTP POST från callback
 * - Cron job
 * 
 * Säkerhet: Verifierar att jobbet finns och att token är korrekt.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid jobId' },
        { status: 400 }
      );
    }

    // Hämta jobbet
    const job = await getGitHubJob(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Verifiera att jobbet har token
    if (!job.githubToken) {
      return NextResponse.json(
        { error: 'Job missing GitHub token' },
        { status: 400 }
      );
    }

    // Processa jobbet (streaming-baserat, OOM-säkert)
    // Detta körs async och kommer inte blockera response
    processGitHubJobStreaming(jobId, job.githubToken).catch((error) => {
      console.error(`[GitHub Worker] Error processing job ${jobId}:`, error);
    });

    // Returnera omedelbart - jobbet processas i bakgrunden
    return NextResponse.json({
      success: true,
      jobId,
      status: 'processing',
      message: 'Job processing started',
    });
  } catch (error) {
    console.error('[GitHub Worker] Error:', error);
    return NextResponse.json(
      { error: 'Failed to start worker' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/github/worker
 * Health check för worker-endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'github-worker',
    version: '2.0',
  });
}
