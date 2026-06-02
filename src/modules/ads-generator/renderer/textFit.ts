export interface FitTextBlockOptions {
  text: string;
  maxWidth: number;
  maxHeight: number;
  maxLines: number;
  maxFontSize: number;
  minFontSize: number;
  lineHeightRatio?: number;
  averageCharWidthRatio?: number;
}

export interface FitTextBlockResult {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  height: number;
  truncated: boolean;
}

export interface FitSingleLineOptions {
  text: string;
  maxWidth: number;
  maxFontSize: number;
  minFontSize: number;
  averageCharWidthRatio?: number;
}

export interface FitSingleLineResult {
  text: string;
  fontSize: number;
  width: number;
  truncated: boolean;
}

export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function estimateTextWidth(
  text: string,
  fontSize: number,
  averageCharWidthRatio = 0.55,
): number {
  return Math.ceil(normalizeText(text).length * fontSize * averageCharWidthRatio);
}

function addEllipsis(text: string): string {
  const normalized = normalizeText(text);

  if (normalized.length <= 1) {
    return normalized;
  }

  return `${normalized.replace(/[.,;:!?-]+$/, '').slice(0, Math.max(1, normalized.length - 1))}…`;
}

function wrapText(options: {
  text: string;
  fontSize: number;
  maxWidth: number;
  maxLines: number;
  averageCharWidthRatio: number;
}): { lines: string[]; truncated: boolean } {
  const { text, fontSize, maxWidth, maxLines, averageCharWidthRatio } = options;

  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';
  let truncated = false;

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    const nextWidth = estimateTextWidth(nextLine, fontSize, averageCharWidthRatio);

    if (nextWidth <= maxWidth) {
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
      truncated = true;
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    truncated = true;
    lines.length = maxLines;
  }

  if (truncated && lines.length) {
    lines[lines.length - 1] = addEllipsis(lines[lines.length - 1]);
  }

  return { lines, truncated };
}

export function fitTextBlock(options: FitTextBlockOptions): FitTextBlockResult {
  const {
    text,
    maxWidth,
    maxHeight,
    maxLines,
    maxFontSize,
    minFontSize,
    lineHeightRatio = 1.08,
    averageCharWidthRatio = 0.55,
  } = options;

  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      lines: [],
      fontSize: maxFontSize,
      lineHeight: Math.round(maxFontSize * lineHeightRatio),
      height: 0,
      truncated: false,
    };
  }

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
    const lineHeight = Math.round(fontSize * lineHeightRatio);
    const { lines, truncated } = wrapText({
      text: normalized,
      fontSize,
      maxWidth,
      maxLines,
      averageCharWidthRatio,
    });

    const height = lines.length * lineHeight;

    if (!truncated && height <= maxHeight) {
      return {
        lines,
        fontSize,
        lineHeight,
        height,
        truncated: false,
      };
    }
  }

  const lineHeight = Math.round(minFontSize * lineHeightRatio);
  const { lines, truncated } = wrapText({
    text: normalized,
    fontSize: minFontSize,
    maxWidth,
    maxLines,
    averageCharWidthRatio,
  });

  return {
    lines,
    fontSize: minFontSize,
    lineHeight,
    height: lines.length * lineHeight,
    truncated,
  };
}

export function fitSingleLineText(options: FitSingleLineOptions): FitSingleLineResult {
  const {
    text,
    maxWidth,
    maxFontSize,
    minFontSize,
    averageCharWidthRatio = 0.55,
  } = options;

  const normalized = normalizeText(text);

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
    const width = estimateTextWidth(normalized, fontSize, averageCharWidthRatio);

    if (width <= maxWidth) {
      return {
        text: normalized,
        fontSize,
        width,
        truncated: false,
      };
    }
  }

  let truncatedText = normalized;

  while (
    truncatedText.length > 1 &&
    estimateTextWidth(addEllipsis(truncatedText), minFontSize, averageCharWidthRatio) > maxWidth
  ) {
    truncatedText = truncatedText.slice(0, -1);
  }

  const finalText = addEllipsis(truncatedText);

  return {
    text: finalText,
    fontSize: minFontSize,
    width: estimateTextWidth(finalText, minFontSize, averageCharWidthRatio),
    truncated: true,
  };
}