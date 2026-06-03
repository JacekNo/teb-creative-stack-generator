import type { GoogleAdsFormat, GoogleAdsFormatId } from './googleAdsFormats';

export interface RectLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
}

export interface TextLayout {
  x: number;
  y: number;
  maxChars: number;
  maxLines: number;
  fontSize: number;
  lineHeight: number;
}

export interface ActionRowLayout {
  x: number;
  y: number;
  height: number;
  gap: number;

  cta: {
    width: number;
    fontSize: number;
  };

  city: {
    minWidth: number;
    maxWidth: number;
    fontSize: number;
  };

  logo: {
    width: number;
    height: number;
  };
}

export interface GoogleAdsLayout {
  formatId: GoogleAdsFormatId;

  background: RectLayout;
  photo: RectLayout;
  contentPanel: RectLayout;

  titleCard: RectLayout & {
    paddingX: number;
    paddingY: number;
  };

  title: TextLayout;
  subtitle: TextLayout;

  actionRow: ActionRowLayout;
}

const GOOGLE_ADS_LAYOUTS: Record<GoogleAdsFormatId, GoogleAdsLayout> = {
  landscape_1200x628: {
    formatId: 'landscape_1200x628',

    background: {
      x: 0,
      y: 0,
      width: 1200,
      height: 628,
    },

    photo: {
      x: 610,
      y: 72,
      width: 500,
      height: 330,
      radius: 28,
    },

    contentPanel: {
      x: 0,
      y: 0,
      width: 1200,
      height: 628,
    },

    titleCard: {
      x: 74,
      y: 132,
      width: 430,
      height: 208,
      radius: 20,
      paddingX: 30,
      paddingY: 32,
    },

    title: {
      x: 104,
      y: 194,
      maxChars: 18,
      maxLines: 3,
      fontSize: 42,
      lineHeight: 45,
    },

    subtitle: {
      x: 104,
      y: 316,
      maxChars: 30,
      maxLines: 2,
      fontSize: 23,
      lineHeight: 27,
    },

    actionRow: {
      x: 74,
      y: 488,
      height: 58,
      gap: 12,

      cta: {
        width: 180,
        fontSize: 21,
      },

      city: {
        minWidth: 250,
        maxWidth: 390,
        fontSize: 19,
      },

      logo: {
        width: 190,
        height: 58,
      },
    },
  },

  portrait_960x1200: {
    formatId: 'portrait_960x1200',

    background: {
      x: 0,
      y: 0,
      width: 960,
      height: 1200,
    },

    photo: {
      x: 86,
      y: 72,
      width: 788,
      height: 520,
      radius: 34,
    },

    contentPanel: {
      x: 0,
      y: 520,
      width: 960,
      height: 680,
    },

    titleCard: {
      x: 86,
      y: 660,
      width: 720,
      height: 220,
      radius: 22,
      paddingX: 34,
      paddingY: 38,
    },

    title: {
      x: 120,
      y: 728,
      maxChars: 22,
      maxLines: 3,
      fontSize: 48,
      lineHeight: 52,
    },

    subtitle: {
      x: 120,
      y: 868,
      maxChars: 32,
      maxLines: 2,
      fontSize: 28,
      lineHeight: 32,
    },

    actionRow: {
      x: 86,
      y: 1072,
      height: 58,
      gap: 12,

      cta: {
        width: 230,
        fontSize: 23,
      },

      city: {
        minWidth: 280,
        maxWidth: 390,
        fontSize: 20,
      },

      logo: {
        width: 190,
        height: 58,
      },
    },
  },

  square_1200x1200: {
    formatId: 'square_1200x1200',

    background: {
      x: 0,
      y: 0,
      width: 1200,
      height: 1200,
    },

    photo: {
      x: 86,
      y: 86,
      width: 1028,
      height: 560,
      radius: 34,
    },

    contentPanel: {
      x: 0,
      y: 560,
      width: 1200,
      height: 640,
    },

    titleCard: {
      x: 86,
      y: 710,
      width: 760,
      height: 190,
      radius: 22,
      paddingX: 34,
      paddingY: 36,
    },

    title: {
      x: 120,
      y: 778,
      maxChars: 24,
      maxLines: 3,
      fontSize: 52,
      lineHeight: 56,
    },

    subtitle: {
      x: 120,
      y: 896,
      maxChars: 38,
      maxLines: 2,
      fontSize: 30,
      lineHeight: 34,
    },

    actionRow: {
      x: 86,
      y: 1066,
      height: 62,
      gap: 14,

      cta: {
        width: 240,
        fontSize: 24,
      },

      city: {
        minWidth: 300,
        maxWidth: 430,
        fontSize: 21,
      },

      logo: {
        width: 204,
        height: 62,
      },
    },
  },
};

export function getGoogleAdsLayout(format: GoogleAdsFormat): GoogleAdsLayout {
  return GOOGLE_ADS_LAYOUTS[format.id];
}