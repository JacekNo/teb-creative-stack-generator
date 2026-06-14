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

type BadgeToneKey = keyof SocialDesignSystem['theme']['badgeTones'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

function estimateBadgeWidth(
  label: string,
  fontSize: number,
  paddingX: number,
  textWidthRatio: number,
): number {
  return Math.ceil(label.length * fontSize * textWidthRatio + paddingX * 2);
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

  const { components } = system;
  const badgeStyle = components.badge;

  const badges = (creative.courseBadges ?? [])
    .map((badge): SocialCourseBadge & { resolvedLabel: string } => ({
      ...badge,
      resolvedLabel: getTextValue(badge.label),
    }))
    .filter((badge) => badge.resolvedLabel)
    .slice(0, badgeStyle.maxItems);

  if (badges.length === 0) {
    return '';
  }

  const maxX = slot.x + slot.width;
  const maxY = slot.y + slot.height;
  let cursorX = slot.x;
  let cursorY = slot.y;

  const rendered = badges.map((badge) => {
    const toneKey = resolveToneKey(badge.tone, system);
    const naturalWidth = estimateBadgeWidth(
      badge.resolvedLabel,
      badgeStyle.fontSize,
      badgeStyle.paddingX,
      badgeStyle.textWidthRatio,
    );
    const width = Math.min(naturalWidth, slot.width);

    if (cursorX > slot.x && cursorX + width > maxX) {
      cursorX = slot.x;
      cursorY += badgeStyle.height + badgeStyle.rowGap;
    }

    if (cursorY + badgeStyle.height > maxY) {
      return '';
    }

    const svg = renderBadge({
      label: badge.resolvedLabel,
      x: cursorX,
      y: cursorY,
      width,
      system,
      toneKey,
    });

    cursorX += width + badgeStyle.columnGap;
    return svg;
  });

  return `
    <g data-component="social-course-badges">
      ${rendered.join('')}
    </g>
  `;
}
