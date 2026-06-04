import { resolveLocalCtaVariant } from "./localCtaVariant";
import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";
import { getGoogleAdsLayout } from "./googleAdsLayouts";
import { estimateTextWidth, fitSingleLineText } from "./textFit";
import { escapeXml } from "./svgUtils";

type FlexibleCtaLayout = {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  paddingX?: number;
  fontSize: number;
};

type FlexibleCityLayout = {
  minWidth: number;
  maxWidth: number;
  paddingX?: number;
  fontSize: number;
};

type FlexibleLogoLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  paddingX?: number;
  paddingY?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function renderLocalCta(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const row = layout.actionRow;

  const cta = row.cta as FlexibleCtaLayout;
  const city = row.city as FlexibleCityLayout;
  const logo = row.logo as FlexibleLogoLayout;

  const colors = creative.colors as {
    soft?: string;
    primary?: string;
    text?: string;
  };

  /**
   * CTA jest stałą akcją layoutu.
   * Miasto jest dynamicznym kontekstem lokalizacyjnym.
   */
  const ctaText = "rozpocznij naukę";
  const cityText = creative.cityDisplay;
  const localCtaDecision = resolveLocalCtaVariant(cityText, format);

  const ctaX = row.x;

  const ctaPaddingX = cta.paddingX ?? 24;
  const ctaMinWidth = cta.minWidth ?? cta.width ?? 120;
  const ctaMaxWidth = cta.maxWidth ?? cta.width ?? 340;

  const ctaTextWidth = estimateTextWidth(ctaText, cta.fontSize, 0.56);

  const ctaWidth = clamp(
    Math.ceil(ctaTextWidth + ctaPaddingX * 2),
    ctaMinWidth,
    ctaMaxWidth,
  );

  /**
   * LocalCTA: CTA + miasto jako jedna lewa grupa.
   * Logo zostaje osobnym BrandAnchor po prawej.
   */
  const cityX = ctaX + ctaWidth + row.gap;

  const cityPaddingX = city.paddingX ?? 20;

  const maxCityWidthBeforeLogo = Math.max(
    city.minWidth,
    logo.x - cityX - row.gap,
  );

  const safeCityMaxWidth = Math.min(city.maxWidth, maxCityWidthBeforeLogo);

  const cityVisualFontSize = Math.round(city.fontSize * 0.9);

  const cityFit = fitSingleLineText({
    text: cityText,
    maxWidth: safeCityMaxWidth - cityPaddingX * 2,
    maxFontSize: cityVisualFontSize,
    minFontSize: 13,
    averageCharWidthRatio: 0.54,
  });

  const cityWidth = clamp(
    Math.ceil(cityFit.width + cityPaddingX * 2),
    city.minWidth,
    safeCityMaxWidth,
  );

  const ctaRadius = row.height / 2;
  const ctaCenterY = row.y + row.height / 2;

  /**
   * Miasto nie jest drugim CTA.
   * Dlatego jego apla jest niższa, spokojniejsza i bardziej etykietowa.
   */
  const cityHeight = Math.round(row.height * 0.72);
  const cityY = row.y + (row.height - cityHeight) / 2;
  const cityRadius = cityHeight / 2;
  const cityCenterY = cityY + cityHeight / 2;

  const cityFill = colors.soft ?? "#FFF7EF";

  return `
    <g
      id="local-cta-${format.id}"
      data-variant="${localCtaDecision.variant}"
      data-recommended-variant="${localCtaDecision.recommendedVariant}"
    >
      <rect
        x="${ctaX}"
        y="${row.y}"
        width="${ctaWidth}"
        height="${row.height}"
        rx="${ctaRadius}"
        fill="#0941A1"
      />

      <rect
        x="${ctaX + 2}"
        y="${row.y + 2}"
        width="${ctaWidth - 4}"
        height="${Math.round(row.height * 0.42)}"
        rx="${Math.max(8, ctaRadius - 2)}"
        fill="#ffffff"
        opacity="0.10"
      />

      <text
        x="${ctaX + ctaWidth / 2}"
        y="${ctaCenterY}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${cta.fontSize}"
        font-weight="900"
        fill="#ffffff"
        letter-spacing="-0.4"
      >${escapeXml(ctaText)}</text>

      <rect
        x="${cityX}"
        y="${cityY}"
        width="${cityWidth}"
        height="${cityHeight}"
        rx="${cityRadius}"
        fill="${cityFill}"
        stroke="#0941A1"
        stroke-opacity="0.10"
        stroke-width="1"
      />

      <text
        x="${cityX + cityWidth / 2}"
        y="${cityCenterY}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${cityFit.fontSize}"
        font-weight="800"
        fill="#0941A1"
        letter-spacing="-0.2"
      >${escapeXml(cityFit.text)}</text>
    </g>
  `;
}
