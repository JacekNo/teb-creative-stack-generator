import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import patternArrowRaw from '../../ads-generator/renderer/assets/patternArrow.svg?raw';

export type RenderSocialBackgroundOptions = {
  system: SocialDesignSystem;
};

const ARROW_VIEWBOX_WIDTH = 82;
const ARROW_VIEWBOX_HEIGHT = 72;

function extractSvgInner(svgRaw: string): string {
  const cleaned = svgRaw
    .replace(/<\?xml.*?\?>/g, '')
    .replace(/<!DOCTYPE.*?>/g, '')
    .trim();

  const match = cleaned.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);

  return match ? match[1].trim() : cleaned;
}

function renderPattern(system: SocialDesignSystem): string {
  const pattern = system.components.background;
  const arrowInner = extractSvgInner(patternArrowRaw);
  const availableWidth =
    system.format.width -
    pattern.patternInsetX * 2 -
    pattern.patternGap * (pattern.patternColumns - 1);

  const arrowWidth = availableWidth / pattern.patternColumns;
  const scale = arrowWidth / ARROW_VIEWBOX_WIDTH;
  const arrowHeight = ARROW_VIEWBOX_HEIGHT * scale;
  const stepX = arrowWidth + pattern.patternGap;
  const stepY = arrowHeight + pattern.patternRowGap;
  const rows =
    Math.ceil((system.format.height - pattern.patternInsetY * 2) / stepY) + 1;
  const items: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    const offsetX =
      pattern.patternStagger && row % 2 === 1 ? stepX / 2 : 0;

    for (
      let column = -1;
      column < pattern.patternColumns + 1;
      column += 1
    ) {
      const x = pattern.patternInsetX + column * stepX + offsetX;
      const y = pattern.patternInsetY + row * stepY;

      items.push(`
        <g
          opacity="${pattern.patternOpacity}"
          transform="translate(${x} ${y}) rotate(${pattern.patternRotate}) scale(${scale})"
        >
          ${arrowInner}
        </g>
      `);
    }
  }

  return `
    <g
      data-component="social-background-pattern"
      color="${pattern.patternColor}"
      aria-hidden="true"
    >
      ${items.join('')}
    </g>
  `;
}

export function renderSocialBackground({
  system,
}: RenderSocialBackgroundOptions): string {
  return `
    <g data-component="social-background">
      <rect
        x="0"
        y="0"
        width="${system.format.width}"
        height="${system.format.height}"
        fill="${system.theme.background}"
      />

      ${renderPattern(system)}
    </g>
  `;
}
