/**
 * Kundportalens och hemsidans felkoder → kundtexter på svenska. Branschneutrala och utan
 * tekniska detaljer; samma text oavsett var felet uppstod.
 */

export const ERROR_MESSAGES: Readonly<Record<string, string>> = Object.freeze({
  UNAUTHORIZED: 'Tjänsten är inte tillgänglig just nu. Försök igen om en stund.',
  NOT_FOUND: 'Vi hittar inte ditt utkast. Ladda om sidan och försök igen.',
  INVALID_INPUT: 'Något i uppgifterna stämmer inte. Kontrollera och försök igen.',
  INVALID_JSON: 'Något i uppgifterna stämmer inte. Kontrollera och försök igen.',
  INVALID_ANSWERS: 'Några svar behöver kompletteras innan vi kan bygga din sajt.',
  NO_DEFINITION: 'Det finns ingen sajt att visa ännu. Skapa den först.',
  LIMIT_REACHED: 'Du har använt alla försök som ingår. Kontakta support så hjälper vi dig vidare.',
  RATE_LIMITED: 'Du har gjort många försök på kort tid. Vänta en minut och försök igen.',
  MODEL_ERROR: 'AI-tjänsten svarade inte som den skulle. Försök igen om en stund.',
  OUTPUT_TRUNCATED: 'Sajten blev för stor för att bli klar i ett svep. Försök igen, gärna med färre sektioner.',
  GENERATION_FAILED: 'Vi kunde inte bygga en sajt som håller vår kvalitet. Försök igen.',
  CONFIG_INVALID: 'Tjänsten är inte konfigurerad just nu. Kontakta support.',
  GENERATION_IN_PROGRESS: 'Din sajt håller redan på att byggas. Vänta tills den är klar.',
  PAYLOAD_TOO_LARGE: 'Texten är för lång. Korta den och försök igen.',
  TIMEOUT: 'Det tog för lång tid att få svar. Vi kontrollerar om din sajt blev klar.',
  NETWORK: 'Vi kunde inte nå tjänsten. Kontrollera anslutningen och försök igen.',
  INTERNAL: 'Något gick fel hos oss. Försök igen om en stund.',
});

export const DEFAULT_ERROR_MESSAGE = 'Något gick fel. Försök igen.';

export function messageFor(code: string | null | undefined): string {
  return (code && ERROR_MESSAGES[code]) || DEFAULT_ERROR_MESSAGE;
}

/** När taket är nått ska kunden kunna kontakta support direkt. */
export function suggestsSupport(code: string | null | undefined): boolean {
  return code === 'LIMIT_REACHED' || code === 'CONFIG_INVALID' || code === 'GENERATION_FAILED';
}
