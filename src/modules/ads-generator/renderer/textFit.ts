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
  width: number;
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

/**
 * SVG generujemy jako string, więc nie mamy tu dostępu do prawdziwego
 * Canvas TextMetrics. Ta funkcja jest konserwatywną estymacją szerokości.
 *
 * Cel: lepiej zawinąć tekst odrobinę wcześniej niż pozwolić mu wyjść poza aplę.
 */
function getCharWidthRatio(char: string, fallbackRatio: number): number {
  if (char === ' ') return 0.32;

  if (/[.,;:!|'"`]/.test(char)) return 0.24;
  if (/[ijlI1]/.test(char)) return 0.3;
  if (/[ft]/.test(char)) return 0.42;
  if (/[r]/.test(char)) return 0.44;
  if (/[mwMW]/.test(char)) return 0.86;

  if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(char)) {
    return Math.max(fallbackRatio, 0.64);
  }

  if (/[0-9]/.test(char)) {
    return Math.max(fallbackRatio, 0.56);
  }

  return fallbackRatio;
}

export function estimateTextWidth(
  text: string,
  fontSize: number,
  averageCharWidthRatio = 0.55,
): number {
  const normalized = normalizeText(text);

  if (!normalized) {
    return 0;
  }

  const ratioSum = Array.from(normalized).reduce((sum, char) => {
    return sum + getCharWidthRatio(char, averageCharWidthRatio);
  }, 0);

  /**
   * Guard bezpieczeństwa.
   * Roc Grotesk / Arial w SVG może optycznie zajmować więcej miejsca
   * niż prosta estymacja znaków.
   */
  const widthGuard = 1.07;

  return Math.ceil(ratioSum * fontSize * widthGuard);
}

function addEllipsis(text: string): string {
  const normalized = normalizeText(text);

  if (normalized.length <= 1) {
    return normalized;
  }

  const cleaned = normalized.replace(/[.,;:!?-]+$/, '');
  const shortened = cleaned.slice(0, Math.max(1, cleaned.length - 1));

  return `${shortened}…`;
}

function truncateTextToWidth(options: {
  text: string;
  fontSize: number;
  maxWidth: number;
  averageCharWidthRatio: number;
}): string {
  const { fontSize, maxWidth, averageCharWidthRatio } = options;

  let text = normalizeText(options.text);

  if (!text || maxWidth <= 0) {
    return '';
  }

  if (estimateTextWidth(text, fontSize, averageCharWidthRatio) <= maxWidth) {
    return text;
  }

  while (
    text.length > 1 &&
    estimateTextWidth(addEllipsis(text), fontSize, averageCharWidthRatio) >
      maxWidth
  ) {
    text = text.slice(0, -1);
  }

  const truncated = addEllipsis(text);

  if (estimateTextWidth(truncated, fontSize, averageCharWidthRatio) <= maxWidth) {
    return truncated;
  }

  return '';
}

function getLinesWidth(
  lines: string[],
  fontSize: number,
  averageCharWidthRatio: number,
): number {
  if (!lines.length) {
    return 0;
  }

  return Math.max(
    ...lines.map((line) =>
      estimateTextWidth(line, fontSize, averageCharWidthRatio),
    ),
  );
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

  if (!words.length || maxLines <= 0) {
    return { lines: [], truncated: false };
  }

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    const nextWidth = estimateTextWidth(
      nextLine,
      fontSize,
      averageCharWidthRatio,
    );

    if (nextWidth <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      /**
       * Pojedyncze słowo jest szersze niż maxWidth.
       * Na tym etapie go nie tniemy, bo fitTextBlock może jeszcze zejść
       * z fontem. Szerokość zostanie sprawdzona później.
       */
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

function clampLinesToWidth(options: {
  lines: string[];
  fontSize: number;
  maxWidth: number;
  averageCharWidthRatio: number;
}): { lines: string[]; truncated: boolean } {
  const { lines, fontSize, maxWidth, averageCharWidthRatio } = options;

  let truncated = false;

  const fittedLines = lines.map((line) => {
    const width = estimateTextWidth(line, fontSize, averageCharWidthRatio);

    if (width <= maxWidth) {
      return line;
    }

    truncated = true;

    return truncateTextToWidth({
      text: line,
      fontSize,
      maxWidth,
      averageCharWidthRatio,
    });
  });

  return {
    lines: fittedLines.filter(Boolean),
    truncated,
  };
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
      width: 0,
      height: 0,
      truncated: false,
    };
  }

  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {
    const lineHeight = Math.round(fontSize * lineHeightRatio);

    /**
     * Nie ma sensu pozwalać na więcej linii, niż fizycznie mieści maxHeight.
     */
    const heightLimitedMaxLines = Math.max(
      1,
      Math.min(maxLines, Math.floor(maxHeight / lineHeight)),
    );

    const { lines, truncated } = wrapText({
      text: normalized,
      fontSize,
      maxWidth,
      maxLines: heightLimitedMaxLines,
      averageCharWidthRatio,
    });

    const width = getLinesWidth(lines, fontSize, averageCharWidthRatio);
    const height = lines.length * lineHeight;

    if (!truncated && width <= maxWidth && height <= maxHeight) {
      return {
        lines,
        fontSize,
        lineHeight,
        width,
        height,
        truncated: false,
      };
    }
  }

  /**
   * Fallback: minimalny font + ewentualne przycięcie za długich linii.
   */
  const lineHeight = Math.round(minFontSize * lineHeightRatio);
  const heightLimitedMaxLines = Math.max(
    1,
    Math.min(maxLines, Math.floor(maxHeight / lineHeight)),
  );

  const wrapped = wrapText({
    text: normalized,
    fontSize: minFontSize,
    maxWidth,
    maxLines: heightLimitedMaxLines,
    averageCharWidthRatio,
  });

  const clamped = clampLinesToWidth({
    lines: wrapped.lines,
    fontSize: minFontSize,
    maxWidth,
    averageCharWidthRatio,
  });

  const lines = clamped.lines;
  const width = getLinesWidth(lines, minFontSize, averageCharWidthRatio);

  return {
    lines,
    fontSize: minFontSize,
    lineHeight,
    width,
    height: lines.length * lineHeight,
    truncated: wrapped.truncated || clamped.truncated,
  };
}

export function fitSingleLineText(
  options: FitSingleLineOptions,
): FitSingleLineResult {
  const {
    text,
    maxWidth,
    maxFontSize,
    minFontSize,
    averageCharWidthRatio = 0.55,
  } = options;

  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      text: '',
      fontSize: maxFontSize,
      width: 0,
      truncated: false,
    };
  }

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

  const finalText = truncateTextToWidth({
    text: normalized,
    fontSize: minFontSize,
    maxWidth,
    averageCharWidthRatio,
  });

  return {
    text: finalText,
    fontSize: minFontSize,
    width: estimateTextWidth(finalText, minFontSize, averageCharWidthRatio),
    truncated: true,
  };
}