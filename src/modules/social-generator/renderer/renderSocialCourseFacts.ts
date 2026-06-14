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
  styles?: unknown;
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
  system,
}: {
  fact: SocialCourseFact;
  x: number;
  y: number;
  width: number;
  system: SocialDesignSystem;
}): string {
  const { components, typography, theme } = system;
  const factStyle = components.factStack;
  const value = getTextValue(fact.value);
  const label = getTextValue(fact.label);

  if (!value) {
    return '';
  }

  const iconSize = factStyle.iconSize;
  const contentX = x + iconSize + factStyle.iconTextGap;
  const contentWidth = Math.max(0, width - iconSize - factStyle.iconTextGap);
  const textBlockHeight =
    factStyle.valueLineHeight +
    (label ? factStyle.valueLabelGap + factStyle.labelLineHeight : 0);
  const textY = y + Math.max(0, (factStyle.itemHeight - textBlockHeight) / 2);
  const valueY = textY + factStyle.valueFontSize;
  const labelY = valueY + factStyle.valueLabelGap + factStyle.labelFontSize;

  return `
    <g data-component="social-course-fact" data-fact-id="${escapeXml(fact.id)}">
      ${renderFactIcon({
        x,
        y: y + Math.max(0, (factStyle.itemHeight - iconSize) / 2),
        size: iconSize,
        radius: factStyle.iconRadius,
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
        fontSize: factStyle.valueFontSize,
        fontWeight: factStyle.valueFontWeight,
        lineHeight: factStyle.valueLineHeightRatio,
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
            fontSize: factStyle.labelFontSize,
            fontWeight: factStyle.labelFontWeight,
            lineHeight: factStyle.labelLineHeightRatio,
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

  if (slot.height <= 0 || slot.width <= 0) {
    return '';
  }

  const facts = (creative.courseFacts ?? [])
    .filter((fact) => Boolean(getTextValue(fact.value)))
    .slice(0, system.components.factStack.maxItems);

  if (facts.length === 0) {
    return '';
  }

  const factStyle = system.components.factStack;

  return `
    <g data-component="social-course-facts">
      ${facts
        .map((fact, index) => renderFact({
          fact,
          x: slot.x,
          y: slot.y + index * (factStyle.itemHeight + factStyle.gap),
          width: slot.width,
          system,
        }))
        .join('')}
    </g>
  `;
}
