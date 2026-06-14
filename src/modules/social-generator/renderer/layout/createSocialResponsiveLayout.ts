import type { SocialDesignSystem } from '../../design-system/createSocialDesignSystem';
import type { SocialLayoutSlot } from '../../types/social.types';
import type { SocialFormatDefinition } from '../socialFormats';

export type SocialRect = SocialLayoutSlot;

export type SocialResponsiveLayoutKind = 'square' | 'portrait' | 'stories';

export type SocialResponsiveLayout = {
  kind: SocialResponsiveLayoutKind;
  canvas: SocialRect;
  safeArea: SocialRect;
  photo: SocialRect;
  content: SocialRect;
  titleCard: SocialRect;
  courseName: SocialRect;
  courseFacts: SocialRect;
  courseBadges: SocialRect;
  footer: SocialRect;
  city: SocialRect;
  partnerLogo: SocialRect;
  brandLogo: SocialRect;
};

export type CreateSocialResponsiveLayoutOptions = {
  format: SocialFormatDefinition;
  system: SocialDesignSystem;
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

function createSafeArea(system: SocialDesignSystem): SocialRect {
  const { safe, width, height } = system.format;

  return rect(
    safe.left,
    safe.top,
    width - safe.left - safe.right,
    height - safe.top - safe.bottom,
  );
}

function getTitleCardHeight(system: SocialDesignSystem): number {
  const { spacing } = system;

  if (system.formatKey === 'stories') {
    return spacing[32] + spacing[24];
  }

  if (system.formatKey === 'portrait') {
    return spacing[32] + spacing[16];
  }

  return spacing[32] + spacing[12];
}

function getFactsHeight(system: SocialDesignSystem): number {
  const { spacing } = system;

  if (system.formatKey === 'stories') {
    return spacing[32] + spacing[12];
  }

  if (system.formatKey === 'portrait') {
    return spacing[32];
  }

  return spacing[24] + spacing[4];
}

function getBadgesHeight(system: SocialDesignSystem): number {
  const { spacing } = system;

  if (system.formatKey === 'stories') {
    return spacing[24];
  }

  return spacing[16];
}

export function createSocialResponsiveLayout({
  format,
  system,
}: CreateSocialResponsiveLayoutOptions): SocialResponsiveLayout {
  const { spacing, components } = system;
  const safeArea = createSafeArea(system);
  const canvas = rect(0, 0, format.width, format.height);

  const photo = rect(
    safeArea.x,
    safeArea.y,
    safeArea.width,
    system.format.photoHeight,
  );

  const partnerLogoWidth = Math.min(
    components.partnerBox.maxWidth,
    Math.max(components.partnerBox.minWidth, spacing[28]),
  );

  const partnerLogo = rect(
    photo.x + photo.width - partnerLogoWidth - spacing[4],
    photo.y + spacing[4],
    partnerLogoWidth,
    components.partnerBox.height,
  );

  const contentY = photo.y + photo.height - system.format.contentOverlap;
  const footerHeight = components.logoBox.height;
  const sectionGap = spacing[5];

  const titleCard = rect(
    safeArea.x,
    contentY,
    safeArea.width,
    getTitleCardHeight(system),
  );

  const courseName = rect(
    titleCard.x + components.titleCard.paddingX,
    titleCard.y + components.titleCard.paddingY,
    titleCard.width - components.titleCard.paddingX * 2,
    titleCard.height - components.titleCard.paddingY * 2,
  );

  const courseFacts = rect(
    safeArea.x,
    titleCard.y + titleCard.height + sectionGap,
    safeArea.width,
    getFactsHeight(system),
  );

  const courseBadges = rect(
    safeArea.x,
    courseFacts.y + courseFacts.height + sectionGap,
    safeArea.width,
    getBadgesHeight(system),
  );

  const footer = rect(
    safeArea.x,
    safeArea.y + safeArea.height - footerHeight,
    safeArea.width,
    footerHeight,
  );

  const brandLogo = rect(
    footer.x,
    footer.y,
    components.logoBox.width,
    components.logoBox.height,
  );

  const city = rect(
    footer.x + footer.width - spacing[28],
    footer.y + Math.max(0, (footer.height - components.badge.height) / 2),
    spacing[28],
    components.badge.height,
  );

  const contentBottom = Math.max(
    courseBadges.y + courseBadges.height,
    footer.y + footer.height,
  );

  const content = rect(
    safeArea.x,
    titleCard.y,
    safeArea.width,
    contentBottom - titleCard.y,
  );

  return {
    kind: system.formatKey,
    canvas,
    safeArea,
    photo,
    content,
    titleCard,
    courseName,
    courseFacts,
    courseBadges,
    footer,
    city,
    partnerLogo,
    brandLogo,
  };
}
