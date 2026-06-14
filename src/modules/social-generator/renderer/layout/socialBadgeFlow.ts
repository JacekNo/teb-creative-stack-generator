import type { SocialDesignSystem } from '../../design-system/createSocialDesignSystem';
import type {
  SocialCourseBadge,
  SocialCreativeData,
  SocialLayoutSlot,
  TextFallbackValue,
} from '../../types/social.types';

export type ResolvedSocialCourseBadge = SocialCourseBadge & {
  resolvedLabel: string;
};

export type SocialBadgePlacement = {
  badge: ResolvedSocialCourseBadge;
  x: number;
  y: number;
  width: number;
  height: number;
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

export function getVisibleSocialCourseBadges({
  creative,
  system,
}: {
  creative: SocialCreativeData;
  system: SocialDesignSystem;
}): ResolvedSocialCourseBadge[] {
  if (!creative.enabledComponents.includes('courseBadges')) {
    return [];
  }

  return (creative.courseBadges ?? [])
    .map((badge): ResolvedSocialCourseBadge => ({
      ...badge,
      resolvedLabel: getTextValue(badge.label),
    }))
    .filter((badge) => badge.resolvedLabel)
    .slice(0, system.components.badge.maxItems);
}

export function measureSocialBadgeWidth({
  label,
  system,
  maxWidth,
}: {
  label: string;
  system: SocialDesignSystem;
  maxWidth: number;
}): number {
  const badgeStyle = system.components.badge;
  const naturalWidth =
    label.length * badgeStyle.fontSize * badgeStyle.textWidthRatio +
    badgeStyle.paddingX * 2;

  return Math.min(naturalWidth, maxWidth);
}

export function getSocialBadgeFlowHeight({
  badges,
  system,
  width,
}: {
  badges: ResolvedSocialCourseBadge[];
  system: SocialDesignSystem;
  width: number;
}): number {
  if (badges.length === 0 || width <= 0) {
    return 0;
  }

  const badgeStyle = system.components.badge;
  let rows = 1;
  let cursorX = 0;

  for (const badge of badges) {
    const badgeWidth = measureSocialBadgeWidth({
      label: badge.resolvedLabel,
      system,
      maxWidth: width,
    });

    if (cursorX > 0 && cursorX + badgeWidth > width) {
      rows += 1;
      cursorX = 0;
    }

    cursorX += badgeWidth + badgeStyle.gap;
  }

  return rows * badgeStyle.height + Math.max(0, rows - 1) * badgeStyle.rowGap;
}

export function createSocialBadgePlacements({
  badges,
  slot,
  system,
}: {
  badges: ResolvedSocialCourseBadge[];
  slot: SocialLayoutSlot;
  system: SocialDesignSystem;
}): SocialBadgePlacement[] {
  if (badges.length === 0 || slot.width <= 0 || slot.height <= 0) {
    return [];
  }

  const badgeStyle = system.components.badge;
  const maxX = slot.x + slot.width;
  const maxY = slot.y + slot.height;
  let cursorX = slot.x;
  let cursorY = slot.y;

  const placements: SocialBadgePlacement[] = [];

  for (const badge of badges) {
    const width = measureSocialBadgeWidth({
      label: badge.resolvedLabel,
      system,
      maxWidth: slot.width,
    });

    if (cursorX > slot.x && cursorX + width > maxX) {
      cursorX = slot.x;
      cursorY += badgeStyle.height + badgeStyle.rowGap;
    }

    if (cursorY + badgeStyle.height > maxY) {
      continue;
    }

    placements.push({
      badge,
      x: cursorX,
      y: cursorY,
      width,
      height: badgeStyle.height,
    });

    cursorX += width + badgeStyle.gap;
  }

  return placements;
}
