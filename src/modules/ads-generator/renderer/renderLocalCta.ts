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
      font-family="Roc Grotesk, Arial, sans-serif"
      font-size="${fontSize}"
      font-weight="900"
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
      font-family="Roc Grotesk, Arial, sans-serif"
      font-size="${fontSize}"
      font-weight="850"
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

  const ctaText = 'rozpocznij naukę';
  const cityText = creative.cityDisplay;

  const localCtaDecision = resolveLocalCtaVariant(cityText, format);

  const ctaX = row.x;

  /**
   * Stałe wysokości komponentów.
   * Nie spłaszczamy CTA przy wariancie stacked.
   */
  const ctaHeight = row.height;
  const cityHeight = Math.round(row.height * 0.76);
  const stackedGapY = Math.max(8, Math.round(row.height * 0.12));
/**
 * Dolną krawędź LocalCTA wyrównujemy do dolnej krawędzi BrandAnchor.
 * Dzięki temu CTA / miasto siedzą optycznie na tej samej linii co logo.
 */
const localCtaBottomY = logo.y + logo.height;
  /**
   * Stałe fonty.
   * Długie miasta zmieniają wariant układu, ale nie zmniejszają fontu.
   */
  const ctaFontSize = cta.fontSize;
  const cityFontSize = city.fontSize;

  const ctaPaddingX = cta.paddingX ?? 24;
  const cityPaddingX = city.paddingX ?? 20;

  const ctaMinWidth = cta.minWidth ?? cta.width ?? 120;
  const ctaMaxWidth = cta.maxWidth ?? cta.width ?? 340;

  const ctaWidth = getPillWidth({
    text: ctaText,
    fontSize: ctaFontSize,
    paddingX: ctaPaddingX,
    minWidth: ctaMinWidth,
    maxWidth: ctaMaxWidth,
    averageCharWidthRatio: 0.56,
  });

  const cityFill = colors.soft ?? '#FFF7EF';

  if (localCtaDecision.variant === 'stacked') {
    /**
     * Wariant stacked:
     * - CTA zachowuje pełną wysokość i formę.
     * - Miasto ma stałą wysokość.
     * - Całą grupę podnosimy w górę.
     * - Miasto siedzi w dolnej pozycji LocalCTA, CTA nad nim.
     */
    const cityX = ctaX;
const cityY = localCtaBottomY - cityHeight;

const ctaY = cityY - stackedGapY - ctaHeight;

    const availableWidth = Math.max(
      city.minWidth,
      logo.x - ctaX - row.gap,
    );

    const cityFit = fitSingleLineText({
      text: cityText,
      maxWidth: availableWidth - cityPaddingX * 2,
      maxFontSize: cityFontSize,
      minFontSize: cityFontSize,
      averageCharWidthRatio: 0.54,
    });

    const cityWidth = getPillWidth({
      text: cityFit.text,
      fontSize: cityFontSize,
      paddingX: cityPaddingX,
      minWidth: city.minWidth,
      maxWidth: availableWidth,
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
          text: ctaText,
          fontSize: ctaFontSize,
        })}

        ${renderCityPill({
          x: cityX,
          y: cityY,
          width: cityWidth,
          height: cityHeight,
          text: cityFit.text,
          fontSize: cityFontSize,
          fill: cityFill,
        })}
      </g>
    `;
  }

  /**
   * Wariant button-plus-city:
   * CTA i miasto stoją obok siebie.
   * Oba mają stałą wysokość.
   */
  const cityX = ctaX + ctaWidth + row.gap;
const cityY = localCtaBottomY - cityHeight;

  const maxCityWidthBeforeLogo = Math.max(
    city.minWidth,
    logo.x - cityX - row.gap,
  );

  const safeCityMaxWidth = Math.min(city.maxWidth, maxCityWidthBeforeLogo);

  const cityFit = fitSingleLineText({
    text: cityText,
    maxWidth: safeCityMaxWidth - cityPaddingX * 2,
    maxFontSize: cityFontSize,
    minFontSize: cityFontSize,
    averageCharWidthRatio: 0.54,
  });

  const cityWidth = getPillWidth({
    text: cityFit.text,
    fontSize: cityFontSize,
    paddingX: cityPaddingX,
    minWidth: city.minWidth,
    maxWidth: safeCityMaxWidth,
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
  y: localCtaBottomY - ctaHeight,
  width: ctaWidth,
  height: ctaHeight,
  text: ctaText,
  fontSize: ctaFontSize,
})}

      ${renderCityPill({
        x: cityX,
        y: cityY,
        width: cityWidth,
        height: cityHeight,
        text: cityFit.text,
        fontSize: cityFontSize,
        fill: cityFill,
      })}
    </g>
  `;
}