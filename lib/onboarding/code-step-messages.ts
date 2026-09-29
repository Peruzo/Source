/**
 * Svenska meddelanden för kodsteget i onboardingen.
 *
 * Råa API-koder och engelska servertexter visas aldrig för användaren: varje känd kod
 * får en svensk text, och okända koder faller tillbaka till ett generellt meddelande.
 */

const GENERIC = 'Något gick fel. Försök igen, eller kontakta support om problemet kvarstår.';

/** Felkoder i JSON-svar från /api/onboarding/code och upload-routerna. */
const API_ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND:
    'Vi hittar inte din onboarding. Din inloggning kan ha gått ut – ladda om sidan och logga in igen.',
  MISSING_ONBOARDING_ID: 'Onboarding är inte initierad. Ladda om sidan.',
  ONBOARDING_NOT_INITIALIZED:
    'Onboarding-sessionen är inte korrekt initierad. Ladda om sidan eller starta onboarding på nytt.',
  MISSING_INPUT: 'Lägg till en ZIP-fil eller en länk till ett GitHub-repo.',
  PLAINTEXT_NOT_SUPPORTED:
    'Inklistrad kod stöds inte längre. Ladda upp en ZIP-fil eller ange en länk till ett GitHub-repo.',
  INVALID_REPO_URL: 'Länken ser inte ut som ett GitHub-repo. Använd formatet https://github.com/ägare/repo.',
  GITHUB_OAUTH_REQUIRED:
    'Detta är ett privat GitHub-repo.\n\nDu måste först auktorisera GitHub för att vi ska kunna läsa repot.',
  WORKER_ERROR: 'Vi kunde inte hämta repot just nu. Försök igen om en stund.',
  WORKER_UNAVAILABLE: 'Vi kunde inte hämta repot just nu. Försök igen om en stund.',
  JOB_STORE_UNAVAILABLE: 'Vi kunde inte starta hämtningen just nu. Försök igen om en stund.',
  EVENT_STORE_UNAVAILABLE: 'Vi kunde inte spara uppladdningen just nu. Försök igen om en stund.',
  BUCKET_NOT_CONFIGURED: 'Uppladdning är inte tillgänglig just nu. Kontakta support.',
  INVALID_JSON: GENERIC,
  MISSING_FIELDS: GENERIC,
  INVALID_CONTENT_TYPE: 'Filen måste vara en ZIP-fil.',
  INVALID_EXTENSION: 'Filen måste vara en ZIP-fil (.zip).',
  FILE_TOO_LARGE: 'Filen är för stor. Kontakta support om du behöver skicka en större fil.',
  INVALID_GCS_PATH: GENERIC,
  INTERNAL: GENERIC,
};

/** Felkoder i ?github=... när GitHub-routerna skickar tillbaka användaren till kodsteget. */
const GITHUB_RETURN_MESSAGES: Record<string, string> = {
  denied: 'GitHub-kopplingen avbröts.',
  error: 'Kunde inte koppla eller hämta repot. Försök igen.',
  download_failed: 'Kunde inte koppla eller hämta repot. Försök igen.',
  upload_failed: 'Uppladdning till lagring misslyckades. Försök igen.',
  payload_too_large: 'Repot är för stort. Kontakta support om problemet kvarstår.',
  payload_error: 'Fel i överföringen. Kontakta support om problemet kvarstår.',
  invalid_repo: 'Länken ser inte ut som ett GitHub-repo. Använd formatet https://github.com/ägare/repo.',
  not_initialized: 'Onboarding är inte initierad. Ladda om sidan.',
  not_found: API_ERROR_MESSAGES.NOT_FOUND,
  invalid_onboarding_state:
    'GitHub kan bara kopplas medan kodsteget pågår. Ladda om sidan för att se var du är i onboardingen.',
  invalid_state: 'GitHub-kopplingen kunde inte slutföras. Försök igen.',
  oauth_state_invalid:
    'GitHub-kopplingen kunde inte slutföras, eller så har den redan använts. Klistra in repo-länken igen och klicka på "Fortsätt till Stripe" för att starta om.',
  oauth_state_expired:
    'GitHub-kopplingen tog för lång tid och har gått ut. Klistra in repo-länken igen och klicka på "Fortsätt till Stripe" för att starta om.',
  oauth_state_mismatch:
    'GitHub-kopplingen måste slutföras i samma webbläsare och med samma inloggning som den startades i. Klistra in repo-länken igen och klicka på "Fortsätt till Stripe" för att starta om.',
  oauth_unavailable: 'GitHub-kopplingen är inte tillgänglig just nu. Försök igen om en stund.',
  not_configured: 'GitHub-kopplingen är inte tillgänglig just nu. Ladda upp en ZIP-fil eller kontakta support.',
  public_repo:
    'Repot är publikt och behöver ingen GitHub-inloggning. Klicka på "Fortsätt till Stripe" så hämtar vi det direkt.',
};

export function codeStepApiErrorMessage(code: unknown): string {
  return typeof code === 'string' && API_ERROR_MESSAGES[code] ? API_ERROR_MESSAGES[code] : GENERIC;
}

/** null om koden inte är en känd returkod (t.ex. 'processing'). */
export function githubReturnMessage(code: string | null): string | null {
  return code && GITHUB_RETURN_MESSAGES[code] ? GITHUB_RETURN_MESSAGES[code] : null;
}

/** Fel från jobbet (worker/callback) kan vara engelska; visa alltid svensk text. */
export function githubJobFailedMessage(): string {
  return 'Hämtningen av repot misslyckades. Kontrollera länken och försök igen.';
}

export const JOB_LOST_MESSAGE =
  'Vi tappade kontakten med hämtningen av repot. Ladda om sidan och försök igen.';
