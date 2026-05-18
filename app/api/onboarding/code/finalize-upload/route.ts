import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { patchAdminOnboarding } from '@/lib/api/admin-portal';
import { appendOnboardingEvent } from '@/lib/storage/onboarding-events';

const BUCKET = process.env.GCS_BUCKET_CODE_PACKAGES || process.env.GCS_BUCKET_ONBOARDING;

/**
 * POST /api/onboarding/code/finalize-upload
 *
 * Bug 8: Frontend pingar denna EFTER att ZIP är uppladdad till GCS.
 * Vi PATCHar admin-portalen med storageObjectUrl + appendar code_submitted-event.
 *
 * Mönstret är samma som worker (upload-job.js) gör i Step D, fast initierat
 * från Source istället för worker eftersom workern aldrig såg ZIP:en.
 *
 * Body: { onboardingId, jobId, gcsPath, fileName, fileSize }
 * Returns: { success, job: { status: 'completed', jobId } }
 */
export async function POST(request: Request) {
  try {
    // Auth
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json(
        { success: false, error: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const { onboardingId, jobId, gcsPath, fileName, fileSize } = body;

    if (!onboardingId || !jobId || !gcsPath || !fileName) {
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS', message: 'onboardingId, jobId, gcsPath, fileName required' },
        { status: 400 }
      );
    }

    // Validera gcsPath-format för säkerhet
    if (!gcsPath.match(/^gs:\/\/[^/]+\/upload\/[a-f0-9]{32}\.zip$/)) {
      return NextResponse.json(
        { success: false, error: 'INVALID_GCS_PATH', message: 'gcsPath måste vara gs://bucket/upload/{jobId}.zip' },
        { status: 400 }
      );
    }

    console.log('[Finalize Upload] Processing', { jobId, onboardingId, gcsPath, fileSize });

    // PATCH admin-portalen så onboarding visar "har kod" (samma payload-form som worker)
    try {
      await patchAdminOnboarding(onboardingId, 'code', {
        codePackage: {
          type: 'upload',
          status: 'received',
          upload: {
            storageObjectUrl: gcsPath,
            filename: fileName,
            sizeBytes: fileSize || 0,
          },
        },
      });
    } catch (err) {
      console.error('[Finalize Upload] Admin PATCH failed (non-blocking):', err);
      // Non-blocking: admin draft kanske inte finns ännu (skapas senare via 'Skapa kund'-knapp)
    }

    // Appenda code_submitted-event så FSM uppdateras till code_completed.
    // Payload-struktur matchar OnboardingEventInput['code_submitted'].
    try {
      await appendOnboardingEvent(onboardingId, {
        type: 'code_submitted',
        payload: {
          codeSource: 'upload',
          storageObjectUrl: gcsPath,
          fileName,
        },
      });
    } catch (err) {
      console.error('[Finalize Upload] Event append failed:', err);
      return NextResponse.json(
        { success: false, error: 'EVENT_STORE_UNAVAILABLE' },
        { status: 502 }
      );
    }

    console.log('[Finalize Upload] Completed', { jobId, onboardingId });

    return NextResponse.json({
      success: true,
      job: { status: 'completed', jobId, gcsPath },
    });
  } catch (error) {
    console.error('[Finalize Upload] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
