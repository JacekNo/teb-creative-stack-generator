import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { escapeXml } from './svgUtils';

type FlexibleLogoLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  paddingX?: number;
  paddingY?: number;
};

export function renderBrandAnchor(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const row = layout.actionRow;

  const logo = row.logo as FlexibleLogoLayout;
  const logoPath = creative.logoPath || '/creative-stack/logos/teb-edukacja.svg';

  const logoPaddingX = logo.paddingX ?? 18;
  const logoPaddingY = logo.paddingY ?? 10;

  return `
    <g id="brand-anchor-${format.id}">
      <rect
        x="${logo.x}"
        y="${logo.y}"
        width="${logo.width}"
        height="${logo.height}"
        rx="${Math.min(16, logo.height / 2)}"
        fill="#0941A1"
      />

      <rect
        x="${logo.x + 2}"
        y="${logo.y + 2}"
        width="${logo.width - 4}"
        height="${Math.round(logo.height * 0.36)}"
        rx="${Math.min(14, logo.height / 2)}"
        fill="#ffffff"
        opacity="0.08"
      />

      <image
        href="${escapeXml(logoPath)}"
        x="${logo.x + logoPaddingX}"
        y="${logo.y + logoPaddingY}"
        width="${logo.width - logoPaddingX * 2}"
        height="${logo.height - logoPaddingY * 2}"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  `;
}