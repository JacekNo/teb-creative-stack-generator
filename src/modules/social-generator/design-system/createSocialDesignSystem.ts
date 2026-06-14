import type { SocialFormatId } from '../types/social.types';
import {
  socialDesignTokens,
  type SocialDesignBrand,
  type SocialDesignFormat,
} from './socialDesignTokens';

export type SocialDensity = 'compact' | 'default' | 'comfortable';

export type CreateSocialDesignSystemOptions = {
  brandKey: string;
  formatId: SocialFormatId | SocialDesignFormat;
  density?: SocialDensity;
  creativeScale?: number;
};

const densityFactors: Record<SocialDensity, number> = {
  compact: 0.92,
  default: 1,
  comfortable: 1.08,
};

type NumericRecord = Record<string | number, number>;

function roundToGrid(value: number, grid: number): number {
  if (value === 0) {
    return 0;
  }

  return Math.round(value / grid) * grid;
}

function scaleNumber(value: number, factor: number, grid: number): number {
  if (value === 999) {
    return value;
  }

  return roundToGrid(value * factor, grid);
}

function scaleRecord<T extends NumericRecord>(
  values: T,
  factor: number,
  grid: number,
): T {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      scaleNumber(value, factor, grid),
    ]),
  ) as T;
}

function scaleTypographyToken<
  T extends {
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    fontWeight: number;
  },
>(token: T, factor: number, grid: number) {
  const fontSize = scaleNumber(token.fontSize, factor, grid);
  const lineHeight = scaleNumber(token.lineHeight, factor, grid);

  return {
    ...token,
    fontSize,
    lineHeight,
    lineHeightRatio: lineHeight / fontSize,
    letterSpacing: token.letterSpacing * factor,
  };
}

function resolveSocialBrand(brandKey: string): SocialDesignBrand {
  if (brandKey === 'teb-edukacja') {
    return 'edukacja';
  }

  if (
    brandKey === 'edukacja' ||
    brandKey === 'kursy' ||
    brandKey === 'medyczne' ||
    brandKey === 'policealne'
  ) {
    return brandKey;
  }

  return 'edukacja';
}

function resolveSocialFormat(
  formatId: SocialFormatId | SocialDesignFormat,
): SocialDesignFormat {
  if (
    formatId === 'square' ||
    formatId === 'portrait' ||
    formatId === 'stories'
  ) {
    return formatId;
  }

  if (formatId === 'feed-4x5-1080') {
    return 'portrait';
  }

  if (formatId === 'story-9x16-1080') {
    return 'stories';
  }

  return 'square';
}

function createTheme(brand: SocialDesignBrand) {
  const brandTokens = socialDesignTokens.brands[brand];
  const helper = socialDesignTokens.helper;

  return {
    brand: brandTokens,

    background: brandTokens.soft,
    backgroundPatternColor: brandTokens.secondary,
    surface: helper.white,
    surfaceSoft: brandTokens.light,
    surfaceTint: brandTokens.soft,

    textPrimary: brandTokens.text,
    textSecondary: helper.muted,
    textOnPrimary: brandTokens.onPrimary,

    borderSubtle: helper.border,

    courseModeBadge: {
      fill: helper.onlineBlue,
      color: helper.white,
      borderColor: helper.onlineBlue,
    },

    cityBadge: {
      fill: helper.white,
      color: brandTokens.text,
      borderColor: brandTokens.light,
      iconColor: brandTokens.primary,
      shadowColor: brandTokens.primary,
    },

    brandLogo: {
      fill: brandTokens.primary,
      color: brandTokens.onPrimary,
      borderColor: brandTokens.primary,
    },

    badgeTones: {
      primary: {
        fill: brandTokens.primary,
        color: brandTokens.onPrimary,
        borderColor: brandTokens.primary,
        borderWidth: 0,
      },
      light: {
        fill: brandTokens.light,
        color: brandTokens.text,
        borderColor: brandTokens.secondary,
        borderWidth: 2,
      },
      popular: {
        fill: helper.yellow,
        color: helper.dark,
        borderColor: helper.yellow,
        borderWidth: 2,
      },
      green: {
        fill: helper.green,
        color: helper.white,
        borderColor: helper.greenDark,
        borderWidth: 0,
      },
      online: {
        fill: helper.onlineBlue,
        color: helper.white,
        borderColor: helper.onlineBlue,
        borderWidth: 0,
      },
    },

    badgePrimaryBackground: brandTokens.primary,
    badgePrimaryText: brandTokens.onPrimary,
    badgeSoftBackground: brandTokens.light,
    badgeSoftText: brandTokens.text,
    badgeLightBackground: helper.white,
    badgeLightText: brandTokens.text,
    badgeGreenBackground: helper.green,
    badgeGreenText: helper.white,
    badgePopularBackground: helper.white,
    badgePopularText: brandTokens.text,
  };
}

function scaleBackground(
  factor: number,
  grid: number,
) {
  const background = socialDesignTokens.components.background;

  return {
    ...background,
    patternSize: scaleNumber(background.patternSize, factor, grid),
    patternStrokeWidth: Math.max(
      1,
      Math.round(background.patternStrokeWidth * factor),
    ),
    patternDotSize: scaleNumber(background.patternDotSize, factor, grid),
    patternInsetX: scaleNumber(background.patternInsetX, factor, grid),
    patternInsetY: scaleNumber(background.patternInsetY, factor, grid),
    patternGap: scaleNumber(background.patternGap, factor, grid),
    patternRowGap: scaleNumber(background.patternRowGap, factor, grid),
  };
}

export function createSocialDesignSystem({
  brandKey,
  formatId,
  density = 'default',
  creativeScale = 1,
}: CreateSocialDesignSystemOptions) {
  const brand = resolveSocialBrand(brandKey);
  const format = resolveSocialFormat(formatId);
  const formatTokens = socialDesignTokens.formats[format];

  const baseWidth = socialDesignTokens.formats.square.width;
  const formatScale = formatTokens.width / baseWidth;
  const densityFactor = densityFactors[density];
  const scaleFactor = formatScale * densityFactor * creativeScale;
  const supportContentScale =
    socialDesignTokens.formatTuning[format].supportContentScale;
  const supportScaleFactor = scaleFactor * supportContentScale;

  const grid = 4 * formatScale * creativeScale;

  const spacing = scaleRecord(
    socialDesignTokens.spacing,
    scaleFactor,
    grid,
  );

  const radius = scaleRecord(
    socialDesignTokens.radius,
    scaleFactor,
    grid,
  );

  const typography = {
    fontFamily: socialDesignTokens.typography.fontFamily,
    heroXl: scaleTypographyToken(socialDesignTokens.typography.heroXl, scaleFactor, grid),
    heroLg: scaleTypographyToken(socialDesignTokens.typography.heroLg, scaleFactor, grid),
    heroMd: scaleTypographyToken(socialDesignTokens.typography.heroMd, scaleFactor, grid),
    heroSm: scaleTypographyToken(socialDesignTokens.typography.heroSm, scaleFactor, grid),
    heroXs: scaleTypographyToken(socialDesignTokens.typography.heroXs, scaleFactor, grid),
    metaLg: scaleTypographyToken(socialDesignTokens.typography.metaLg, scaleFactor, grid),
    meta: scaleTypographyToken(socialDesignTokens.typography.meta, scaleFactor, grid),
    caption: scaleTypographyToken(socialDesignTokens.typography.caption, scaleFactor, grid),
    micro: scaleTypographyToken(socialDesignTokens.typography.micro, scaleFactor, grid),
  };

  const titleStackTokens = socialDesignTokens.components.titleStack;
  const modeBadgeTokens = titleStackTokens.modeBadge;
  const components = {
    background: scaleBackground(scaleFactor, grid),

    titleCard: {
      ...socialDesignTokens.components.titleCard,
      radius: scaleNumber(socialDesignTokens.components.titleCard.radius, scaleFactor, grid),
      paddingX: scaleNumber(socialDesignTokens.components.titleCard.paddingX, scaleFactor, grid),
      paddingY: scaleNumber(socialDesignTokens.components.titleCard.paddingY, scaleFactor, grid),
      minFontSize: scaleNumber(socialDesignTokens.components.titleCard.minFontSize, scaleFactor, grid),
      maxFontSize: scaleNumber(socialDesignTokens.components.titleCard.maxFontSize, scaleFactor, grid),
    },

    titleStack: {
      titleSubtitleGap: scaleNumber(titleStackTokens.titleSubtitleGap, scaleFactor, grid),
      subtitleModeGap: scaleNumber(titleStackTokens.subtitleModeGap, supportScaleFactor, grid),
      subtitleFontRatio: titleStackTokens.subtitleFontRatio,
      subtitleMinFontSize: scaleNumber(titleStackTokens.subtitleMinFontSize, supportScaleFactor, grid),
      subtitleFontWeight: titleStackTokens.subtitleFontWeight,
      subtitleLineHeightRatio: titleStackTokens.subtitleLineHeightRatio,
      modeBadge: {
        ...modeBadgeTokens,
        height: scaleNumber(modeBadgeTokens.height, supportScaleFactor, grid),
        radius: scaleNumber(modeBadgeTokens.radius, supportScaleFactor, grid),
        paddingX: scaleNumber(modeBadgeTokens.paddingX, supportScaleFactor, grid),
        paddingY: scaleNumber(modeBadgeTokens.paddingY, supportScaleFactor, grid),
        fontSize: scaleNumber(modeBadgeTokens.fontSize, supportScaleFactor, grid),
        lineHeight: scaleNumber(modeBadgeTokens.lineHeight, supportScaleFactor, grid),
        lineHeightRatio:
          scaleNumber(modeBadgeTokens.lineHeight, supportScaleFactor, grid) /
          scaleNumber(modeBadgeTokens.fontSize, supportScaleFactor, grid),
        letterSpacing: modeBadgeTokens.letterSpacing * supportScaleFactor,
      },
    },

    badge: {
      ...socialDesignTokens.components.badge,
      height: scaleNumber(socialDesignTokens.components.badge.height, supportScaleFactor, grid),
      radius: scaleNumber(socialDesignTokens.components.badge.radius, supportScaleFactor, grid),
      paddingX: scaleNumber(socialDesignTokens.components.badge.paddingX, supportScaleFactor, grid),
      paddingY: scaleNumber(socialDesignTokens.components.badge.paddingY, supportScaleFactor, grid),
      fontSize: scaleNumber(socialDesignTokens.components.badge.fontSize, supportScaleFactor, grid),
      lineHeight: scaleNumber(socialDesignTokens.components.badge.lineHeight, supportScaleFactor, grid),
      lineHeightRatio:
        scaleNumber(socialDesignTokens.components.badge.lineHeight, supportScaleFactor, grid) /
        scaleNumber(socialDesignTokens.components.badge.fontSize, supportScaleFactor, grid),
      gap: scaleNumber(socialDesignTokens.components.badge.gap, supportScaleFactor, grid),
      rowGap: scaleNumber(socialDesignTokens.components.badge.rowGap, supportScaleFactor, grid),
      columnGap: scaleNumber(socialDesignTokens.components.badge.columnGap, supportScaleFactor, grid),
      borderWidth: Math.max(1, Math.round(socialDesignTokens.components.badge.borderWidth * supportScaleFactor)),
      letterSpacing: socialDesignTokens.components.badge.letterSpacing * supportScaleFactor,
    },

    logoBox: {
      ...socialDesignTokens.components.logoBox,
      radius: scaleNumber(socialDesignTokens.components.logoBox.radius, supportScaleFactor, grid),
      paddingX: scaleNumber(socialDesignTokens.components.logoBox.paddingX, supportScaleFactor, grid),
      paddingY: scaleNumber(socialDesignTokens.components.logoBox.paddingY, supportScaleFactor, grid),
      width: scaleNumber(socialDesignTokens.components.logoBox.width, supportScaleFactor, grid),
      height: scaleNumber(socialDesignTokens.components.logoBox.height, supportScaleFactor, grid),
    },

    partnerBox: {
      ...socialDesignTokens.components.partnerBox,
      radius: scaleNumber(socialDesignTokens.components.partnerBox.radius, supportScaleFactor, grid),
      paddingX: scaleNumber(socialDesignTokens.components.partnerBox.paddingX, supportScaleFactor, grid),
      paddingY: scaleNumber(socialDesignTokens.components.partnerBox.paddingY, supportScaleFactor, grid),
      minWidth: scaleNumber(socialDesignTokens.components.partnerBox.minWidth, supportScaleFactor, grid),
      maxWidth: scaleNumber(socialDesignTokens.components.partnerBox.maxWidth, supportScaleFactor, grid),
      height: scaleNumber(socialDesignTokens.components.partnerBox.height, supportScaleFactor, grid),
    },

    factStack: {
      ...socialDesignTokens.components.factStack,
      gap: scaleNumber(socialDesignTokens.components.factStack.gap, supportScaleFactor, grid),
      itemHeight: scaleNumber(socialDesignTokens.components.factStack.itemHeight, supportScaleFactor, grid),
      iconSize: scaleNumber(socialDesignTokens.components.factStack.iconSize, supportScaleFactor, grid),
      iconRadius: scaleNumber(socialDesignTokens.components.factStack.iconRadius, supportScaleFactor, grid),
      iconTextGap: scaleNumber(socialDesignTokens.components.factStack.iconTextGap, supportScaleFactor, grid),
      valueFontSize: scaleNumber(socialDesignTokens.components.factStack.valueFontSize, supportScaleFactor, grid),
      valueLineHeight: scaleNumber(socialDesignTokens.components.factStack.valueLineHeight, supportScaleFactor, grid),
      valueLineHeightRatio:
        scaleNumber(socialDesignTokens.components.factStack.valueLineHeight, supportScaleFactor, grid) /
        scaleNumber(socialDesignTokens.components.factStack.valueFontSize, supportScaleFactor, grid),
      labelFontSize: scaleNumber(socialDesignTokens.components.factStack.labelFontSize, supportScaleFactor, grid),
      labelLineHeight: scaleNumber(socialDesignTokens.components.factStack.labelLineHeight, supportScaleFactor, grid),
      labelLineHeightRatio:
        scaleNumber(socialDesignTokens.components.factStack.labelLineHeight, supportScaleFactor, grid) /
        scaleNumber(socialDesignTokens.components.factStack.labelFontSize, supportScaleFactor, grid),
      valueLabelGap: scaleNumber(socialDesignTokens.components.factStack.valueLabelGap, supportScaleFactor, grid),
    },

    cityBadge: {
      ...socialDesignTokens.components.cityBadge,
      height: scaleNumber(socialDesignTokens.components.cityBadge.height, supportScaleFactor, grid),
      radius: scaleNumber(socialDesignTokens.components.cityBadge.radius, supportScaleFactor, grid),
      paddingX: scaleNumber(socialDesignTokens.components.cityBadge.paddingX, supportScaleFactor, grid),
      paddingY: scaleNumber(socialDesignTokens.components.cityBadge.paddingY, supportScaleFactor, grid),
      fontSize: scaleNumber(socialDesignTokens.components.cityBadge.fontSize, supportScaleFactor, grid),
      lineHeight: scaleNumber(socialDesignTokens.components.cityBadge.lineHeight, supportScaleFactor, grid),
      lineHeightRatio:
        scaleNumber(socialDesignTokens.components.cityBadge.lineHeight, supportScaleFactor, grid) /
        scaleNumber(socialDesignTokens.components.cityBadge.fontSize, supportScaleFactor, grid),
      borderWidth: Math.max(1, Math.round(socialDesignTokens.components.cityBadge.borderWidth * supportScaleFactor)),
      iconSize: scaleNumber(socialDesignTokens.components.cityBadge.iconSize, supportScaleFactor, grid),
      iconGap: scaleNumber(socialDesignTokens.components.cityBadge.iconGap, supportScaleFactor, grid),
      letterSpacing: socialDesignTokens.components.cityBadge.letterSpacing * supportScaleFactor,
      textWidthRatio: socialDesignTokens.components.cityBadge.textWidthRatio,
      textBaselineOffsetRatio:
        socialDesignTokens.components.cityBadge.textBaselineOffsetRatio,
      align: socialDesignTokens.components.cityBadge.align as 'left' | 'right',
      shadowDx: scaleNumber(socialDesignTokens.components.cityBadge.shadowDx, supportScaleFactor, grid),
      shadowDy: scaleNumber(socialDesignTokens.components.cityBadge.shadowDy, supportScaleFactor, grid),
      shadowBlur: scaleNumber(socialDesignTokens.components.cityBadge.shadowBlur, supportScaleFactor, grid),
      shadowOpacity: socialDesignTokens.components.cityBadge.shadowOpacity,
    },

    contentFlow: {
      insetX: scaleNumber(socialDesignTokens.components.contentFlow.insetX, scaleFactor, grid),
      titleToFactsGap: scaleNumber(socialDesignTokens.components.contentFlow.titleToFactsGap, scaleFactor, grid),
      factsToBadgesGap: scaleNumber(socialDesignTokens.components.contentFlow.factsToBadgesGap, scaleFactor, grid),
      badgesToFooterGap: scaleNumber(socialDesignTokens.components.contentFlow.badgesToFooterGap, scaleFactor, grid),
      footerGap: scaleNumber(socialDesignTokens.components.contentFlow.footerGap, scaleFactor, grid),
    },

    infoGrid: {
      ...socialDesignTokens.components.infoGrid,
      radius: scaleNumber(socialDesignTokens.components.infoGrid.radius, scaleFactor, grid),
      gap: scaleNumber(socialDesignTokens.components.infoGrid.gap, scaleFactor, grid),
      itemPaddingX: scaleNumber(socialDesignTokens.components.infoGrid.itemPaddingX, scaleFactor, grid),
      itemPaddingY: scaleNumber(socialDesignTokens.components.infoGrid.itemPaddingY, scaleFactor, grid),
      labelFontSize: scaleNumber(socialDesignTokens.components.infoGrid.labelFontSize, scaleFactor, grid),
      valueFontSize: scaleNumber(socialDesignTokens.components.infoGrid.valueFontSize, scaleFactor, grid),
    },
  };

  return {
    tokens: socialDesignTokens,
    brandKey: brand,
    formatKey: format,

    density,
    creativeScale,
    scaleFactor,
    supportContentScale,
    grid,

    brand: socialDesignTokens.brands[brand],
    helper: socialDesignTokens.helper,
    theme: createTheme(brand),

    format: formatTokens,
    spacing,
    radius,
    typography,
    components,
  };
}

export type SocialDesignSystem = ReturnType<typeof createSocialDesignSystem>;
