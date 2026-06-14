import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';

export type RenderSocialCityOptions = {
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

function estimateTextWidth(
  text: string,
  fontSize: number,
  textWidthRatio: number,
): number {
  return text.length * fontSize * textWidthRatio;
}

function renderCityShadowFilter({
  id,
  color,
  dx,
  dy,
  blur,
  opacity,
}: {
  id: string;
  color: string;
  dx: number;
  dy: number;
  blur: number;
  opacity: number;
}): string {
  if (opacity <= 0 || blur <= 0) {
    return '';
  }

  return `
    <defs>
      <filter
        id="${id}"
        x="-20%"
        y="-50%"
        width="140%"
        height="220%"
        color-interpolation-filters="sRGB"
      >
        <feDropShadow
          dx="${dx}"
          dy="${dy}"
          stdDeviation="${blur / 2}"
          flood-color="${color}"
          flood-opacity="${opacity}"
        />
      </filter>
    </defs>
  `;
}

export function renderSocialCity({
  creative,
  slot,
  system,
}: RenderSocialCityOptions): string {
  if (!creative.enabledComponents.includes('city')) {
    return '';
  }

  if (creative.offerMode === 'online') {
    return '';
  }

  if (!creative.cityName) {
    return '';
  }

  const style = system.components.cityBadge;
  const tone = system.theme.cityBadge;
  const textWidth = estimateTextWidth(
    creative.cityName,
    style.fontSize,
    style.textWidthRatio,
  );
  const iconWidth = style.showIcon ? style.iconSize + style.iconGap : 0;
  const badgeWidth = Math.min(
    slot.width,
    Math.ceil(style.paddingX * 2 + iconWidth + textWidth),
  );
  const x =
    style.align === 'right'
      ? slot.x + Math.max(0, slot.width - badgeWidth)
      : slot.x;
  const y = slot.y;
  const iconX = x + style.paddingX + style.iconSize / 2;
  const iconY = y + style.height / 2;
  const textX =
    x +
    style.paddingX +
    (style.showIcon ? style.iconSize + style.iconGap : 0);
  const textY =
    y + style.height / 2 + style.fontSize * style.textBaselineOffsetRatio;
  const filterId = `social-city-shadow-${creative.courseId}`;

  return `
    <g data-component="social-city">
      ${renderCityShadowFilter({
        id: filterId,
        color: tone.shadowColor,
        dx: style.shadowDx,
        dy: style.shadowDy,
        blur: style.shadowBlur,
        opacity: style.shadowOpacity,
      })}
      <rect
        x="${x}"
        y="${y}"
        width="${badgeWidth}"
        height="${style.height}"
        rx="${style.radius}"
        fill="${tone.fill}"
        stroke="${tone.borderColor}"
        stroke-width="${style.borderWidth}"
        ${style.shadowOpacity > 0 ? `filter="url(#${filterId})"` : ''}
      />
      ${
        style.showIcon
          ? `
            <circle
              cx="${iconX}"
              cy="${iconY}"
              r="${style.iconSize / 2}"
              fill="${tone.iconColor}"
            />
          `
          : ''
      }
      <text
        x="${textX}"
        y="${textY}"
        font-family="${escapeXml(system.typography.fontFamily)}"
        font-size="${style.fontSize}"
        font-weight="${style.fontWeight}"
        letter-spacing="${style.letterSpacing}"
        fill="${tone.color}"
      >${escapeXml(creative.cityName)}</text>
    </g>
  `;
}
