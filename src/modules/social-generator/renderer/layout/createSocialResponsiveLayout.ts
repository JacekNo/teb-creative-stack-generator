import type { ResponsiveScale } from '../../../creative-stack/design-system/createResponsiveScale';
import type { SocialFormatDefinition } from '../socialFormats';

export type SocialRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SocialResponsiveLayoutKind = 'square' | 'portrait' | 'story';

export type SocialResponsiveLayout = {
  kind: SocialResponsiveLayoutKind;
  canvas: SocialRect;
  safeArea: SocialRect;
  photo: SocialRect;
  content: SocialRect;
  courseName: SocialRect;
  benefit: SocialRect;
  price: SocialRect;
  startDate: SocialRect;
  city: SocialRect;
  offerMode: SocialRect;
  partnerLogo: SocialRect;
  brandLogo: SocialRect;
};

export type CreateSocialResponsiveLayoutOptions = {
  format: SocialFormatDefinition;
  scale: ResponsiveScale;
};

type SocialSlotUnits = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SocialLayoutTemplate = {
  photo: SocialSlotUnits;
  partnerLogo: SocialSlotUnits;
  courseName: SocialSlotUnits;
  offerMode: SocialSlotUnits;
  benefit: SocialSlotUnits;
  price: SocialSlotUnits;
  startDate: SocialSlotUnits;
  city: SocialSlotUnits;
  brandLogo: SocialSlotUnits;
};

const SOCIAL_LAYOUT_TEMPLATES: Record<
  SocialResponsiveLayoutKind,
  SocialLayoutTemplate
> = {
  square: {
    photo: {
      x: 5.6,
      y: 5.6,
      width: 96.8,
      height: 54.8,
    },
    partnerLogo: {
      x: 76,
      y: 8.8,
      width: 22,
      height: 9.2,
    },
    courseName: {
      x: 7.2,
      y: 64.8,
      width: 78,
      height: 21,
    },
    offerMode: {
      x: 7.2,
      y: 59,
      width: 26,
      height: 6.4,
    },
    benefit: {
      x: 7.2,
      y: 84,
      width: 72,
      height: 8.8,
    },
    price: {
      x: 7.2,
      y: 94,
      width: 19,
      height: 7.2,
    },
    startDate: {
      x: 28,
      y: 94,
      width: 25,
      height: 7.2,
    },
    city: {
      x: 72,
      y: 94,
      width: 26,
      height: 7.2,
    },
    brandLogo: {
      x: 7.2,
      y: 99.4,
      width: 17.8,
      height: 6.2,
    },
  },

  portrait: {
    photo: {
      x: 5.6,
      y: 5.6,
      width: 96.8,
      height: 69,
    },
    partnerLogo: {
      x: 76,
      y: 8.8,
      width: 22,
      height: 9.2,
    },
    courseName: {
      x: 7.2,
      y: 80,
      width: 82,
      height: 25,
    },
    offerMode: {
      x: 7.2,
      y: 72.8,
      width: 26,
      height: 6.4,
    },
    benefit: {
      x: 7.2,
      y: 104.8,
      width: 76,
      height: 9.2,
    },
    price: {
      x: 7.2,
      y: 116,
      width: 19,
      height: 7.2,
    },
    startDate: {
      x: 28,
      y: 116,
      width: 25,
      height: 7.2,
    },
    city: {
      x: 72,
      y: 116,
      width: 26,
      height: 7.2,
    },
    brandLogo: {
      x: 7.2,
      y: 125.6,
      width: 17.8,
      height: 6.2,
    },
  },

  story: {
    photo: {
      x: 6.4,
      y: 28.4,
      width: 95.2,
      height: 76,
    },
    partnerLogo: {
      x: 75.6,
      y: 32,
      width: 22,
      height: 9.2,
    },
    courseName: {
      x: 7.2,
      y: 110,
      width: 82,
      height: 27,
    },
    offerMode: {
      x: 7.2,
      y: 102.8,
      width: 26,
      height: 6.4,
    },
    benefit: {
      x: 7.2,
      y: 137.6,
      width: 76,
      height: 9.6,
    },
    price: {
      x: 7.2,
      y: 149.8,
      width: 19,
      height: 7.2,
    },
    startDate: {
      x: 28,
      y: 149.8,
      width: 25,
      height: 7.2,
    },
    city: {
      x: 7.2,
      y: 158.8,
      width: 28,
      height: 7.2,
    },
    brandLogo: {
      x: 7.2,
      y: 168.8,
      width: 17.8,
      height: 6.2,
    },
  },
};

function rect(
  x: number,
  y: number,
  width: number,
  height: number,
): SocialRect {
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function fromUnits(slot: SocialSlotUnits, u: number): SocialRect {
  return rect(
    slot.x * u,
    slot.y * u,
    slot.width * u,
    slot.height * u,
  );
}

function getLayoutKind(
  format: SocialFormatDefinition,
): SocialResponsiveLayoutKind {
  if (format.ratio === '9:16') {
    return 'story';
  }

  if (format.ratio === '4:5') {
    return 'portrait';
  }

  return 'square';
}

function createSafeArea(
  format: SocialFormatDefinition,
  u: number,
): SocialRect {
  if (format.safeZone) {
    const { top, right, bottom, left } = format.safeZone;

    return rect(
      left,
      top,
      format.width - left - right,
      format.height - top - bottom,
    );
  }

  return rect(
    5.6 * u,
    5.6 * u,
    format.width - 11.2 * u,
    format.height - 11.2 * u,
  );
}

function createContentArea(
  slots: Pick<
    SocialResponsiveLayout,
    | 'courseName'
    | 'benefit'
    | 'price'
    | 'startDate'
    | 'city'
    | 'offerMode'
    | 'brandLogo'
  >,
): SocialRect {
  const slotList = Object.values(slots);

  const minX = Math.min(...slotList.map((slot) => slot.x));
  const minY = Math.min(...slotList.map((slot) => slot.y));
  const maxX = Math.max(...slotList.map((slot) => slot.x + slot.width));
  const maxY = Math.max(...slotList.map((slot) => slot.y + slot.height));

  return rect(minX, minY, maxX - minX, maxY - minY);
}

export function createSocialResponsiveLayout({
  format,
  scale,
}: CreateSocialResponsiveLayoutOptions): SocialResponsiveLayout {
  const kind = getLayoutKind(format);
  const template = SOCIAL_LAYOUT_TEMPLATES[kind];
  const { u } = scale;

  const courseName = fromUnits(template.courseName, u);
  const benefit = fromUnits(template.benefit, u);
  const price = fromUnits(template.price, u);
  const startDate = fromUnits(template.startDate, u);
  const city = fromUnits(template.city, u);
  const offerMode = fromUnits(template.offerMode, u);
  const brandLogo = fromUnits(template.brandLogo, u);

  const content = createContentArea({
    courseName,
    benefit,
    price,
    startDate,
    city,
    offerMode,
    brandLogo,
  });

  return {
    kind,
    canvas: rect(0, 0, format.width, format.height),
    safeArea: createSafeArea(format, u),
    photo: fromUnits(template.photo, u),
    content,
    courseName,
    benefit,
    price,
    startDate,
    city,
    offerMode,
    partnerLogo: fromUnits(template.partnerLogo, u),
    brandLogo,
  };
}