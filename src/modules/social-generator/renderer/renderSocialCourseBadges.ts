import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCourseBadge,
  SocialCourseBadgeTone,
  SocialCreativeData,
  SocialLayoutSlot,
  TextFallbackValue,
} from '../types/social.types';

export type RenderSocialCourseBadgesOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  system: SocialDesignSystem;
};

function isTextFallbackValue(value: unknown): value is TextFallbackValue {
  return typeof value === 'object' && value !== null && 'full' in value;
}

function getTextValue(value: string | TextFallbackValue | undefined): string {
  if (!value) {
    return '';
  }

  if (isTextFallbackValue(value)) {
    return value.short ?? value.compact ?? value.full;
  }

  return value;
}

function getBadgeColors(
  tone: SocialCourseBadgeTone | undefined,
  system: SocialDesignSystem,
): { fill: string; color: string; borderColor?: string; borderWidth?: number } {
  const { theme } = system;

  if (tone === 'green') {
    return {
      fill: theme.badgeGreenBackground,
      color: theme.badgeGreenText,
    };
  }

  if (tone === 'yellow') {
    return {
      fill: theme.badgeYellowBackground,
      color: theme.badgeYellowText,
    };
  }

  if (tone === 'online') {
    return {
      fill: theme.badgeOnlineBackground,
      color: theme.badgeOnlineText,
    };
  }

  if (tone === 'popular') {
    return {
      fill: theme.badgePopularBackground,
      color: theme.badgePopularText,
    };
  }

  if (tone === 'light') {
    return {
      fill: theme.badgeLightBackground,
      color: theme.badgeLightText,
      borderColor: theme.borderSubtle,
      borderWidth: 1,
    };
  }

  if (tone === 'soft') {
    return {
      fill: theme.badgeSoftBackground,
      color: theme.badgeSoftText,
    };
  }

  if (tone === 'blue') {
    return {
      fill: system.helper.dark,
      color: system.helper.white,
    };
  }

  return {
    fill: theme.badgePrimaryBackground,
    color: theme.badgePrimaryText,
  };
}

function estimateBadgeWidth(label: string, fontSize: number, paddingX: number): number {
  return label.length * fontSize * 0.56 + paddingX * 2;
}

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

  const badges = (creative.courseBadges ?? [])
    .map((badge): SocialCourseBadge & { resolvedLabel: string } => ({
      ...badge,
      resolvedLabel: getTextValue(badge.label),
    }))
    .filter((badge) => badge.resolvedLabel)
    .slice(0, 5);

  if (badges.length === 0) {
    return '';
  }

  const { components, typography } = system;
  const badgeStyle = components.badge;
  const gap = badgeStyle.gap;
  const lineGap = Math.max(0, system.spacing[2]);
  const maxX = slot.x + slot.width;
  const maxY = slot.y + slot.height;
  let cursorX = slot.x;
  let cursorY = slot.y;

  const rendered = badges.map((badge) => {
    const naturalWidth = estimateBadgeWidth(
      badge.resolvedLabel,
      badgeStyle.fontSize,
      badgeStyle.paddingX,
    );
    const width = Math.min(naturalWidth, slot.width);

    if (cursorX > slot.x && cursorX + width > maxX) {
      cursorX = slot.x;
      cursorY += badgeStyle.height + lineGap;
    }

    if (cursorY + badgeStyle.height > maxY) {
      return '';
    }

    const colors = getBadgeColors(badge.tone, system);
    const remainingWidth = Math.max(0, maxX - cursorX);
    const result = renderSvgBadge({
      x: cursorX,
      y: cursorY,
      text: badge.resolvedLabel,
      fontFamily: typography.fontFamily,
      fontSize: badgeStyle.fontSize,
      fontWeight: badgeStyle.fontWeight,
      letterSpacing: typography.caption.letterSpacing,
      paddingX: badgeStyle.paddingX,
      paddingY: badgeStyle.paddingY,
      radius: badgeStyle.radius,
      fill: colors.fill,
      color: colors.color,
      borderColor: colors.borderColor,
      borderWidth: colors.borderWidth,
      maxWidth: remainingWidth,
      dataComponent: 'social-course-badge',
    });

    cursorX += result.width + gap;
    return result.svg;
  });

  return `
    <g data-component="social-course-badges">
      ${rendered.join('')}
    </g>
  `;
}
