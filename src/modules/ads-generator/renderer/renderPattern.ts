import type { GoogleAdsFormat } from "./googleAdsFormats";
import type { PatternLayout } from "./googleAdsLayouts";
import patternArrowRaw from "./assets/patternArrow.svg?raw";

const ARROW_VIEWBOX_WIDTH = 82;
const ARROW_VIEWBOX_HEIGHT = 72;

function extractSvgInner(svgRaw: string): string {
  const cleaned = svgRaw
    .replace(/<\?xml.*?\?>/g, "")
    .replace(/<!DOCTYPE.*?>/g, "")
    .trim();

  const match = cleaned.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);

  return match ? match[1].trim() : cleaned;
}

export function renderPattern(
  pattern: PatternLayout,
  format: GoogleAdsFormat,
): string {
  const arrowInner = extractSvgInner(patternArrowRaw);

  const availableWidth =
    format.width - pattern.insetX * 2 - pattern.gap * (pattern.columns - 1);

  const arrowWidth = availableWidth / pattern.columns;
  const scale = arrowWidth / ARROW_VIEWBOX_WIDTH;

  const arrowHeight = ARROW_VIEWBOX_HEIGHT * scale;
  const stepX = arrowWidth + pattern.gap;
  const stepY = arrowHeight + pattern.rowGap;

  const rows = Math.ceil((format.height - pattern.insetY * 2) / stepY) + 1;
  const rotate = pattern.rotate ?? 0;

  const items: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    const offsetX = pattern.stagger && row % 2 === 1 ? stepX / 2 : 0;

    for (let column = -1; column < pattern.columns + 1; column += 1) {
      const x = pattern.insetX + column * stepX + offsetX;
      const y = pattern.insetY + row * stepY;

      items.push(`
        <g
          opacity="${pattern.opacity}"
          transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"
        >
          ${arrowInner}
        </g>
      `);
    }
  }

  return `
    <g color="${pattern.color}" aria-hidden="true">
      ${items.join("")}
    </g>
  `;
}