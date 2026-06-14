import type { SocialDesignSystem } from '../../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../../types/social.types';
import type { SocialFormatDefinition } from '../socialFormats';
import {
  getSocialBadgeFlowHeight,
  getVisibleSocialCourseBadges,
} from './socialBadgeFlow';
import { fitSocialCourseTitle } from './socialTitleFit';

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
  creative: SocialCreativeData;
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

function countVisibleFacts(creative: SocialCreativeData): number {
  if (!creative.enabledComponents.includes('courseFacts')) {
    return 0;
  }

  return (creative.courseFacts ?? []).filter((fact) => fact.value).slice(0, 4).length;
}

function getFactsHeight({
  creative,
  system,
}: {
  creative: SocialCreativeData;
  system: SocialDesignSystem;
}): number {
  const factsCount = countVisibleFacts(creative);

  if (factsCount === 0) {
    return 0;
  }

  const { components, spacing } = system;
  const columns = factsCount === 1 ? 1 : 2;
  const rows = Math.ceil(factsCount / columns);
  const itemHeight = Math.max(
    spacing[18],
    components.infoGrid.valueFontSize +
      components.infoGrid.labelFontSize +
      spacing[6],
  );

  return rows * itemHeight + Math.max(0, rows - 1) * components.infoGrid.gap;
}

function getBadgesHeight({
  creative,
  system,
  width,
}: {
  creative: SocialCreativeData;
  system: SocialDesignSystem;
  width: number;
}): number {
  const badges = getVisibleSocialCourseBadges({ creative, system });

  return getSocialBadgeFlowHeight({ badges, system, width });
}

export function createSocialResponsiveLayout({
  format,
  system,
  creative,
}: CreateSocialResponsiveLayoutOptions): SocialResponsiveLayout {
  const { spacing, components } = system;
  const safeArea = createSafeArea(system);
  const canvas = rect(0, 0, format.width, format.height);
  const hasCity =
    creative.enabledComponents.includes('city') &&
    Boolean(creative.cityName) &&
    creative.offerMode !== 'online';

  const footerHeight = Math.max(components.logoBox.height, components.badge.height);
  const footer = rect(
    safeArea.x,
    safeArea.y + safeArea.height - footerHeight,
    safeArea.width,
    footerHeight,
  );

  const photo = rect(
    0,
    0,
    format.width,
    system.format.photoHeight,
  );

  const partnerLogoWidth = Math.min(
    components.partnerBox.maxWidth,
    Math.max(components.partnerBox.minWidth, spacing[28]),
  );

  const partnerLogo = rect(
    photo.x + photo.width - partnerLogoWidth - spacing[6],
    photo.y + photo.height - components.partnerBox.height - spacing[6],
    partnerLogoWidth,
    components.partnerBox.height,
  );

  const sectionGap = spacing[4];
  const footerGap = spacing[6];

  const badgesHeight = getBadgesHeight({
    creative,
    system,
    width: safeArea.width,
  });
  const cityHeight = hasCity ? components.badge.height : 0;

  const contentY = photo.y + photo.height;
  const maxTitleCardHeight = Math.max(
    system.typography.heroXs.fontSize,
    footer.y -
      footerGap -
      (badgesHeight > 0 ? badgesHeight + sectionGap : 0) -
      (cityHeight > 0 ? cityHeight + sectionGap : 0) -
      contentY,
  );

  const titleInnerWidth = safeArea.width - components.titleCard.paddingX * 2;
  const titleFit = fitSocialCourseTitle({
    creative,
    system,
    width: titleInnerWidth,
    maxHeight: Math.max(
      system.typography.heroXs.fontSize,
      maxTitleCardHeight - components.titleCard.paddingY * 2,
    ),
    maxLines: 3,
  });

  const titleCardHeight = Math.max(
    components.titleCard.paddingY * 2 + titleFit.height,
    components.titleCard.paddingY * 2 + system.typography.heroXs.fontSize,
  );

  const titleCard = rect(
    safeArea.x,
    contentY,
    safeArea.width,
    titleCardHeight,
  );

  const courseName = rect(
    titleCard.x + components.titleCard.paddingX,
    titleCard.y + components.titleCard.paddingY,
    titleCard.width - components.titleCard.paddingX * 2,
    Math.max(0, titleCard.height - components.titleCard.paddingY * 2),
  );

  const brandLogo = rect(
    footer.x,
    footer.y,
    components.logoBox.width,
    footer.height,
  );

  const factsHeight = getFactsHeight({
    creative,
    system,
  });
  const factsX = footer.x + components.logoBox.width + spacing[8];
  const factsRight = footer.x + footer.width;
  const courseFacts = rect(
    factsX,
    footer.y,
    factsHeight > 0 ? Math.max(0, factsRight - factsX) : 0,
    factsHeight > 0 ? footer.height : 0,
  );

  const courseBadges = rect(
    safeArea.x,
    titleCard.y + titleCard.height + (badgesHeight > 0 ? sectionGap : 0),
    safeArea.width,
    badgesHeight,
  );

  const city = rect(
    safeArea.x,
    courseBadges.y +
      courseBadges.height +
      (cityHeight > 0 ? sectionGap : 0),
    Math.min(spacing[32], safeArea.width),
    cityHeight,
  );

  const contentBottom = Math.max(
    city.y + city.height,
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
