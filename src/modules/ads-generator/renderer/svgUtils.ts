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
        >${escapeXml(line)}</text>
      `;
    })
    .join('');
}