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

  const footerHeight = Math.max(components.logoBox.height, components.badge.height);
  const footer = rect(
    safeArea.x,
    safeArea.y + safeArea.height - footerHeight,
    safeArea.width,
    footerHeight,
  );

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

  const sectionGap = spacing[5];
  const footerGap = spacing[6];

  const titleInnerWidth = safeArea.width - components.titleCard.paddingX * 2;
  const titleFit = fitSocialCourseTitle({
    creative,
    system,
    width: titleInnerWidth,
    maxLines: 3,
  });

  const titleCardHeight = Math.max(
    components.titleCard.paddingY * 2 + titleFit.height,
    components.titleCard.paddingY * 2 + system.typography.heroXs.fontSize,
  );

  const factsHeight = getFactsHeight({
    creative,
    system,
  });

  const badgesHeight = getBadgesHeight({
    creative,
    system,
    width: safeArea.width,
  });

  const stackHeight =
    titleCardHeight +
    (factsHeight > 0 ? sectionGap + factsHeight : 0) +
    (badgesHeight > 0 ? sectionGap + badgesHeight : 0);

  const baseContentY = photo.y + photo.height - system.format.contentOverlap;
  const maxContentY = footer.y - footerGap - stackHeight;
  const minContentY = photo.y + photo.height * 0.52;
  const contentY = Math.max(minContentY, Math.min(baseContentY, maxContentY));

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

  const courseFacts = rect(
    safeArea.x,
    titleCard.y + titleCard.height + (factsHeight > 0 ? sectionGap : 0),
    safeArea.width,
    factsHeight,
  );

  const courseBadges = rect(
    safeArea.x,
    courseFacts.y + courseFacts.height + (badgesHeight > 0 ? sectionGap : 0),
    safeArea.width,
    badgesHeight,
  );

  const brandLogo = rect(
    footer.x,
    footer.y,
    components.logoBox.width,
    footer.height,
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
