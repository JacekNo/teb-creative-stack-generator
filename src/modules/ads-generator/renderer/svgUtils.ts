export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderTextLines(options: {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  lineHeight: number;
  fill: string;
  weight?: number;
  letterSpacing?: number;
  dominantBaseline?: 'alphabetic' | 'middle' | 'central';
}): string {
  const {
    lines,
    x,
    y,
    fontSize,
    lineHeight,
    fill,
    weight = 800,
    letterSpacing = -1.2,
    dominantBaseline = 'alphabetic',
  } = options;

  return lines
    .map((line, index) => {
      const lineY = y + index * lineHeight;

      return `
        <text
          x="${x}"
          y="${lineY}"
          font-family="Roc Grotesk, Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="${weight}"
          letter-spacing="${letterSpacing}"
          fill="${fill}"
          dominant-baseline="${dominantBaseline}"
        >${escapeXml(line)}</text>
      `;
    })
    .join('');
}