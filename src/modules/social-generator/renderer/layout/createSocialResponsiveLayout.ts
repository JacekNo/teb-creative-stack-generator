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

function getLayoutKind(format: SocialFormatDefinition): SocialResponsiveLayoutKind {
  if (format.height >= 1800) return 'story';
  if (format.height > format.width) return 'portrait';
  return 'square';
}

export function createSocialResponsiveLayout({
  format,
  scale,
}: CreateSocialResponsiveLayoutOptions): SocialResponsiveLayout {
  const { width, height } = format;
  const { u } = scale;

  const kind = getLayoutKind(format);

  const isStory = kind === 'story';
  const isPortrait = kind === 'portrait';

  const marginX = isStory ? 7.2 * u : 5.6 * u;
  const marginTop = isStory ? 16 * u : 5.8 * u;
  const marginBottom = isStory ? 18 * u : 6.4 * u;
  const gap = 2.4 * u;

  const canvas = rect(0, 0, width, height);

  const safeArea = rect(
    marginX,
    marginTop,
    width - marginX * 2,
    height - marginTop - marginBottom,
  );

  const photo = rect(0, 0, width, height);

  const contentHeight = isStory
    ? safeArea.height * 0.46
    : isPortrait
      ? safeArea.height * 0.42
      : safeArea.height * 0.38;

  const content = rect(
    safeArea.x,
    safeArea.y + safeArea.height - contentHeight,
    safeArea.width,
    contentHeight,
  );

  const brandLogo = rect(
    safeArea.x,
    safeArea.y + safeArea.height - 6.2 * u,
    30 * u,
    6.2 * u,
  );

  const partnerLogo = rect(
    safeArea.x + safeArea.width - 28 * u,
    brandLogo.y - 9.2 * u - gap,
    28 * u,
    9.2 * u,
  );

  const courseNameHeight = isStory
    ? content.height * 0.42
    : content.height * 0.46;

  const courseName = rect(
    content.x,
    content.y,
    content.width,
    courseNameHeight,
  );

  const benefit = rect(
    content.x,
    courseName.y + courseName.height + gap,
    isStory ? content.width * 0.78 : content.width * 0.68,
    6.2 * u,
  );

  const price = rect(
    content.x,
    benefit.y + benefit.height + gap,
    isStory ? content.width * 0.62 : content.width * 0.52,
    7.4 * u,
  );

  const startDate = rect(
    price.x + price.width + gap,
    price.y,
    Math.max(0, content.width - price.width - gap),
    price.height,
  );

  const offerMode = rect(
    content.x,
    price.y + price.height + gap,
    isStory ? content.width * 0.5 : content.width * 0.42,
    5.4 * u,
  );

  const city = rect(
    brandLogo.x + brandLogo.width + gap,
    brandLogo.y,
    Math.max(0, safeArea.width - brandLogo.width - gap),
    brandLogo.height,
  );

  return {
    kind,
    canvas,
    safeArea,
    photo,
    content,
    courseName,
    benefit,
    price,
    startDate,
    city,
    offerMode,
    partnerLogo,
    brandLogo,
  };
}