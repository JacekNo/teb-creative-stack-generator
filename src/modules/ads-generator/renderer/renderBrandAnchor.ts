import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { escapeXml } from './svgUtils';

type FlexibleLogoLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function renderBrandAnchor(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const row = layout.actionRow;

  const logo = row.logo as FlexibleLogoLayout;
  const logoPath = creative.logoPath || '/creative-stack/logos/teb-edukacja.svg';

  return `
    <g id="brand-anchor-${format.id}">
      <image
        href="${escapeXml(logoPath)}"
        x="${logo.x}"
        y="${logo.y}"
        width="${logo.width}"
        height="${logo.height}"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  `;
}