import { NextResponse } from 'next/server';

/**
 * DEPRECATED: POST /api/github/worker
 * 
 * Denna endpoint är deprecated. GitHub ZIP-hantering har flyttats till extern Cloud Run-worker.
 * 
 * Public website triggar nu extern worker direkt från callback:
 * - Extern worker: https://source-github-worker-809785351172.europe-north1.run.app
 * - Public website orkestrerar endast (skapar jobb, triggar worker)
 * - Worker hanterar all ZIP-streaming och GCS-upload
 * 
 * Denna endpoint behålls för backwards compatibility men returnerar 410 Gone.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'DEPRECATED',
      message: 'This endpoint is deprecated. GitHub import is handled by external worker.',
      externalWorker: process.env.GITHUB_WORKER_URL || 'Not configured',
    },
    { status: 410 }
  );
}

/**
 * GET /api/github/worker
 * Health check - returnerar info om extern worker.
 */
export async function GET() {
  return NextResponse.json({
    status: 'deprecated',
    service: 'github-worker',
    message: 'GitHub import handled by external worker',
    externalWorker: process.env.GITHUB_WORKER_URL || 'Not configured',
  });
}
