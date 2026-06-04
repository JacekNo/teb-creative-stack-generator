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

export interface TitleCardLayout extends RectLayout {
  paddingX: number;
  paddingY: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  contentVerticalAlign?: "top" | "center";
}

export interface ActionRowLayout {
  x: number;
  y: number;
  height: number;
  gap: number;

  cta: {
    minWidth: number;
    maxWidth: number;
    paddingX: number;
    fontSize: number;
  };

  city: {
    minWidth: number;
    maxWidth: number;
    paddingX: number;
    fontSize: number;
  };

  logo: {
    x: number;
    y: number;
    width: number;
    height: number;
    paddingX?: number;
    paddingY?: number;
  };
}

export interface GoogleAdsLayout {
  formatId: GoogleAdsFormatId;

  background: RectLayout;
  photo: RectLayout;
  contentPanel: RectLayout;

  titleCard: TitleCardLayout;

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

    /**
     * Stały slot zdjęcia według referencji Figma 1200x628.
     * Uwaga: docelowo warto zastąpić zwykłe rx własnym clipPath dla narożników.
     */
    photo: {
      x: 553,
      y: 0,
      width: 647,
      height: 473,
      radius: 78,
    },

    contentPanel: {
      x: 0,
      y: 0,
      width: 1200,
      height: 628,
    },

    titleCard: {
      x: 48,
      y: 155,
      width: 430,
      height: 208,
      radius: 12,
      paddingX: 30,
      paddingY: 28,
      minWidth: 280,
      maxWidth: 430,
      minHeight: 126,
      maxHeight: 230,
      contentVerticalAlign: "center",
    },

    title: {
      x: 78,
      y: 194,
      maxChars: 18,
      maxLines: 3,
      fontSize: 42,
      lineHeight: 45,
    },

    subtitle: {
      x: 78,
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
        minWidth: 110,
        maxWidth: 291,
        paddingX: 22,
        fontSize: 30,
      },

      city: {
        minWidth: 90,
        maxWidth: 450,
        paddingX: 22,
        fontSize: 30,
      },

      logo: {
  x: 953,
  y: 495,
  width: 230,
  height: 119,
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

    /**
     * Stały slot zdjęcia według referencji Figma 960x1200.
     * Lewy brandowy pas zostaje widoczny, zdjęcie dochodzi do prawej krawędzi.
     */
    photo: {
      x: 50,
      y: 0,
      width: 910,
      height: 680,
      radius: 78,
    },

    contentPanel: {
      x: 0,
      y: 700,
      width: 960,
      height: 500,
    },

    titleCard: {
      x: 38,
      y: 738,
      width: 800,
      height: 220,
      radius: 12,
      paddingX: 30,
      paddingY: 28,
      minWidth: 280,
      maxWidth: 800,
      minHeight: 126,
      maxHeight: 220,
      contentVerticalAlign: "center",
    },

    title: {
      x: 68,
      y: 802,
      maxChars: 22,
      maxLines: 3,
      fontSize: 48,
      lineHeight: 52,
    },

    subtitle: {
      x: 68,
      y: 878,
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
        minWidth: 110,
        maxWidth: 291,
        paddingX: 22,
        fontSize: 30,
      },

      city: {
        minWidth: 90,
        maxWidth: 347,
        paddingX: 22,
        fontSize: 26,
      },

      logo: {
  x: 699,
  y: 1049,
  width: 230,
  height: 119,
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

    /**
     * Stały slot zdjęcia według referencji Figma 1200x1200.
     * Zdjęcie jest duże, dociągnięte do góry i prawej krawędzi.
     */
    photo: {
      x: 50,
      y: 0,
      width: 1150,
      height: 680,
      radius: 78,
    },

    contentPanel: {
      x: 0,
      y: 680,
      width: 1200,
      height: 520,
    },

    titleCard: {
      x: 49,
      y: 725,
      width: 977,
      height: 190,
      radius: 12,
      paddingX: 30,
      paddingY: 28,
      minWidth: 284,
      maxWidth: 977,
      minHeight: 126,
      maxHeight: 190,
      contentVerticalAlign: "center",
    },

    title: {
      x: 79,
      y: 790,
      maxChars: 24,
      maxLines: 3,
      fontSize: 52,
      lineHeight: 56,
    },

    subtitle: {
      x: 79,
      y: 868,
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
        minWidth: 130,
        maxWidth: 376,
        paddingX: 28,
        fontSize: 34,
      },

      city: {
        minWidth: 100,
        maxWidth: 437,
        paddingX: 28,
        fontSize: 30,
      },

      logo: {
  x: 923,
  y: 1024,
  width: 230,
  height: 119,
},
    },
  },
};

export function getGoogleAdsLayout(format: GoogleAdsFormat): GoogleAdsLayout {
  return GOOGLE_ADS_LAYOUTS[format.id];
}
