import type { SocialDesignSystem } from '../../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialCourseNameParts,
  TextFallbackValue,
} from '../../types/social.types';

export type SocialTitleTypographyKey =
  | 'heroXl'
  | 'heroLg'
  | 'heroMd'
  | 'heroSm'
  | 'heroXs';

export type SocialTitleFitLine = {
  text: string;
  isModeLabel?: boolean;
};

export type SocialTitleFit = {
  typographyKey: SocialTitleTypographyKey;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  lineHeightRatio: number;
  letterSpacing: number;
  lines: SocialTitleFitLine[];
  height: number;
  didFit: boolean;
};

const TITLE_VARIANTS: SocialTitleTypographyKey[] = [
  'heroXl',
  'heroLg',
  'heroMd',
  'heroSm',
  'heroXs',
];

function isTextFallbackValue(value: unknown): value is TextFallbackValue {
  return typeof value === 'object' && value !== null && 'full' in value;
}

function getTextValue(value: string | TextFallbackValue | undefined): string {
  if (!value) {
    return '';
  }

  if (isTextFallbackValue(value)) {
    return value.short ?? value.compact ?? value.full;
  }

  return value;
}

function estimateTextWidth(text: string, fontSize: number): number {
  const upperCaseRatio =
    text.length > 0
      ? text.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, '').length / text.length
      : 0;

  const averageGlyphWidth = upperCaseRatio > 0.45 ? 0.58 : 0.53;

  return text.length * fontSize * averageGlyphWidth;
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function resolveSocialCourseNameParts(
  creative: SocialCreativeData,
): SocialCourseNameParts {
  if (creative.courseNameParts) {
    return {
      main: normalizeWhitespace(getTextValue(creative.courseNameParts.main)),
      subtitle: normalizeWhitespace(getTextValue(creative.courseNameParts.subtitle)),
      modeLabel: normalizeWhitespace(getTextValue(creative.courseNameParts.modeLabel)),
    };
  }

  const normalizedName = normalizeWhitespace(creative.courseName);
  const onlineSuffix = /\s+ONLINE$/i;

  if (onlineSuffix.test(normalizedName)) {
    return {
      main: normalizeWhitespace(normalizedName.replace(onlineSuffix, '')),
      modeLabel: 'ONLINE',
    };
  }

  return {
    main: normalizedName,
  };
}

function wrapWords(
  text: string,
  width: number,
  fontSize: number,
): SocialTitleFitLine[] {
  const words = normalizeWhitespace(text).split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const lines: SocialTitleFitLine[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (estimateTextWidth(nextLine, fontSize) <= width) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push({ text: currentLine });
      currentLine = word;
      continue;
    }

    lines.push({ text: word });
  }

  if (currentLine) {
    lines.push({ text: currentLine });
  }

  return lines;
}

function wrapTitleParts({
  parts,
  width,
  fontSize,
}: {
  parts: SocialCourseNameParts;
  width: number;
  fontSize: number;
}): SocialTitleFitLine[] {
  const mainLines = wrapWords(getTextValue(parts.main), width, fontSize);
  const subtitleLines = wrapWords(getTextValue(parts.subtitle), width, fontSize);
  const modeLabel = getTextValue(parts.modeLabel);

  if (!modeLabel) {
    return [...mainLines, ...subtitleLines];
  }

  const lines = [...mainLines, ...subtitleLines];
  const lastLine = lines.at(-1);

  if (lastLine) {
    const merged = `${lastLine.text} ${modeLabel}`;

    if (estimateTextWidth(merged, fontSize) <= width) {
      return [
        ...lines.slice(0, -1),
        {
          text: merged,
          isModeLabel: true,
        },
      ];
    }
  }

  return [
    ...lines,
    {
      text: modeLabel,
      isModeLabel: true,
    },
  ];
}

function getTitleHeight({
  linesCount,
  fontSize,
  lineHeight,
}: {
  linesCount: number;
  fontSize: number;
  lineHeight: number;
}): number {
  if (linesCount === 0) {
    return 0;
  }

  return fontSize + Math.max(0, linesCount - 1) * lineHeight;
}

export function fitSocialCourseTitle({
  creative,
  system,
  width,
  maxHeight = Number.POSITIVE_INFINITY,
  maxLines = 3,
}: {
  creative: SocialCreativeData;
  system: SocialDesignSystem;
  width: number;
  maxHeight?: number;
  maxLines?: number;
}): SocialTitleFit {
  const parts = resolveSocialCourseNameParts(creative);
  let fallbackFit: SocialTitleFit | undefined;

  for (const typographyKey of TITLE_VARIANTS) {
    const typography = system.typography[typographyKey];
    const lines = wrapTitleParts({
      parts,
      width,
      fontSize: typography.fontSize,
    });
    const visibleLines = lines.slice(0, maxLines);
    const height = getTitleHeight({
      linesCount: visibleLines.length,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
    });
    const didFit = lines.length <= maxLines && height <= maxHeight;

    const fit: SocialTitleFit = {
      typographyKey,
      fontFamily: system.typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      lineHeightRatio: typography.lineHeightRatio,
      letterSpacing: typography.letterSpacing,
      lines: visibleLines,
      height,
      didFit,
    };

    fallbackFit = fit;

    if (didFit) {
      return fit;
    }
  }

  return {
    ...(fallbackFit as SocialTitleFit),
    didFit: false,
  };
}
