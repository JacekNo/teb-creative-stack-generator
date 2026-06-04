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

export interface TitleCardLayout {
  x: number;
  y: number;
  radius?: number;

  paddingX: number;
  paddingY: number;

  minWidth: number;
  maxWidth: number;

  minHeight: number;
  maxHeight: number;

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
export interface PatternArrowLayout {
  x: number;
  y: number;
  scale: number;
  rotate?: number;
  opacity?: number;
}

export interface PatternLayout {
  color: string;
  columns: number;
  gap: number;
  rowGap: number;
  insetX: number;
  insetY: number;
  opacity: number;
  rotate?: number;
  stagger?: boolean;
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
  pattern: PatternLayout;
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
      y: 132,
      radius: 12,

      paddingX: 22,
      paddingY: 20,

      minWidth: 170,
      maxWidth: 500,

      minHeight: 82,
      maxHeight: 260,

      contentVerticalAlign: "center",
    },

    title: {
      x: 70,
      y: 194,
      maxChars: 18,
      maxLines: 4,
      fontSize: 46,
      lineHeight: 41,
    },

    subtitle: {
      x: 70,
      y: 316,
      maxChars: 30,
      maxLines: 2,
      fontSize: 34,
      lineHeight: 34,
    },

    actionRow: {
      x: 49,
      y: 505,
      height: 104,
      gap: 12,

      cta: {
        minWidth: 150,
        maxWidth: 360,
        paddingX: 32,
        fontSize: 36,
      },

      city: {
        minWidth: 120,
        maxWidth: 450,
        paddingX: 28,
        fontSize: 32,
      },

      logo: {
        x: 953,
        y: 495,
        width: 230,
        height: 119,
      },
    },
    pattern: {
  color: "#FFFFFF",
  columns: 17,
  gap: 8,
  rowGap: 8,
  insetX: 18,
  insetY: 18,
  opacity: 0.35,
  rotate: 0,
  stagger: true,
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
      x: 50,
      y: 710,
      radius: 14,

      paddingX: 28,
      paddingY: 24,

      minWidth: 220,
      maxWidth: 810,

      minHeight: 92,
      maxHeight: 280,

      contentVerticalAlign: "center",
    },

    title: {
      x: 78,
      y: 728,
      maxChars: 22,
      maxLines: 4,
      fontSize: 60,
      lineHeight: 54,
    },

    subtitle: {
      x: 78,
      y: 868,
      maxChars: 32,
      maxLines: 2,
      fontSize: 42,
      lineHeight: 40,
    },

    actionRow: {
      x: 38,
      y: 1063,
      height: 104,
      gap: 14,

      cta: {
        minWidth: 160,
        maxWidth: 340,
        paddingX: 32,
        fontSize: 38,
      },

      city: {
        minWidth: 120,
        maxWidth: 370,
        paddingX: 28,
        fontSize: 34,
      },

      logo: {
        x: 699,
        y: 1049,
        width: 230,
        height: 119,
      },
    },
    pattern: {
  color: "#FFFFFF",
  columns: 10,
  gap: 10,
  rowGap: 10,
  insetX: 20,
  insetY: 20,
  opacity: 0.35,
  rotate: 0,
  stagger: true,
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
      x: 50,
      y: 706,
      radius: 14,

      paddingX: 28,
      paddingY: 24,

      minWidth: 220,
      maxWidth: 980,

      minHeight: 92,
      maxHeight: 260,

      contentVerticalAlign: "center",
    },

    title: {
      x: 78,
      y: 778,
      maxChars: 24,
      maxLines: 3,
      fontSize: 58,
      lineHeight: 52,
    },

    subtitle: {
      x: 78,
      y: 896,
      maxChars: 38,
      maxLines: 2,
      fontSize: 42,
      lineHeight: 38,
    },

    actionRow: {
      x: 50,
      y: 1038,
      height: 104,
      gap: 14,

      cta: {
        minWidth: 170,
        maxWidth: 420,
        paddingX: 34,
        fontSize: 40,
      },

      city: {
        minWidth: 130,
        maxWidth: 460,
        paddingX: 30,
        fontSize: 34,
      },

      logo: {
        x: 923,
        y: 1024,
        width: 230,
        height: 119,
      },
    },
pattern: {
  color: "#FFFFFF",
  columns: 13,
  gap: 10,
  rowGap: 10,
  insetX: 20,
  insetY: 20,
  opacity: 0.35,
  rotate: 0,
  stagger: true,
},
  },
};

export function getGoogleAdsLayout(format: GoogleAdsFormat): GoogleAdsLayout {
  return GOOGLE_ADS_LAYOUTS[format.id];
}
