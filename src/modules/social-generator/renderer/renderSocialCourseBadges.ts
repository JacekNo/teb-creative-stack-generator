import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import {
  createSocialBadgePlacements,
  getVisibleSocialCourseBadges,
} from './layout/socialBadgeFlow';

export type RenderSocialCourseBadgesOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  system: SocialDesignSystem;
};

export function renderSocialCourseBadges({
  creative,
  slot,
  system,
}: RenderSocialCourseBadgesOptions): string {
  if (!creative.enabledComponents.includes('courseBadges')) {
    return '';
  }

  if (slot.height <= 0 || slot.width <= 0) {
    return '';
  }

  const badges = getVisibleSocialCourseBadges({ creative, system });

  if (badges.length === 0) {
    return '';
  }

  const placements = createSocialBadgePlacements({
    badges,
    slot,
    system,
  });

  if (placements.length === 0) {
    return '';
  }

  const { components, typography, theme } = system;
  const badgeStyle = components.badge;
  const rendered = placements.map((placement) => {
    const tone =
      theme.badgeTones[placement.badge.tone ?? 'primary'] ??
      theme.badgeTones.primary;
    const result = renderSvgBadge({
      x: placement.x,
      y: placement.y,
      text: placement.badge.resolvedLabel,
      fontFamily: typography.fontFamily,
      fontSize: badgeStyle.fontSize,
      fontWeight: badgeStyle.fontWeight,
      letterSpacing: typography.caption.letterSpacing,
      paddingX: badgeStyle.paddingX,
      paddingY: badgeStyle.paddingY,
      radius: badgeStyle.radius,
      height: placement.height,
      fill: tone.fill,
      color: tone.color,
      borderColor: tone.borderColor,
      borderWidth: tone.borderColor ? badgeStyle.borderWidth : undefined,
      maxWidth: placement.width,
      dataComponent: 'social-course-badge',
    });

    return result.svg;
  });

  return `
    <g data-component="social-course-badges">
      ${rendered.join('')}
    </g>
  `;
}
