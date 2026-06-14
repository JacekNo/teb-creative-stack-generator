import { renderSvgTextBlock } from '../../creative-stack/svg-components/renderSvgTextBlock';
import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCourseFact,
  SocialCourseFactIcon,
  SocialCreativeData,
  SocialLayoutSlot,
  TextFallbackValue,
} from '../types/social.types';

export type RenderSocialCourseFactsOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  system: SocialDesignSystem;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
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

function renderIconPath(icon: SocialCourseFactIcon | undefined): string {
  if (icon === 'calendar') {
    return `
      <path d="M8 9h24" />
      <path d="M12 5v8" />
      <path d="M28 5v8" />
      <rect x="7" y="8" width="26" height="25" rx="4" />
    `;
  }

  if (icon === 'online') {
    return `
      <rect x="7" y="10" width="26" height="17" rx="3" />
      <path d="M14 32h12" />
      <path d="M20 27v5" />
    `;
  }

  if (icon === 'certificate') {
    return `
      <path d="M11 8h18v24H11z" />
      <path d="M15 14h10" />
      <path d="M15 20h8" />
      <path d="M18 32l2-4 2 4" />
    `;
  }

  if (icon === 'info') {
    return `
      <circle cx="20" cy="20" r="13" />
      <path d="M20 18v9" />
      <path d="M20 13h.01" />
    `;
  }

  return `
    <circle cx="20" cy="20" r="13" />
    <path d="M20 11v10l7 4" />
  `;
}

function renderFactIcon({
  x,
  y,
  size,
  radius,
  fill,
  stroke,
  icon,
}: {
  x: number;
  y: number;
  size: number;
  radius: number;
  fill: string;
  stroke: string;
  icon?: SocialCourseFactIcon;
}): string {
  return `
    <g data-component="social-course-fact-icon">
      <rect
        x="${x}"
        y="${y}"
        width="${size}"
        height="${size}"
        rx="${radius}"
        fill="${fill}"
      />
      <g
        transform="translate(${x + size * 0.18} ${y + size * 0.18}) scale(${size / 40 * 0.64})"
        fill="none"
        stroke="${stroke}"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${renderIconPath(icon)}
      </g>
    </g>
  `;
}

function renderFact({
  fact,
  x,
  y,
  width,
  height,
  system,
}: {
  fact: SocialCourseFact;
  x: number;
  y: number;
  width: number;
  height: number;
  system: SocialDesignSystem;
}): string {
  const { components, spacing, typography, theme, radius } = system;

  const value = getTextValue(fact.value);
  const label = getTextValue(fact.label);

  if (!value) {
    return '';
  }

  const iconSize = Math.min(height, spacing[16]);
  const contentX = x + iconSize + spacing[4];
  const contentWidth = Math.max(0, width - iconSize - spacing[4]);
  const valueFontSize = components.infoGrid.valueFontSize;
  const labelFontSize = components.infoGrid.labelFontSize;
  const valueY = y + Math.max(0, (height - (valueFontSize + labelFontSize + spacing[1])) / 2) + valueFontSize;
  const labelY = valueY + labelFontSize + spacing[2];

  return `
    <g data-component="social-course-fact" data-fact-id="${escapeXml(fact.id)}">
      ${renderFactIcon({
        x,
        y: y + Math.max(0, (height - iconSize) / 2),
        size: iconSize,
        radius: radius.md,
        fill: theme.surfaceSoft,
        stroke: theme.textPrimary,
        icon: fact.icon,
      })}
      ${renderSvgTextBlock({
        x: contentX,
        y: valueY,
        width: contentWidth,
        text: value,
        fontFamily: typography.fontFamily,
        fontSize: valueFontSize,
        fontWeight: 800,
        lineHeight: typography.meta.lineHeightRatio,
        letterSpacing: typography.meta.letterSpacing,
        fill: theme.textPrimary,
        maxLines: 1,
        dataComponent: 'social-course-fact-value',
      }).svg}
      ${label
        ? renderSvgTextBlock({
            x: contentX,
            y: labelY,
            width: contentWidth,
            text: label,
            fontFamily: typography.fontFamily,
            fontSize: labelFontSize,
            fontWeight: 600,
            lineHeight: typography.micro.lineHeightRatio,
            letterSpacing: typography.micro.letterSpacing,
            fill: theme.textSecondary,
            maxLines: 1,
            dataComponent: 'social-course-fact-label',
          }).svg
        : ''}
    </g>
  `;
}

export function renderSocialCourseFacts({
  creative,
  slot,
  system,
}: RenderSocialCourseFactsOptions): string {
  if (!creative.enabledComponents.includes('courseFacts')) {
    return '';
  }

  const facts = (creative.courseFacts ?? []).slice(0, 4);

  if (facts.length === 0) {
    return '';
  }

  const { components } = system;
  const gap = components.infoGrid.gap;
  const columns = facts.length === 1 ? 1 : 2;
  const rows = Math.ceil(facts.length / columns);
  const itemWidth = (slot.width - gap * (columns - 1)) / columns;
  const itemHeight = (slot.height - gap * (rows - 1)) / rows;

  return `
    <g data-component="social-course-facts">
      ${facts
        .map((fact, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);

          return renderFact({
            fact,
            x: slot.x + column * (itemWidth + gap),
            y: slot.y + row * (itemHeight + gap),
            width: itemWidth,
            height: itemHeight,
            system,
          });
        })
        .join('')}
    </g>
  `;
}
