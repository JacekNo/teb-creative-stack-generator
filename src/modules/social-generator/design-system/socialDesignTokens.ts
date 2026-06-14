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
      primary: '#102D69',
      secondary: '#0F4496',
      light: '#E8F0FF',
      soft: '#F4F7FF',
      text: '#102D69',
      onPrimary: '#FFFFFF',
      logoPath: '/creative-stack/logos/teb-edukacja.svg',
    },

    kursy: {
      name: 'TEB Kursy',
      primary: '#994365',
      secondary: '#C7839F',
      light: '#F7E6EF',
      soft: '#FCF3F7',
      text: '#5F243D',
      onPrimary: '#FFFFFF',
      logoPath: '/creative-stack/logos/teb-kursy.svg',
    },

    medyczne: {
      name: 'TEB Szkoły Medyczne',
      primary: '#009489',
      secondary: '#B8DDD5',
      light: '#E4F5F2',
      soft: '#F3FAF8',
      text: '#005E57',
      onPrimary: '#FFFFFF',
      logoPath: '/creative-stack/logos/teb-medyczne.svg',
    },

    policealne: {
      name: 'TEB Szkoły Policealne',
      primary: '#E27D00',
      secondary: '#F5B062',
      light: '#FFF0DE',
      soft: '#FFF8F0',
      text: '#7A4100',
      onPrimary: '#FFFFFF',
      logoPath: '/creative-stack/logos/teb-policealne.svg',
    },
  },

  helper: {
    yellow: '#FFC965',
    white: '#FFFFFF',
    dark: '#102D69',
    muted: '#667085',
    border: '#E8EBF0',
    green: '#078A37',
    greenDark: '#056B2B',
    onlineBlue: '#0F4496',
  },

  typography: {
    fontFamily: 'Roc Grotesk, Arial, sans-serif',

    heroXl: { fontSize: 88, lineHeight: 92, letterSpacing: -1.6, fontWeight: 800 },
    heroLg: { fontSize: 76, lineHeight: 80, letterSpacing: -1.2, fontWeight: 800 },
    heroMd: { fontSize: 64, lineHeight: 68, letterSpacing: -0.8, fontWeight: 800 },
    heroSm: { fontSize: 52, lineHeight: 56, letterSpacing: -0.4, fontWeight: 800 },
    heroXs: { fontSize: 44, lineHeight: 48, letterSpacing: -0.2, fontWeight: 800 },

    metaLg: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: 700 },
    meta: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: 700 },
    caption: { fontSize: 20, lineHeight: 28, letterSpacing: 0.2, fontWeight: 600 },
    micro: { fontSize: 16, lineHeight: 20, letterSpacing: 0.3, fontWeight: 600 },
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
      safe: { top: 64, right: 64, bottom: 64, left: 64 },
      photoHeight: 560,
      contentOverlap: 28,
    },

    portrait: {
      width: 1080,
      height: 1350,
      safe: { top: 72, right: 64, bottom: 72, left: 64 },
      photoHeight: 660,
      contentOverlap: 32,
    },

    stories: {
      width: 1080,
      height: 1920,
      safe: { top: 180, right: 72, bottom: 240, left: 72 },
      photoHeight: 900,
      contentOverlap: 36,
    },
  },

  formatTuning: {
    square: {
      supportContentScale: 1,
    },
    portrait: {
      supportContentScale: 1.06,
    },
    stories: {
      supportContentScale: 1.18,
    },
  },

  components: {
    background: {
      patternColor: '#FFFFFF',
      patternOpacity: 0.18,
      patternSize: 72,
      patternStrokeWidth: 2,
      patternDotSize: 6,
      overlayOpacity: 0.14,
      patternInsetX: 48,
      patternInsetY: 48,
      patternGap: 16,
      patternRowGap: 16,
      patternColumns: 11,
      patternRotate: -8,
      patternStagger: true,
    },

    titleCard: {
      radius: 40,
      paddingX: 44,
      paddingY: 36,
      minFontSize: 44,
      maxFontSize: 88,
      maxLines: 5,
      shadow: '0 20 48 rgba(16, 45, 105, 0.16)',
    },

    titleStack: {
      titleSubtitleGap: 8,
      subtitleModeGap: 12,
      subtitleFontRatio: 0.42,
      subtitleMinFontSize: 24,
      subtitleFontWeight: 800,
      subtitleLineHeightRatio: 1.16,
      modeBadge: {
        height: 48,
        radius: 14,
        paddingX: 22,
        paddingY: 8,
        fontSize: 20,
        lineHeight: 28,
        fontWeight: 900,
        letterSpacing: 0.4,
        textWidthRatio: 0.58,
      },
    },

    badge: {
      height: 52,
      radius: 14,
      paddingX: 24,
      paddingY: 10,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: 800,
      gap: 12,
      rowGap: 12,
      columnGap: 12,
      borderWidth: 2,
      maxItems: 5,
      textWidthRatio: 0.55,
      letterSpacing: 0.1,
    },

    logoBox: {
      radius: 16,
      paddingX: 20,
      paddingY: 14,
      width: 220,
      height: 84,
    },

    partnerBox: {
      radius: 18,
      paddingX: 24,
      paddingY: 16,
      minWidth: 220,
      maxWidth: 360,
      height: 88,
    },

    factStack: {
      maxItems: 4,
      gap: 8,
      itemHeight: 66,
      iconSize: 44,
      iconRadius: 14,
      iconTextGap: 16,
      valueFontSize: 28,
      valueLineHeight: 34,
      valueFontWeight: 800,
      labelFontSize: 18,
      labelLineHeight: 22,
      labelFontWeight: 700,
      valueLabelGap: 2,
    },

    cityBadge: {
      height: 48,
      radius: 14,
      paddingX: 20,
      paddingY: 8,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: 800,
      letterSpacing: 0.1,
      borderWidth: 2,
      iconSize: 10,
      iconGap: 10,
      showIcon: true,
      textWidthRatio: 0.55,
      textBaselineOffsetRatio: 0.34,
      align: 'left',
      shadowDx: 0,
      shadowDy: 8,
      shadowBlur: 18,
      shadowOpacity: 0.08,
    },

    contentFlow: {
      insetX: 40,
      titleToFactsGap: 16,
      factsToBadgesGap: 18,
      badgesToFooterGap: 44,
      footerGap: 24,
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
