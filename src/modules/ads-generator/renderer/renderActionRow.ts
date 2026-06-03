import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { fitSingleLineText } from './textFit';
import { escapeXml } from './svgUtils';

export function renderActionRow(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const row = layout.actionRow;

  const logoPath = creative.logoPath || '/creative-stack/logos/teb-edukacja.svg';

  const ctaText = 'rozpocznij naukę';
  const cityText = creative.cityDisplay;

  const cityFit = fitSingleLineText({
    text: cityText,
    maxWidth: row.city.maxWidth - 42,
    maxFontSize: row.city.fontSize,
    minFontSize: 13,
    averageCharWidthRatio: 0.53,
  });

  const cityWidth = Math.min(
    row.city.maxWidth,
    Math.max(row.city.minWidth, cityFit.width + 42),
  );

  const ctaX = row.x;
  const cityX = ctaX + row.cta.width + row.gap;
  const logoX = cityX + cityWidth + row.gap;

  const radius = row.height / 2;

  return `
    <g id="action-row-${format.id}">
      <rect
        x="${ctaX}"
        y="${row.y}"
        width="${row.cta.width}"
        height="${row.height}"
        rx="${radius}"
        fill="#0941A1"
      />

      <text
        x="${ctaX + row.cta.width / 2}"
        y="${row.y + row.height / 2 + row.cta.fontSize * 0.34}"
        text-anchor="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${row.cta.fontSize}"
        font-weight="900"
        fill="#ffffff"
        letter-spacing="-0.4"
      >${escapeXml(ctaText)}</text>

      <rect
        x="${cityX}"
        y="${row.y}"
        width="${cityWidth}"
        height="${row.height}"
        rx="${radius}"
        fill="#ffffff"
        opacity="0.96"
      />

      <text
        x="${cityX + cityWidth / 2}"
        y="${row.y + row.height / 2 + row.city.fontSize * 0.34}"
        text-anchor="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${cityFit.fontSize}"
        font-weight="800"
        fill="#0941A1"
        letter-spacing="-0.2"
      >${escapeXml(cityFit.text)}</text>

      <rect
        x="${logoX}"
        y="${row.y}"
        width="${row.logo.width}"
        height="${row.logo.height}"
        rx="${Math.min(16, radius)}"
        fill="#0941A1"
      />

      <image
        href="${logoPath}"
        x="${logoX + 18}"
        y="${row.y + 10}"
        width="${row.logo.width - 36}"
        height="${row.logo.height - 20}"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  `;
}