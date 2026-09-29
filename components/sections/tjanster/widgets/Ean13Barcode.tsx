/*
 * A real EAN-13 barcode drawn as SVG, so the scanning widget shows a code a
 * scanner could read rather than decorative stripes. Use numbers in the GS1
 * "200–299" range (restricted circulation, for in-store use): they never
 * belong to a real product.
 */

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const G = R.map((code) => code.split('').reverse().join(''));
// Which of the six left digits use the G set, by the first digit.
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/** Adds the check digit to 12 digits. */
export function ean13(first12: string): string {
  if (!/^\d{12}$/.test(first12)) throw new Error('ean13 needs exactly 12 digits');
  const sum = first12
    .split('')
    .reduce((acc, d, i) => acc + Number(d) * (i % 2 === 0 ? 1 : 3), 0);
  return first12 + ((10 - (sum % 10)) % 10);
}

function modules(code: string): string {
  const d = code.split('').map(Number);
  const parity = PARITY[d[0]];
  let bits = '101';
  for (let i = 1; i <= 6; i++) bits += (parity[i - 1] === 'L' ? L : G)[d[i]];
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += R[d[i]];
  return bits + '101';
}

export function Ean13Barcode({ code, className = '' }: { code: string; className?: string }) {
  const bits = modules(code);
  // 95 modules plus quiet zones; guard bars run a little longer, as printed.
  const quiet = 9;
  const width = bits.length + quiet * 2;
  const guard = (i: number) => i < 3 || (i >= 45 && i < 50) || i >= 92;

  return (
    <svg
      viewBox={`0 0 ${width} 62`}
      role="img"
      aria-label={`Streckkod EAN-13 ${code}`}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect width={width} height="62" fill="#fff" />
      {bits.split('').map((bit, i) =>
        bit === '1' ? (
          <rect key={i} x={quiet + i} y="3" width="1" height={guard(i) ? 50 : 45} fill="#111" />
        ) : null,
      )}
      <g fill="#111" fontSize="7.5" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" aria-hidden="true">
        <text x={quiet - 6} y="58">{code[0]}</text>
        <text x={quiet + 5} y="58" textLength="38" lengthAdjust="spacing">{code.slice(1, 7)}</text>
        <text x={quiet + 52} y="58" textLength="38" lengthAdjust="spacing">{code.slice(7)}</text>
      </g>
    </svg>
  );
}
