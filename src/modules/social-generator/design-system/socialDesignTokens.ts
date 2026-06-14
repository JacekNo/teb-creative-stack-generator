export type SocialDesignFormat = 'square' | 'portrait' | 'stories';

export type SocialDesignBrand =
  | 'edukacja'
  | 'kursy'
  | 'medyczne'
  | 'policealne';

export const socialDesignTokens = {
  brands: {
    edukacja: {
      name: 'TEB Edukacja',
      logoPath: '/creative-stack/logos/teb-edukacja.svg',
      primary: '#102D69',
      secondary: '#0F4496',
      light: '#E8F0FF',
      soft: '#F4F7FF',
      text: '#102D69',
      onPrimary: '#FFFFFF',
    },

    kursy: {
      name: 'TEB Kursy',
      logoPath: '/creative-stack/logos/teb-edukacja.svg',
      primary: '#994365',
      secondary: '#C7839F',
      light: '#F7E6EF',
      soft: '#FCF3F7',
      text: '#5F243D',
      onPrimary: '#FFFFFF',
    },

    medyczne: {
      name: 'TEB Szkoły Medyczne',
      logoPath: '/creative-stack/logos/teb-edukacja.svg',
      primary: '#009489',
      secondary: '#B8DDD5',
      light: '#E4F5F2',
      soft: '#F3FAF8',
      text: '#005E57',
      onPrimary: '#FFFFFF',
    },

    policealne: {
      name: 'TEB Szkoły Policealne',
      logoPath: '/creative-stack/logos/teb-edukacja.svg',
      primary: '#E27D00',
      secondary: '#F5B062',
      light: '#FFF0DE',
      soft: '#FFF8F0',
      text: '#7A4100',
      onPrimary: '#FFFFFF',
    },
  },

  helper: {
    yellow: '#FFC965',
    white: '#FFFFFF',
    dark: '#102D69',
    muted: '#667085',
    border: '#E8EBF0',
  },

  typography: {
    fontFamily: 'Roc Grotesk, Arial, sans-serif',

    heroXl: {
      fontSize: 88,
      lineHeight: 92,
      letterSpacing: -1.6,
      fontWeight: 800,
    },
    heroLg: {
      fontSize: 76,
      lineHeight: 80,
      letterSpacing: -1.2,
      fontWeight: 800,
    },
    heroMd: {
      fontSize: 64,
      lineHeight: 68,
      letterSpacing: -0.8,
      fontWeight: 800,
    },
    heroSm: {
      fontSize: 52,
      lineHeight: 56,
      letterSpacing: -0.4,
      fontWeight: 800,
    },
    heroXs: {
      fontSize: 44,
      lineHeight: 48,
      letterSpacing: -0.2,
      fontWeight: 800,
    },

    metaLg: {
      fontSize: 28,
      lineHeight: 36,
      letterSpacing: 0,
      fontWeight: 700,
    },
    meta: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0,
      fontWeight: 700,
    },
    caption: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.2,
      fontWeight: 600,
    },
    micro: {
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0.3,
      fontWeight: 600,
    },
  },

  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
  },

  radius: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 56,
    pill: 999,
  },

  formats: {
    square: {
      width: 1080,
      height: 1080,
      safe: { top: 0, right: 40, bottom: 48, left: 40 },
      photoHeight: 420,
      contentOverlap: 0,
    },

    portrait: {
      width: 1080,
      height: 1350,
      safe: { top: 0, right: 40, bottom: 48, left: 40 },
      photoHeight: 600,
      contentOverlap: 0,
    },

    stories: {
      width: 1080,
      height: 1920,
      safe: { top: 180, right: 72, bottom: 240, left: 72 },
      photoHeight: 860,
      contentOverlap: 0,
    },
  },

  components: {
    background: {
      patternColor: '#FFFFFF',
      patternOpacity: 0.12,
      patternColumns: 12,
      patternGap: 10,
      patternRowGap: 10,
      patternInsetX: 20,
      patternInsetY: 20,
      patternRotate: 0,
      patternStagger: true,
    },

    titleCard: {
      radius: 40,
      paddingX: 0,
      paddingY: 32,
      minFontSize: 44,
      maxFontSize: 88,
      maxLines: 3,
      shadow: '0 20 48 rgba(16, 45, 105, 0.16)',
    },

    badge: {
      height: 68,
      radius: 999,
      paddingX: 32,
      paddingY: 14,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: 800,
      gap: 16,
      rowGap: 16,
      borderWidth: 2,
      maxItems: 5,
      textWidthRatio: 0.56,
    },

    logoBox: {
      radius: 28,
      paddingX: 24,
      paddingY: 18,
      width: 220,
      height: 84,
    },

    partnerBox: {
      radius: 28,
      paddingX: 28,
      paddingY: 18,
      minWidth: 220,
      maxWidth: 360,
      height: 88,
    },

    infoGrid: {
      radius: 28,
      gap: 12,
      itemPaddingX: 24,
      itemPaddingY: 16,
      labelFontSize: 16,
      valueFontSize: 24,
    },
  },
} as const;

export type SocialDesignTokens = typeof socialDesignTokens;
