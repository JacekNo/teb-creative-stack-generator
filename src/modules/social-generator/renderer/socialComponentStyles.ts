export type SocialComponentStyleVariant =
  | 'default'
  | 'compact'
  | 'strong'
  | 'soft'
  | 'outline';

export type SocialTextComponentStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  color: string;
  maxLines?: number;
};

export type SocialBadgeComponentStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  backgroundColor: string;
  color: string;
  radius: number;
  paddingX: number;
  paddingY: number;
  borderColor?: string;
  borderWidth?: number;
};

export type SocialLogoCardComponentStyle = {
  backgroundColor: string;
  radius: number;
  paddingX: number;
  paddingY: number;
  maxWidth: number;
  maxHeight: number;
};

export type SocialPhotoComponentStyle = {
  radius: number;
  overlayColor?: string;
  overlayOpacity?: number;
};

export const SOCIAL_BASE_FONT_FAMILY =
  'Roc Grotesk, Inter, Arial, sans-serif';

export const SOCIAL_COMPONENT_STYLES = {
  photo: {
    default: {
      radius: 34,
    },
  },

  courseName: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 800,
      fontSize: 76,
      lineHeight: 0.96,
      letterSpacing: -1.8,
      color: '#102D69',
      maxLines: 3,
    },

    compact: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 800,
      fontSize: 62,
      lineHeight: 0.98,
      letterSpacing: -1.3,
      color: '#102D69',
      maxLines: 4,
    },
  },

  benefit: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 600,
      fontSize: 34,
      lineHeight: 1.14,
      letterSpacing: -0.4,
      color: '#102D69',
      maxLines: 2,
    },

    compact: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.16,
      letterSpacing: -0.25,
      color: '#102D69',
      maxLines: 2,
    },
  },

  offerMode: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 700,
      fontSize: 26,
      lineHeight: 1,
      letterSpacing: -0.15,
      backgroundColor: '#FFFFFF',
      color: '#102D69',
      radius: 999,
      paddingX: 24,
      paddingY: 12,
      borderColor: 'rgba(16, 45, 105, 0.18)',
      borderWidth: 2,
    },

    strong: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 800,
      fontSize: 28,
      lineHeight: 1,
      letterSpacing: -0.2,
      backgroundColor: '#102D69',
      color: '#FFFFFF',
      radius: 999,
      paddingX: 26,
      paddingY: 13,
    },
  },

  price: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 800,
      fontSize: 34,
      lineHeight: 1,
      letterSpacing: -0.4,
      backgroundColor: '#102D69',
      color: '#FFFFFF',
      radius: 999,
      paddingX: 30,
      paddingY: 16,
    },

    soft: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 800,
      fontSize: 32,
      lineHeight: 1,
      letterSpacing: -0.35,
      backgroundColor: '#EAF1FF',
      color: '#102D69',
      radius: 999,
      paddingX: 28,
      paddingY: 15,
    },
  },

  startDate: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 700,
      fontSize: 28,
      lineHeight: 1,
      letterSpacing: -0.25,
      backgroundColor: '#EAF1FF',
      color: '#102D69',
      radius: 999,
      paddingX: 26,
      paddingY: 14,
      borderColor: 'rgba(16, 45, 105, 0.12)',
      borderWidth: 2,
    },
  },

  city: {
    default: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 700,
      fontSize: 26,
      lineHeight: 1,
      letterSpacing: -0.15,
      backgroundColor: '#FFFFFF',
      color: '#102D69',
      radius: 999,
      paddingX: 24,
      paddingY: 12,
      borderColor: 'rgba(16, 45, 105, 0.16)',
      borderWidth: 2,
    },

    compact: {
      fontFamily: SOCIAL_BASE_FONT_FAMILY,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1,
      letterSpacing: -0.1,
      backgroundColor: '#FFFFFF',
      color: '#102D69',
      radius: 999,
      paddingX: 20,
      paddingY: 10,
      borderColor: 'rgba(16, 45, 105, 0.16)',
      borderWidth: 2,
    },
  },

  partnerLogo: {
    default: {
      backgroundColor: '#FFFFFF',
      radius: 22,
      paddingX: 24,
      paddingY: 16,
      maxWidth: 240,
      maxHeight: 92,
    },

    compact: {
      backgroundColor: '#FFFFFF',
      radius: 18,
      paddingX: 20,
      paddingY: 13,
      maxWidth: 200,
      maxHeight: 78,
    },
  },

  brandLogo: {
    default: {
      maxWidth: 178,
      maxHeight: 62,
    },
  },
} as const;

export type SocialComponentStyles = typeof SOCIAL_COMPONENT_STYLES;