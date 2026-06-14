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

function getVisibleFactsCount(creative: SocialCreativeData): number {
  if (!creative.enabledComponents.includes('courseFacts')) {
    return 0;
  }

  return (creative.courseFacts ?? [])
    .filter((fact) => Boolean(fact.value))
    .slice(0, 4).length;
}

function getFactsHeight({
  creative,
  system,
}: {
  creative: SocialCreativeData;
  system: SocialDesignSystem;
}): number {
  const factsCount = getVisibleFactsCount(creative);

  if (factsCount === 0) {
    return 0;
  }

  const { factStack } = system.components;
  const visibleCount = Math.min(factsCount, factStack.maxItems);

  return (
    visibleCount * factStack.itemHeight +
    Math.max(0, visibleCount - 1) * factStack.gap
  );
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

  const footerHeight = components.logoBox.height;
  const footer = rect(
    safeArea.x,
    safeArea.y + safeArea.height - footerHeight,
    safeArea.width,
    footerHeight,
  );

  const contentInsetX = Math.min(
    components.contentFlow.insetX,
    Math.max(0, safeArea.width * 0.08),
  );
  const contentX = safeArea.x + contentInsetX;
  const contentWidth = Math.max(0, safeArea.width - contentInsetX * 2);

  const photo = rect(
    0,
    0,
    format.width,
    system.format.photoHeight,
  );

  const city = hasCity
    ? rect(
        safeArea.x + spacing[2],
        safeArea.y + spacing[2],
        Math.min(safeArea.width - spacing[4], spacing[32] * 4.5),
        components.cityBadge.height,
      )
    : rect(safeArea.x, safeArea.y, 0, 0);

  const partnerLogoWidth = Math.min(
    components.partnerBox.maxWidth,
    Math.max(components.partnerBox.minWidth, spacing[28]),
  );

  const partnerLogo = rect(
    safeArea.x + safeArea.width - partnerLogoWidth,
    photo.y + photo.height - components.partnerBox.height,
    partnerLogoWidth,
    components.partnerBox.height,
  );

  const contentStartY = Math.max(
    0,
    photo.y + photo.height - system.format.contentOverlap,
  );

  const badgesHeight = getBadgesHeight({
    creative,
    system,
    width: contentWidth,
  });
  const factsHeight = getFactsHeight({
    creative,
    system,
  });

  const reservedBelowTitle =
    (factsHeight > 0
      ? components.contentFlow.titleToFactsGap + factsHeight
      : 0) +
    (badgesHeight > 0
      ? components.contentFlow.factsToBadgesGap + badgesHeight
      : 0) +
    components.contentFlow.badgesToFooterGap;

  const maxTitleCardHeight = Math.max(
    system.typography.heroXs.fontSize,
    footer.y - contentStartY - reservedBelowTitle,
  );

  const titleInnerWidth = contentWidth;
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
    contentStartY,
    safeArea.width,
    titleCardHeight,
  );

  const courseName = rect(
    contentX,
    titleCard.y + components.titleCard.paddingY,
    contentWidth,
    Math.max(0, titleCard.height - components.titleCard.paddingY * 2),
  );

  const courseFacts = factsHeight > 0
    ? rect(
        contentX,
        titleCard.y + titleCard.height + components.contentFlow.titleToFactsGap,
        Math.min(contentWidth, spacing[32] * 3.6),
        factsHeight,
      )
    : rect(contentX, titleCard.y + titleCard.height, 0, 0);

  const courseBadgesNaturalY =
    courseFacts.height > 0
      ? courseFacts.y + courseFacts.height + components.contentFlow.factsToBadgesGap
      : titleCard.y + titleCard.height + components.contentFlow.titleToFactsGap;

  const courseBadgesBottomY =
    footer.y - components.contentFlow.badgesToFooterGap - badgesHeight;
  const courseBadgesY =
    badgesHeight > 0
      ? Math.max(courseBadgesNaturalY, courseBadgesBottomY)
      : courseBadgesNaturalY;

  const badgesAvailableHeight = Math.max(
    0,
    footer.y - components.contentFlow.badgesToFooterGap - courseBadgesY,
  );

  const courseBadges = rect(
    contentX,
    courseBadgesY,
    contentWidth,
    Math.min(badgesHeight, badgesAvailableHeight),
  );

  const brandLogo = rect(
    contentX,
    footer.y,
    components.logoBox.width,
    footer.height,
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
