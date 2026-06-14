import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCourseBadgeTone,
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

type BadgeToneKey = keyof SocialDesignSystem['theme']['badgeTones'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveToneKey(
  tone: SocialCourseBadgeTone | undefined,
  system: SocialDesignSystem,
): BadgeToneKey {
  if (tone === 'online') {
    return 'online';
  }

  const candidate = (tone ?? 'primary') as BadgeToneKey;

  if (candidate in system.theme.badgeTones) {
    return candidate;
  }

  return 'primary';
}

function renderBadge({
  label,
  x,
  y,
  width,
  system,
  toneKey,
}: {
  label: string;
  x: number;
  y: number;
  width: number;
  system: SocialDesignSystem;
  toneKey: BadgeToneKey;
}): string {
  const { components, typography } = system;
  const badgeStyle = components.badge;
  const tone = system.theme.badgeTones[toneKey] ?? system.theme.badgeTones.primary;

  const height = badgeStyle.height;
  const borderWidth = tone.borderWidth ?? badgeStyle.borderWidth ?? 0;
  const textX = x + badgeStyle.paddingX;
  const textY = y + height / 2;

  return `
    <g data-component="social-course-badge" data-tone="${escapeXml(String(toneKey))}">
      <rect
        x="${x}"
        y="${y}"
        width="${width}"
        height="${height}"
        rx="${badgeStyle.radius}"
        fill="${tone.fill}"
        stroke="${tone.borderColor}"
        stroke-width="${borderWidth}"
      />
      <text
        x="${textX}"
        y="${textY}"
        font-family="${typography.fontFamily}"
        font-size="${badgeStyle.fontSize}"
        font-weight="${badgeStyle.fontWeight}"
        letter-spacing="${badgeStyle.letterSpacing ?? 0}"
        fill="${tone.color}"
        dominant-baseline="central"
      >${escapeXml(label)}</text>
    </g>
  `;
}

export function renderSocialCourseBadges({
  creative,
  slot,
  system,
}: RenderSocialCourseBadgesOptions): string {
  if (!creative.enabledComponents.includes('courseBadges')) {
    return '';
  }

  const badges = getVisibleSocialCourseBadges({ creative, system });

  if (badges.length === 0) {
    return '';
  }

  const rendered = createSocialBadgePlacements({ badges, slot, system })
    .map((placement) => renderBadge({
      label: placement.badge.resolvedLabel,
      x: placement.x,
      y: placement.y,
      width: placement.width,
      system,
      toneKey: resolveToneKey(placement.badge.tone, system),
    }));

  return `
    <g data-component="social-course-badges">
      ${rendered.join('')}
    </g>
  `;
}
