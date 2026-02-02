/**
 * Normaliserar ett error-värde till en säker sträng för rendering i JSX.
 * Förhindrar React crash när objekt renderas direkt som JSX.
 * 
 * @param err - Error-värde av vilken typ som helst
 * @returns Säker sträng för rendering
 */
export function normalizeError(err: unknown): string {
  if (!err) return 'Ett oväntat fel inträffade';
  
  // Redan en sträng
  if (typeof err === 'string') return err;
  
  // Error-objekt
  if (err instanceof Error) return err.message;
  
  // Objekt med message-property
  if (typeof err === 'object' && err !== null) {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message) {
      return obj.message;
    }
    if (typeof obj.error === 'string' && obj.error) {
      return obj.error;
    }
    // Försök stringify (men catch om det misslyckas)
    try {
      const str = JSON.stringify(err);
      // Om det är ett tomt objekt eller bara {}
      if (str === '{}' || str === 'null') {
        return 'Ett oväntat fel inträffade';
      }
      return str;
    } catch {
      return 'Ett oväntat fel inträffade';
    }
  }
  
  // Primitiva värden
  if (typeof err === 'number' || typeof err === 'boolean') {
    return String(err);
  }
  
  return 'Ett oväntat fel inträffade';
}
