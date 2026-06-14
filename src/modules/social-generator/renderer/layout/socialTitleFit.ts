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
  subtitleLines: SocialTitleFitLine[];
  subtitleFontSize: number;
  subtitleFontWeight: number;
  subtitleLineHeight: number;
  subtitleLetterSpacing: number;
  modeLabel: string;
  modeBadgeHeight: number;
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
  return wrapWords(getTextValue(parts.main), width, fontSize);
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

function createSubtitleTypography(
  titleFontSize: number,
  system: SocialDesignSystem,
): {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
} {
  const fontSize = Math.max(
    system.typography.caption.fontSize,
    Math.round(titleFontSize * 0.34),
  );

  return {
    fontSize,
    fontWeight: 800,
    lineHeight: Math.round(fontSize * 1.14),
    letterSpacing: 0,
  };
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
  const titleSubtitleGap = system.spacing[1];
  const titleModeGap = system.spacing[3];

  for (const typographyKey of TITLE_VARIANTS) {
    const typography = system.typography[typographyKey];
    const subtitleTypography = createSubtitleTypography(
      typography.fontSize,
      system,
    );
    const lines = wrapTitleParts({
      parts,
      width,
      fontSize: typography.fontSize,
    });
    const subtitleLines = wrapWords(
      getTextValue(parts.subtitle),
      width,
      subtitleTypography.fontSize,
    ).slice(0, 2);
    const modeLabel = getTextValue(parts.modeLabel);
    const visibleLines = lines.slice(0, maxLines);
    const titleHeight = getTitleHeight({
      linesCount: visibleLines.length,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
    });
    const subtitleHeight = getTitleHeight({
      linesCount: subtitleLines.length,
      fontSize: subtitleTypography.fontSize,
      lineHeight: subtitleTypography.lineHeight,
    });
    const modeBadgeHeight = modeLabel ? system.components.badge.height : 0;
    const height =
      titleHeight +
      (subtitleHeight > 0 ? titleSubtitleGap + subtitleHeight : 0) +
      (modeBadgeHeight > 0 ? titleModeGap + modeBadgeHeight : 0);
    const didFit =
      lines.length <= maxLines &&
      subtitleLines.length <= 2 &&
      height <= maxHeight;

    const fit: SocialTitleFit = {
      typographyKey,
      fontFamily: system.typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      lineHeightRatio: typography.lineHeightRatio,
      letterSpacing: typography.letterSpacing,
      lines: visibleLines,
      subtitleLines,
      subtitleFontSize: subtitleTypography.fontSize,
      subtitleFontWeight: subtitleTypography.fontWeight,
      subtitleLineHeight: subtitleTypography.lineHeight,
      subtitleLetterSpacing: subtitleTypography.letterSpacing,
      modeLabel,
      modeBadgeHeight,
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
