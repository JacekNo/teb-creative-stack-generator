import type { GoogleAdsFormat, GoogleAdsFormatId } from "./googleAdsFormats";

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
    x: number;
    y: number;
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
    formatId: "landscape_1200x628",

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
      x: 49,
      y: 505,
      height: 89,
      gap: 11,

      cta: {
        width: 291,
        fontSize: 30,
      },

      city: {
        minWidth: 121,
        maxWidth: 450,
        fontSize: 30,
      },

      logo: {
        x: 953,
        y: 495,
        width: 210,
        height: 109,
      },
    },
  },

  portrait_960x1200: {
    formatId: "portrait_960x1200",

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
      x: 38,
      y: 1063,
      height: 89,
      gap: 11,

      cta: {
        width: 291,
        fontSize: 30,
      },

      city: {
        minWidth: 120,
        maxWidth: 347,
        fontSize: 26,
      },

      logo: {
        x: 699,
        y: 1049,
        width: 227,
        height: 117,
      },
    },
  },

  square_1200x1200: {
    formatId: "square_1200x1200",

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
      x: 50,
      y: 1038,
      height: 89,
      gap: 10,

      cta: {
        width: 376,
        fontSize: 34,
      },

      city: {
        minWidth: 120,
        maxWidth: 437,
        fontSize: 30,
      },

      logo: {
        x: 923,
        y: 1024,
        width: 227,
        height: 117,
      },
    },
  },
};

export function getGoogleAdsLayout(format: GoogleAdsFormat): GoogleAdsLayout {
  return GOOGLE_ADS_LAYOUTS[format.id];
}
