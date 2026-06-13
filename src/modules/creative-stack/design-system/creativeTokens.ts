export const creativeColorTokens = {
  brand: {
    tebBlue: '#102D69',
    tebBlueLight: '#0F4496',

    kursyPrimary: '#994365',
    kursySecondary: '#C7839F',

    medycznePrimary: '#009489',
    medyczneSecondary: '#B8DDD5',

    policealnePrimary: '#E27D00',
    policealneSecondary: '#F5B062',
  },

  neutral: {
    white: '#FFFFFF',
    gray50: '#F7F8FB',
    gray100: '#EEF1F6',
    gray200: '#DDE4EF',
    gray500: '#697386',
    gray700: '#334155',
    gray900: '#111827',
    navy950: '#071735',
  },
} as const;

export type CreativeBrandKey =
  | 'teb-edukacja'
  | 'kursy'
  | 'medyczne'
  | 'policealne';

export function getCreativeBrandColors(brandKey: string) {
  switch (brandKey) {
    case 'kursy':
      return {
        primary: creativeColorTokens.brand.kursyPrimary,
        secondary: creativeColorTokens.brand.kursySecondary,
      };

    case 'medyczne':
      return {
        primary: creativeColorTokens.brand.medycznePrimary,
        secondary: creativeColorTokens.brand.medyczneSecondary,
      };

    case 'policealne':
      return {
        primary: creativeColorTokens.brand.policealnePrimary,
        secondary: creativeColorTokens.brand.policealneSecondary,
      };

    case 'teb-edukacja':
    default:
      return {
        primary: creativeColorTokens.brand.tebBlue,
        secondary: creativeColorTokens.brand.tebBlueLight,
      };
  }
}