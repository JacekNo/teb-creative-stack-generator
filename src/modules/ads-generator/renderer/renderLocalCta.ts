import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { resolveLocalCtaVariant } from './localCtaVariant';
import { estimateTextWidth, fitSingleLineText } from './textFit';
import { escapeXml } from './svgUtils';

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

function getCtaWidth(options: {
  text: string;
  fontSize: number;
  paddingX: number;
  minWidth: number;
  maxWidth: number;
}): number {
  const textWidth = estimateTextWidth(options.text, options.fontSize, 0.56);

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
  radius: number;
  text: string;
  fontSize: number;
  centerY: number;
}): string {
  const { x, y, width, height, radius, text, fontSize, centerY } = options;

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
      font-family="Roc Grotesk, Arial, sans-serif"
      font-size="${fontSize}"
      font-weight="900"
      fill="#ffffff"
      letter-spacing="-0.4"
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

  const ctaText = 'rozpocznij naukę';
  const cityText = creative.cityDisplay;

  const localCtaDecision = resolveLocalCtaVariant(cityText, format);

  const ctaX = row.x;

  const ctaPaddingX = cta.paddingX ?? 24;
  const ctaMinWidth = cta.minWidth ?? cta.width ?? 120;
  const ctaMaxWidth = cta.maxWidth ?? cta.width ?? 340;

  const ctaWidth = getCtaWidth({
    text: ctaText,
    fontSize: cta.fontSize,
    paddingX: ctaPaddingX,
    minWidth: ctaMinWidth,
    maxWidth: ctaMaxWidth,
  });

  if (localCtaDecision.variant === 'stacked') {
    const availableWidth = Math.max(
      city.minWidth,
      logo.x - ctaX - row.gap,
    );

    const ctaHeight = Math.round(row.height * 0.62);
    const ctaRadius = ctaHeight / 2;
    const ctaY = row.y;
    const ctaCenterY = ctaY + ctaHeight / 2;

    const cityGapY = Math.max(6, Math.round(row.height * 0.08));
    const cityFontSize = Math.round(city.fontSize * 0.9);
    const cityY = ctaY + ctaHeight + cityGapY;

    const cityFit = fitSingleLineText({
      text: cityText,
      maxWidth: availableWidth,
      maxFontSize: cityFontSize,
      minFontSize: 18,
      averageCharWidthRatio: 0.54,
    });

    return `
      <g
        id="local-cta-${format.id}"
        data-variant="${localCtaDecision.variant}"
        data-recommended-variant="${localCtaDecision.recommendedVariant}"
      >
        ${renderCtaButton({
          x: ctaX,
          y: ctaY,
          width: ctaWidth,
          height: ctaHeight,
          radius: ctaRadius,
          text: ctaText,
          fontSize: Math.round(cta.fontSize * 0.88),
          centerY: ctaCenterY,
        })}

        <text
          x="${ctaX + 4}"
          y="${cityY + cityFit.fontSize / 2}"
          dominant-baseline="middle"
          font-family="Roc Grotesk, Arial, sans-serif"
          font-size="${cityFit.fontSize}"
          font-weight="850"
          fill="#ffffff"
          opacity="0.96"
          letter-spacing="-0.2"
        >${escapeXml(cityFit.text)}</text>
      </g>
    `;
  }

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

  const cityHeight = Math.round(row.height * 0.72);
  const cityY = row.y + (row.height - cityHeight) / 2;
  const cityRadius = cityHeight / 2;
  const cityCenterY = cityY + cityHeight / 2;

  const cityFill = colors.soft ?? '#FFF7EF';

  return `
    <g
      id="local-cta-${format.id}"
      data-variant="${localCtaDecision.variant}"
      data-recommended-variant="${localCtaDecision.recommendedVariant}"
    >
      ${renderCtaButton({
        x: ctaX,
        y: row.y,
        width: ctaWidth,
        height: row.height,
        radius: ctaRadius,
        text: ctaText,
        fontSize: cta.fontSize,
        centerY: ctaCenterY,
      })}

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