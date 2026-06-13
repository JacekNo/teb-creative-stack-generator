import {
  creativeColorTokens,
  getCreativeBrandColors,
} from './creativeTokens';

export type CreativeThemeMode = 'light' | 'dark';

export type CreativeTheme = {
  mode: CreativeThemeMode;
  brandPrimary: string;
  brandSecondary: string;
  background: string;
  surface: string;
  surfaceStrong: string;
  textPrimary: string;
  textSecondary: string;
  textOnBrand: string;
  badgeBackground: string;
  badgeText: string;
  borderSubtle: string;
};

export function createCreativeTheme(
  mode: CreativeThemeMode,
  brandKey: string,
): CreativeTheme {
  const brand = getCreativeBrandColors(brandKey);
  const isDark = mode === 'dark';

  return {
    mode,
    brandPrimary: brand.primary,
    brandSecondary: brand.secondary,

    background: isDark
      ? creativeColorTokens.neutral.navy950
      : creativeColorTokens.neutral.gray50,

    surface: isDark
      ? 'rgba(255,255,255,0.10)'
      : creativeColorTokens.neutral.white,

    surfaceStrong: isDark
      ? 'rgba(255,255,255,0.16)'
      : creativeColorTokens.neutral.white,

    textPrimary: isDark
      ? creativeColorTokens.neutral.white
      : creativeColorTokens.brand.tebBlue,

    textSecondary: isDark
      ? 'rgba(255,255,255,0.74)'
      : creativeColorTokens.neutral.gray700,

    textOnBrand: creativeColorTokens.neutral.white,

    badgeBackground: isDark
      ? 'rgba(255,255,255,0.14)'
      : creativeColorTokens.neutral.white,

    badgeText: isDark
      ? creativeColorTokens.neutral.white
      : creativeColorTokens.brand.tebBlue,

    borderSubtle: isDark
      ? 'rgba(255,255,255,0.16)'
      : 'rgba(16,45,105,0.12)',
  };
}