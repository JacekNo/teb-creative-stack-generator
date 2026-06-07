import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";
import { getGoogleAdsLayout } from "./googleAdsLayouts";
import { renderActionRow } from "./renderActionRow";
import { renderPattern } from "./renderPattern";
import { renderPhoto, renderPhotoDefs } from "./renderPhoto";
import { renderTitleCard } from "./renderTitleCard";
import { escapeXml } from "./svgUtils";
import { renderSvgFonts } from "./renderSvgFonts";

export function renderAdSvg(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${format.width}"
      height="${format.height}"
      viewBox="0 0 ${format.width} ${format.height}"
      role="img"
      aria-label="${escapeXml(`${creative.title} ${creative.cityDisplay}`)}"
    >
      <defs>
        ${renderSvgFonts()}
        ${renderPhotoDefs(format)}
      </defs>

      <rect
        x="${layout.background.x}"
        y="${layout.background.y}"
        width="${layout.background.width}"
        height="${layout.background.height}"
        fill="${creative.colors.primary}"
      />

      ${renderPattern(layout.pattern, format)}

      ${renderPhoto(creative, format)}

      ${renderTitleCard(creative, format)}

      ${renderActionRow(creative, format)}
    </svg>
  `;
}