import {
  createCreativeTheme,
  type CreativeThemeMode,
} from '../../creative-stack/design-system/creativeThemes';
import {
  createResponsiveScale,
  type CreativeDensity,
} from '../../creative-stack/design-system/createResponsiveScale';

export type SocialComponentStyleInput = {
  width: number;
  height: number;
  brandKey: string;
  themeMode?: CreativeThemeMode;
  density?: CreativeDensity;
  creativeScale?: number;
};

export function createSocialComponentStyles({
  width,
  height,
  brandKey,
  themeMode = 'light',
  density = 'default',
  creativeScale = 1,
}: SocialComponentStyleInput) {
  const scale = createResponsiveScale(
    width,
    height,
    density,
    creativeScale,
  );

  const theme = createCreativeTheme(themeMode, brandKey);

  const baseTextStyle = {
  fontFamily: 'Roc Grotesk, Arial, sans-serif',
  letterSpacing: -0.6 * scale.u,
};

  const courseNameDefault = {
    ...baseTextStyle,
    fontWeight: 800,
    fontSize: scale.font.titleLg,
    minFontSize: scale.font.titleSm,
    lineHeight: scale.lineHeight.title,
    color: theme.textPrimary,
    fill: theme.textPrimary,
    maxLines: 3,
  };

  const courseNameCompact = {
    ...courseNameDefault,
    fontSize: scale.font.titleMd,
    minFontSize: scale.font.titleSm * 0.92,
    maxLines: 4,
  };

  const benefitDefault = {
    ...baseTextStyle,
    fontWeight: 600,
    fontSize: scale.font.benefit,
    minFontSize: scale.font.body,
    lineHeight: scale.lineHeight.body,
    letterSpacing: -0.25 * scale.u,
    color: theme.textSecondary,
    fill: theme.textSecondary,
    maxLines: 2,
  };

  const benefitCompact = {
    ...benefitDefault,
    fontSize: scale.font.body,
    minFontSize: scale.font.body * 0.88,
    maxLines: 2,
  };

  const badgeDefault = {
    ...baseTextStyle,
    fontWeight: 800,
    fontSize: scale.font.badge,
    lineHeight: scale.lineHeight.tight,
    letterSpacing: -0.15 * scale.u,

    paddingX: scale.space.md,
    paddingY: scale.space.sm,
    radius: scale.radius.pill,

    background: theme.badgeBackground,
    backgroundColor: theme.badgeBackground,

    color: theme.badgeText,
    fill: theme.badgeText,

    border: theme.borderSubtle,
    borderColor: theme.borderSubtle,
    borderWidth: scale.stroke.hairline,
  };

  const badgeCompact = {
    ...badgeDefault,
    fontSize: scale.font.badge * 0.88,
    paddingX: scale.space.sm,
    paddingY: scale.space.xs,
  };

  const priceDefault = {
    ...badgeDefault,
    fontWeight: 900,

    background: theme.brandPrimary,
    backgroundColor: theme.brandPrimary,

    color: theme.textOnBrand,
    fill: theme.textOnBrand,

    border: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  };

  const priceSoft = {
    ...badgeDefault,
    fontWeight: 900,

    background: theme.surfaceStrong,
    backgroundColor: theme.surfaceStrong,

    color: theme.textPrimary,
    fill: theme.textPrimary,

    border: theme.borderSubtle,
    borderColor: theme.borderSubtle,
    borderWidth: scale.stroke.hairline,
  };

  const metaDefault = {
    ...badgeDefault,
    fontWeight: 700,
    fontSize: scale.font.badge * 0.9,

    background: theme.surface,
    backgroundColor: theme.surface,

    color: theme.textPrimary,
    fill: theme.textPrimary,

    border: theme.borderSubtle,
    borderColor: theme.borderSubtle,
    borderWidth: scale.stroke.hairline,
  };

  const metaCompact = {
    ...metaDefault,
    fontSize: scale.font.badge * 0.8,
    paddingX: scale.space.sm,
    paddingY: scale.space.xs,
  };

  const offerModeDefault = {
    ...metaDefault,

    background: theme.brandSecondary,
    backgroundColor: theme.brandSecondary,

    color: theme.textOnBrand,
    fill: theme.textOnBrand,

    border: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  };

  const offerModeCompact = {
    ...metaCompact,

    background: theme.brandSecondary,
    backgroundColor: theme.brandSecondary,

    color: theme.textOnBrand,
    fill: theme.textOnBrand,

    border: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  };

  const partnerLogoDefault = {
    background: '#FFFFFF',
    backgroundColor: '#FFFFFF',

    radius: scale.radius.md,

    padding: scale.space.sm,
    paddingX: scale.space.sm,
    paddingY: scale.space.sm,

    border: 'rgba(16,45,105,0.12)',
    borderColor: 'rgba(16,45,105,0.12)',
    borderWidth: scale.stroke.hairline,

    maxWidth: scale.u * 28,
    maxHeight: scale.u * 10,
  };

  const partnerLogoCompact = {
    ...partnerLogoDefault,

    radius: scale.radius.sm,

    padding: scale.space.xs,
    paddingX: scale.space.xs,
    paddingY: scale.space.xs,

    maxWidth: scale.u * 22,
    maxHeight: scale.u * 8,
  };

  const brandLogoDefault = {
    ...baseTextStyle,
    fontWeight: 900,
    fontSize: scale.font.body,
    lineHeight: scale.lineHeight.tight,

    color: theme.textPrimary,
    fill: theme.textPrimary,

    maxWidth: scale.u * 30,
    maxHeight: scale.u * 8,
  };

  return {
    scale,
    theme,

    canvas: {
      background: theme.background,
      backgroundColor: theme.background,
    },

    photo: {
      default: {
        radius: scale.radius.lg,
      },
    },

    courseName: {
      default: courseNameDefault,
      compact: courseNameCompact,
    },

    benefit: {
      default: benefitDefault,
      compact: benefitCompact,
    },

    price: {
      default: priceDefault,
      soft: priceSoft,
      compact: {
        ...priceDefault,
        fontSize: badgeCompact.fontSize,
        paddingX: badgeCompact.paddingX,
        paddingY: badgeCompact.paddingY,
      },
    },

    startDate: {
      default: metaDefault,
      compact: metaCompact,
    },

    city: {
      default: metaDefault,
      compact: metaCompact,
    },

    offerMode: {
      default: offerModeDefault,
      compact: offerModeCompact,
    },

    partnerLogo: {
      default: partnerLogoDefault,
      compact: partnerLogoCompact,
    },

    brandLogo: {
      default: brandLogoDefault,
    },

    debug: {
      slotStroke: 'rgba(15,68,150,0.35)',
      safeZoneStroke: 'rgba(227,6,19,0.45)',
      gridStroke: 'rgba(15,68,150,0.12)',
    },
  };
}

export const socialComponentStyles = createSocialComponentStyles({
  width: 1080,
  height: 1080,
  brandKey: 'teb-edukacja',
});

export const SOCIAL_COMPONENT_STYLES = socialComponentStyles;