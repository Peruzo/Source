/**
 * Villkorsgodkännande i onboardingen.
 *
 * LEGAL_TERMS_VERSION är den ENDA platsen där villkorsversionen definieras. Klienten
 * skickar den version kunden kryssat för, servern godtar bara den aktuella och sparar
 * godkännandet som ett eget event (terms_accepted) med tidsstämpel satt på servern.
 *
 * Modulen är ren (inga importer, ingen IO) så att samma validering körs i klienten,
 * i API-routen och i fristående tester.
 */

export const LEGAL_TERMS_VERSION = '2026-09-30';

/** Dokument som måste vara aktivt ikryssade innan onboardingen kan skickas vidare. */
export const LEGAL_DOCUMENTS = ['terms', 'privacy', 'dpa'] as const;

export type LegalDocument = (typeof LEGAL_DOCUMENTS)[number];

export const LEGAL_DOCUMENT_PATHS: Record<LegalDocument, string> = {
  terms: '/legal/terms',
  privacy: '/legal/privacy',
  dpa: '/legal/dpa',
};

/** Det klienten skickar: vilken version och vilka dokument kunden kryssat för. */
export type TermsAcceptanceInput = {
  termsVersion: string;
  documents: LegalDocument[];
};

/** Det som sparas i terms_accepted-eventet. Ingen IP-adress. */
export type TermsAcceptanceRecord = {
  termsVersion: string;
  documents: LegalDocument[];
  acceptedAt: string;
  userSub: string;
  onboardingId: string;
};

export const TERMS_NOT_ACCEPTED_MESSAGE =
  `Du behöver kryssa i att du godkänner användarvillkoren, har tagit del av integritetspolicyn och godkänner personuppgiftsbiträdesavtalet (version ${LEGAL_TERMS_VERSION}) innan du går vidare.`;

function isLegalDocument(value: unknown): value is LegalDocument {
  return typeof value === 'string' && (LEGAL_DOCUMENTS as readonly string[]).includes(value);
}

/**
 * Validerar klientens godkännande. Kräver aktuell version och att ALLA dokument i
 * LEGAL_DOCUMENTS finns med; okända dokument eller dubbletter avvisas.
 */
export function parseTermsAcceptance(
  value: unknown
): { ok: true; value: TermsAcceptanceInput } | { ok: false; reason: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, reason: 'missing' };
  }
  const { termsVersion, documents } = value as { termsVersion?: unknown; documents?: unknown };
  if (termsVersion !== LEGAL_TERMS_VERSION) {
    return { ok: false, reason: 'wrong_version' };
  }
  if (!Array.isArray(documents) || !documents.every(isLegalDocument)) {
    return { ok: false, reason: 'invalid_documents' };
  }
  const unique = new Set(documents);
  if (unique.size !== documents.length || !LEGAL_DOCUMENTS.every((doc) => unique.has(doc))) {
    return { ok: false, reason: 'incomplete_documents' };
  }
  return { ok: true, value: { termsVersion, documents: [...LEGAL_DOCUMENTS] } };
}

/** Bygger det sparade godkännandet. acceptedAt sätts här, på servern. */
export function buildTermsAcceptanceRecord(
  input: TermsAcceptanceInput,
  userSub: string,
  onboardingId: string,
  now: Date = new Date()
): TermsAcceptanceRecord {
  return {
    termsVersion: input.termsVersion,
    documents: [...input.documents],
    acceptedAt: now.toISOString(),
    userSub,
    onboardingId,
  };
}

/**
 * Sant bara för ett sparat godkännande med tidsstämpel, AKTUELL version och alla
 * dokument. Används för att återställa kundens egna kryss från ett tidigare besök.
 */
export function isCurrentTermsAcceptance(record: unknown): record is TermsAcceptanceRecord {
  if (!record || typeof record !== 'object') return false;
  const r = record as Partial<TermsAcceptanceRecord>;
  if (r.termsVersion !== LEGAL_TERMS_VERSION) return false;
  if (typeof r.acceptedAt !== 'string' || Number.isNaN(Date.parse(r.acceptedAt))) return false;
  return parseTermsAcceptance({ termsVersion: r.termsVersion, documents: r.documents }).ok;
}
