export type SvgTextBlockLine = {
  text: string;
  x: number;
  y: number;
};

export type SvgTextBlockOptions = {
  x: number;
  y: number;
  width: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fill: string;
  maxLines?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  className?: string;
  dataComponent?: string;
};

export type SvgTextBlockResult = {
  svg: string;
  lines: SvgTextBlockLine[];
  didOverflow: boolean;
  height: number;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.54;
}

function wrapText(
  text: string,
  width: number,
  fontSize: number,
  maxLines = Number.POSITIVE_INFINITY,
): {
  lines: string[];
  didOverflow: boolean;
} {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return {
      lines: [],
      didOverflow: false,
    };
  }

  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (estimateTextWidth(nextLine, fontSize) <= width) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word);
      currentLine = '';
    }

    if (lines.length >= maxLines) {
      return {
        lines,
        didOverflow: true,
      };
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  const didOverflow = lines.length > maxLines;

  return {
    lines: lines.slice(0, maxLines),
    didOverflow,
  };
}

export function renderSvgTextBlock(
  options: SvgTextBlockOptions,
): SvgTextBlockResult {
  const {
    x,
    y,
    width,
    text,
    fontFamily,
    fontSize,
    fontWeight = 600,
    lineHeight = 1.1,
    letterSpacing,
    fill,
    maxLines,
    textAnchor = 'start',
    className,
    dataComponent = 'svg-text-block',
  } = options;

  const wrapped = wrapText(text, width, fontSize, maxLines);
  const lineStep = fontSize * lineHeight;

  const lines: SvgTextBlockLine[] = wrapped.lines.map((line, index) => ({
    text: line,
    x,
    y: y + index * lineStep,
  }));

  const classAttribute = className ? ` class="${escapeXml(className)}"` : '';
  const letterSpacingAttribute =
    typeof letterSpacing === 'number'
      ? ` letter-spacing="${letterSpacing}"`
      : '';

  const svg = `
    <g data-component="${escapeXml(dataComponent)}"${classAttribute}>
      ${lines
        .map(
          line => `
            <text
              x="${line.x}"
              y="${line.y}"
              font-family="${escapeXml(fontFamily)}"
              font-size="${fontSize}"
              font-weight="${fontWeight}"
              fill="${fill}"
              text-anchor="${textAnchor}"
              ${letterSpacingAttribute}
            >${escapeXml(line.text)}</text>
          `,
        )
        .join('')}
    </g>
  `;

  return {
    svg,
    lines,
    didOverflow: wrapped.didOverflow,
    height: lines.length > 0 ? (lines.length - 1) * lineStep + fontSize : 0,
  };
}