import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";
import { getGoogleAdsLayout } from "./googleAdsLayouts";
import { resolveLocalCtaVariant } from "./localCtaVariant";
import { estimateTextWidth, fitSingleLineText } from "./textFit";
import { escapeXml } from "./svgUtils";

const BODY_FONT_FAMILY = "'Roc Grotesk', Arial, sans-serif";
const CTA_TEXT = "rozpocznij naukę";

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
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPillWidth(options: {
  text: string;
  fontSize: number;
  paddingX: number;
  minWidth: number;
  maxWidth: number;
  averageCharWidthRatio?: number;
}): number {
  const textWidth = estimateTextWidth(
    options.text,
    options.fontSize,
    options.averageCharWidthRatio ?? 0.56,
  );

  return clamp(
    Math.ceil(textWidth + options.paddingX * 2),
    options.minWidth,
    options.maxWidth,
  );
}

function renderCtaButton(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
}): string {
  const { x, y, width, height, text, fontSize } = options;
  const radius = height / 2;
  const centerY = y + height / 2;

  return `
    <rect
      x="${x}"
      y="${y}"
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="#0941A1"
    />

    <rect
      x="${x + 2}"
      y="${y + 2}"
      width="${width - 4}"
      height="${Math.round(height * 0.42)}"
      rx="${Math.max(8, radius - 2)}"
      fill="#ffffff"
      opacity="0.10"
    />

    <text
      x="${x + width / 2}"
      y="${centerY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="${BODY_FONT_FAMILY}"
      font-size="${fontSize}"
      font-weight="700"
      fill="#ffffff"
      letter-spacing="-0.4"
    >${escapeXml(text)}</text>
  `;
}

function renderCityPill(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fill: string;
}): string {
  const { x, y, width, height, text, fontSize, fill } = options;
  const radius = height / 2;
  const centerY = y + height / 2;

  return `
    <rect
      x="${x}"
      y="${y}"
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="${fill}"
      stroke="#0941A1"
      stroke-opacity="0.10"
      stroke-width="1"
    />

    <text
      x="${x + width / 2}"
      y="${centerY}"
      text-anchor="middle"
      dominant-baseline="middle"
      font-family="${BODY_FONT_FAMILY}"
      font-size="${fontSize}"
      font-weight="500"
      fill="#0941A1"
      letter-spacing="-0.2"
    >${escapeXml(text)}</text>
  `;
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

  const cityText = creative.cityDisplay;
  const localCtaDecision = resolveLocalCtaVariant(cityText, format);

  const ctaX = row.x;

  const ctaHeight = row.height;
  const cityHeight = Math.round(row.height * 0.72);
  const stackedGapY = Math.max(10, Math.round(row.height * 0.12));

  const localCtaBottomY = logo.y + logo.height;

  const ctaPaddingX = cta.paddingX ?? 24;
  const cityPaddingX = city.paddingX ?? 20;

  const ctaMinWidth = cta.minWidth ?? cta.width ?? 120;
  const ctaMaxWidth = cta.maxWidth ?? cta.width ?? 340;

  const ctaFit = fitSingleLineText({
    text: CTA_TEXT,
    maxWidth: Math.max(40, ctaMaxWidth - ctaPaddingX * 2),
    maxFontSize: cta.fontSize,
    minFontSize: Math.max(24, Math.round(cta.fontSize * 0.82)),
    averageCharWidthRatio: 0.56,
  });

  const ctaWidth = getPillWidth({
    text: ctaFit.text,
    fontSize: ctaFit.fontSize,
    paddingX: ctaPaddingX,
    minWidth: ctaMinWidth,
    maxWidth: ctaMaxWidth,
    averageCharWidthRatio: 0.56,
  });

  const buttonCityX = ctaX + ctaWidth + row.gap;

  const maxCityWidthBeforeLogo = Math.max(
    city.minWidth,
    logo.x - buttonCityX - row.gap,
  );

  const safeCityMaxWidth = Math.min(city.maxWidth, maxCityWidthBeforeLogo);

  const cityRequiredWidth = Math.ceil(
    estimateTextWidth(cityText, city.fontSize, 0.54) + cityPaddingX * 2,
  );

  const resolvedLocalCtaVariant =
    localCtaDecision.variant !== "stacked" &&
    cityRequiredWidth > safeCityMaxWidth
      ? "stacked"
      : localCtaDecision.variant;

  const cityFill = colors.soft ?? "#FFF7EF";

  if (resolvedLocalCtaVariant === "stacked") {
    const cityX = ctaX;
    const cityY = localCtaBottomY - cityHeight;
    const ctaY = cityY - stackedGapY - ctaHeight;

    const availableWidth = Math.max(city.minWidth, logo.x - ctaX - row.gap);

    const cityFit = fitSingleLineText({
      text: cityText,
      maxWidth: Math.max(20, availableWidth - cityPaddingX * 2),
      maxFontSize: city.fontSize,
      minFontSize: Math.max(22, Math.round(city.fontSize * 0.86)),
      averageCharWidthRatio: 0.54,
    });

    const cityWidth = getPillWidth({
      text: cityFit.text,
      fontSize: cityFit.fontSize,
      paddingX: cityPaddingX,
      minWidth: Math.max(city.minWidth, ctaWidth),
      maxWidth: availableWidth,
      averageCharWidthRatio: 0.54,
    });

    return `
      <g
        id="local-cta-${format.id}"
        data-variant="${resolvedLocalCtaVariant}"
        data-recommended-variant="${localCtaDecision.recommendedVariant}"
        data-city-required-width="${cityRequiredWidth}"
        data-city-safe-width="${safeCityMaxWidth}"
      >
        ${renderCtaButton({
          x: ctaX,
          y: ctaY,
          width: ctaWidth,
          height: ctaHeight,
          text: ctaFit.text,
          fontSize: ctaFit.fontSize,
        })}

        ${renderCityPill({
          x: cityX,
          y: cityY,
          width: cityWidth,
          height: cityHeight,
          text: cityFit.text,
          fontSize: cityFit.fontSize,
          fill: cityFill,
        })}
      </g>
    `;
  }

  const cityX = buttonCityX;
  const cityY = localCtaBottomY - cityHeight;

  const cityFit = fitSingleLineText({
    text: cityText,
    maxWidth: Math.max(20, safeCityMaxWidth - cityPaddingX * 2),
    maxFontSize: city.fontSize,
    minFontSize: Math.max(22, Math.round(city.fontSize * 0.86)),
    averageCharWidthRatio: 0.54,
  });

  const cityWidth = getPillWidth({
    text: cityFit.text,
    fontSize: cityFit.fontSize,
    paddingX: cityPaddingX,
    minWidth: city.minWidth,
    maxWidth: safeCityMaxWidth,
    averageCharWidthRatio: 0.54,
  });

  return `
    <g
      id="local-cta-${format.id}"
      data-variant="${resolvedLocalCtaVariant}"
      data-recommended-variant="${localCtaDecision.recommendedVariant}"
      data-city-required-width="${cityRequiredWidth}"
      data-city-safe-width="${safeCityMaxWidth}"
    >
      ${renderCtaButton({
        x: ctaX,
        y: localCtaBottomY - ctaHeight,
        width: ctaWidth,
        height: ctaHeight,
        text: ctaFit.text,
        fontSize: ctaFit.fontSize,
      })}

      ${renderCityPill({
        x: cityX,
        y: cityY,
        width: cityWidth,
        height: cityHeight,
        text: cityFit.text,
        fontSize: cityFit.fontSize,
        fill: cityFill,
      })}
    </g>
  `;
}