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
  const yellow = socialDesignTokens.helper.yellow;
  const white = socialDesignTokens.helper.white;

  return {
    brand: brandTokens,

    background: brandTokens.soft,
    surface: white,
    surfaceSoft: brandTokens.light,
    surfaceTint: brandTokens.soft,

    textPrimary: brandTokens.text,
    textSecondary: socialDesignTokens.helper.muted,
    textOnPrimary: brandTokens.onPrimary,

    borderSubtle: socialDesignTokens.helper.border,
    backgroundPatternColor: brandTokens.secondary,


    badgePrimaryBackground: brandTokens.primary,
    badgePrimaryText: brandTokens.onPrimary,

    badgeSoftBackground: brandTokens.light,
    badgeSoftText: brandTokens.text,

    badgeLightBackground: white,
    badgeLightText: brandTokens.text,

    badgeGreenBackground: '#1F7A2E',
    badgeGreenText: white,

    badgePopularBackground: '#FFF0DE',
    badgePopularText: '#7A4100',

    badgeTones: {
      // Filled brand CTA: promo #1 style.
      primary: {
        fill: brandTokens.primary,
        color: brandTokens.onPrimary,
        borderColor: brandTokens.primary,
        borderWidth: 0,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      // Outline brand CTA: promo #2 style.
      outline: {
        fill: 'transparent',
        color: brandTokens.primary,
        borderColor: brandTokens.primary,
        borderWidth: 2,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      light: {
        fill: 'transparent',
        color: brandTokens.primary,
        borderColor: brandTokens.primary,
        borderWidth: 2,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      soft: {
        fill: brandTokens.light,
        color: brandTokens.text,
        borderColor: brandTokens.light,
        borderWidth: 0,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      // Keep popular as an outline/light promo label instead of an egg-shaped chip.
      popular: {
        fill: 'transparent',
        color: brandTokens.primary,
        borderColor: brandTokens.primary,
        borderWidth: 2,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      // Dedicated online badge follows master-brand blue.
      online: {
        fill: '#0F4496',
        color: white,
        borderColor: '#0F4496',
        borderWidth: 0,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      green: {
        fill: '#16863D',
        color: white,
        borderColor: '#16863D',
        borderWidth: 0,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },

      yellow: {
        fill: yellow,
        color: brandTokens.text,
        borderColor: yellow,
        borderWidth: 0,
        markerColor: 'transparent',
        shadowColor: 'transparent',
      },
    },
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

    heroXl: scaleTypographyToken(
      socialDesignTokens.typography.heroXl,
      scaleFactor,
      grid,
    ),
    heroLg: scaleTypographyToken(
      socialDesignTokens.typography.heroLg,
      scaleFactor,
      grid,
    ),
    heroMd: scaleTypographyToken(
      socialDesignTokens.typography.heroMd,
      scaleFactor,
      grid,
    ),
    heroSm: scaleTypographyToken(
      socialDesignTokens.typography.heroSm,
      scaleFactor,
      grid,
    ),
    heroXs: scaleTypographyToken(
      socialDesignTokens.typography.heroXs,
      scaleFactor,
      grid,
    ),
    metaLg: scaleTypographyToken(
      socialDesignTokens.typography.metaLg,
      scaleFactor,
      grid,
    ),
    meta: scaleTypographyToken(
      socialDesignTokens.typography.meta,
      scaleFactor,
      grid,
    ),
    caption: scaleTypographyToken(
      socialDesignTokens.typography.caption,
      scaleFactor,
      grid,
    ),
    micro: scaleTypographyToken(
      socialDesignTokens.typography.micro,
      scaleFactor,
      grid,
    ),
  };

  const components = {
    titleCard: {
      ...socialDesignTokens.components.titleCard,
      radius: scaleNumber(
        socialDesignTokens.components.titleCard.radius,
        scaleFactor,
        grid,
      ),
      paddingX: scaleNumber(
        socialDesignTokens.components.titleCard.paddingX,
        scaleFactor,
        grid,
      ),
      paddingY: scaleNumber(
        socialDesignTokens.components.titleCard.paddingY,
        scaleFactor,
        grid,
      ),
      minFontSize: scaleNumber(
        socialDesignTokens.components.titleCard.minFontSize,
        scaleFactor,
        grid,
      ),
      maxFontSize: scaleNumber(
        socialDesignTokens.components.titleCard.maxFontSize,
        scaleFactor,
        grid,
      ),
    },

    background: {
      ...socialDesignTokens.components.background,
      patternSize: scaleNumber(
        socialDesignTokens.components.background.patternSize,
        scaleFactor,
        grid,
      ),
      patternStrokeWidth: scaleNumber(
        socialDesignTokens.components.background.patternStrokeWidth,
        scaleFactor,
        grid,
      ),
      patternDotSize: scaleNumber(
        socialDesignTokens.components.background.patternDotSize,
        scaleFactor,
        grid,
      ),
      patternInsetX: scaleNumber(
        socialDesignTokens.components.background.patternInsetX,
        scaleFactor,
        grid,
      ),
      patternInsetY: scaleNumber(
        socialDesignTokens.components.background.patternInsetY,
        scaleFactor,
        grid,
      ),
      patternGap: scaleNumber(
        socialDesignTokens.components.background.patternGap,
        scaleFactor,
        grid,
      ),
      patternRowGap: scaleNumber(
        socialDesignTokens.components.background.patternRowGap,
        scaleFactor,
        grid,
      ),
    },

    badge: {
      ...socialDesignTokens.components.badge,
      height: scaleNumber(
        socialDesignTokens.components.badge.height,
        scaleFactor,
        grid,
      ),
      radius: scaleNumber(
        socialDesignTokens.components.badge.radius,
        scaleFactor,
        grid,
      ),
      paddingX: scaleNumber(
        socialDesignTokens.components.badge.paddingX,
        scaleFactor,
        grid,
      ),
      paddingY: scaleNumber(
        socialDesignTokens.components.badge.paddingY,
        scaleFactor,
        grid,
      ),
      fontSize: scaleNumber(
        socialDesignTokens.components.badge.fontSize,
        scaleFactor,
        grid,
      ),
      lineHeight: scaleNumber(
        socialDesignTokens.components.badge.lineHeight,
        scaleFactor,
        grid,
      ),
      lineHeightRatio:
        scaleNumber(
          socialDesignTokens.components.badge.lineHeight,
          scaleFactor,
          grid,
        ) /
        scaleNumber(
          socialDesignTokens.components.badge.fontSize,
          scaleFactor,
          grid,
        ),
      gap: scaleNumber(
        socialDesignTokens.components.badge.gap,
        scaleFactor,
        grid,
      ),
      rowGap: scaleNumber(
        socialDesignTokens.components.badge.rowGap,
        scaleFactor,
        grid,
      ),
      columnGap: scaleNumber(
        socialDesignTokens.components.badge.columnGap,
        scaleFactor,
        grid,
      ),
      borderWidth: scaleNumber(
        socialDesignTokens.components.badge.borderWidth,
        scaleFactor,
        grid,
      ),
      markerSize: scaleNumber(
        socialDesignTokens.components.badge.markerSize,
        scaleFactor,
        grid,
      ),
      markerInset: scaleNumber(
        socialDesignTokens.components.badge.markerInset,
        scaleFactor,
        grid,
      ),
      shadowDx: scaleNumber(
        socialDesignTokens.components.badge.shadowDx,
        scaleFactor,
        grid,
      ),
      shadowDy: scaleNumber(
        socialDesignTokens.components.badge.shadowDy,
        scaleFactor,
        grid,
      ),
      shadowBlur: scaleNumber(
        socialDesignTokens.components.badge.shadowBlur,
        scaleFactor,
        grid,
      ),
      shadowOpacity: socialDesignTokens.components.badge.shadowOpacity,
    },

    logoBox: {
      ...socialDesignTokens.components.logoBox,
      radius: scaleNumber(
        socialDesignTokens.components.logoBox.radius,
        scaleFactor,
        grid,
      ),
      paddingX: scaleNumber(
        socialDesignTokens.components.logoBox.paddingX,
        scaleFactor,
        grid,
      ),
      paddingY: scaleNumber(
        socialDesignTokens.components.logoBox.paddingY,
        scaleFactor,
        grid,
      ),
      width: scaleNumber(
        socialDesignTokens.components.logoBox.width,
        scaleFactor,
        grid,
      ),
      height: scaleNumber(
        socialDesignTokens.components.logoBox.height,
        scaleFactor,
        grid,
      ),
    },

    partnerBox: {
      ...socialDesignTokens.components.partnerBox,
      radius: scaleNumber(
        socialDesignTokens.components.partnerBox.radius,
        scaleFactor,
        grid,
      ),
      paddingX: scaleNumber(
        socialDesignTokens.components.partnerBox.paddingX,
        scaleFactor,
        grid,
      ),
      paddingY: scaleNumber(
        socialDesignTokens.components.partnerBox.paddingY,
        scaleFactor,
        grid,
      ),
      minWidth: scaleNumber(
        socialDesignTokens.components.partnerBox.minWidth,
        scaleFactor,
        grid,
      ),
      maxWidth: scaleNumber(
        socialDesignTokens.components.partnerBox.maxWidth,
        scaleFactor,
        grid,
      ),
      height: scaleNumber(
        socialDesignTokens.components.partnerBox.height,
        scaleFactor,
        grid,
      ),
    },

    infoGrid: {
      ...socialDesignTokens.components.infoGrid,
      radius: scaleNumber(
        socialDesignTokens.components.infoGrid.radius,
        scaleFactor,
        grid,
      ),
      gap: scaleNumber(
        socialDesignTokens.components.infoGrid.gap,
        scaleFactor,
        grid,
      ),
      itemPaddingX: scaleNumber(
        socialDesignTokens.components.infoGrid.itemPaddingX,
        scaleFactor,
        grid,
      ),
      itemPaddingY: scaleNumber(
        socialDesignTokens.components.infoGrid.itemPaddingY,
        scaleFactor,
        grid,
      ),
      labelFontSize: scaleNumber(
        socialDesignTokens.components.infoGrid.labelFontSize,
        scaleFactor,
        grid,
      ),
      valueFontSize: scaleNumber(
        socialDesignTokens.components.infoGrid.valueFontSize,
        scaleFactor,
        grid,
      ),
    },
  };

  return {
    tokens: socialDesignTokens,
    brandKey: brand,
    formatKey: format,

    density,
    creativeScale,
    scaleFactor,
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
