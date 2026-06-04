import type { ResolvedCreativeInput } from '../types/ads.types';
import { GOOGLE_ADS_FORMATS } from '../renderer/googleAdsFormats';
import { getGoogleAdsLayout } from '../renderer/googleAdsLayouts';
import {
  estimateTextWidth,
  fitSingleLineText,
  fitTextBlock,
} from '../renderer/textFit';

export type CreativeValidationLevel = 'ok' | 'warning' | 'error';

export interface CreativeValidationMessage {
  level: CreativeValidationLevel;
  formatId?: string;
  field:
    | 'title'
    | 'subtitle'
    | 'city'
    | 'cta'
    | 'layout'
    | 'image'
    | 'course'
    | 'city-data'
    | 'brand';
  message: string;
}

export interface CreativeValidationResult {
  status: CreativeValidationLevel;
  messages: CreativeValidationMessage[];
}

const CTA_TEXT = 'rozpocznij naukę';
function getTitleMinFontSize(formatId: string): number {
  if (formatId === 'landscape_1200x628') {
    return 34;
  }

  return 40;
}

function getSubtitleMinFontSize(formatId: string): number {
  if (formatId === 'landscape_1200x628') {
    return 26;
  }

  return 30;
}

function getTitleCharRatio(formatId: string): number {
  if (formatId === 'landscape_1200x628') {
    return 0.52;
  }

  return 0.54;
}

function getInlineGuard(formatId: string): number {
  if (formatId === 'landscape_1200x628') {
    return 6;
  }

  return 10;
}
function getWorstStatus(messages: CreativeValidationMessage[]): CreativeValidationLevel {
  if (messages.some((message) => message.level === 'error')) return 'error';
  if (messages.some((message) => message.level === 'warning')) return 'warning';

  return 'ok';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPillWidth(options: {
  text: string;
  fontSize: number;
  paddingX: number;
  minWidth: number;
  maxWidth: number;
  averageCharWidthRatio: number;
}): number {
  const textWidth = estimateTextWidth(
    options.text,
    options.fontSize,
    options.averageCharWidthRatio,
  );

  return clamp(
    Math.ceil(textWidth + options.paddingX * 2),
    options.minWidth,
    options.maxWidth,
  );
}

export function validateGoogleAdsCreative(
  creative: ResolvedCreativeInput,
): CreativeValidationResult {
  const messages: CreativeValidationMessage[] = [];

  if (creative.image.image_status !== 'mapped') {
    messages.push({
      level: 'warning',
      field: 'image',
      message: `Zdjęcie ma status: ${creative.image.image_status}.`,
    });
  }

  if (creative.course.review_flags) {
    messages.push({
      level: 'warning',
      field: 'course',
      message: `Kierunek ma flagi przeglądu: ${creative.course.review_flags}.`,
    });
  }

  if (creative.city.review_flags) {
    messages.push({
      level: 'warning',
      field: 'city-data',
      message: `Miasto ma flagi przeglądu: ${creative.city.review_flags}.`,
    });
  }

  if (creative.brandKey === 'unknown') {
    messages.push({
      level: 'error',
      field: 'brand',
      message: 'Nie udało się ustalić brandu dla kierunku.',
    });
  }

  for (const format of GOOGLE_ADS_FORMATS) {
    const layout = getGoogleAdsLayout(format);
const card = layout.titleCard;

const inlineGuard = getInlineGuard(format.id);
const blockGuard = 4;

const contentWidth = Math.max(
  80,
  card.maxWidth - card.paddingX * 2 - inlineGuard,
);

const contentHeight = Math.max(
  40,
  card.maxHeight - card.paddingY * 2 - blockGuard,
);

const hasSubtitle = Boolean(creative.subtitle);

const gap = hasSubtitle
  ? format.id === 'landscape_1200x628'
    ? 8
    : 10
  : 0;

const titleCharRatio = getTitleCharRatio(format.id);
const subtitleCharRatio = 0.55;

    const subtitleFit = hasSubtitle
      ? fitTextBlock({
          text: creative.subtitle,
          maxWidth: contentWidth,
          maxHeight: Math.max(34, Math.round(contentHeight * 0.36)),
          maxLines: layout.subtitle.maxLines,
          maxFontSize: layout.subtitle.fontSize,
          minFontSize: getSubtitleMinFontSize(format.id),
          lineHeightRatio: layout.subtitle.lineHeight / layout.subtitle.fontSize,
          averageCharWidthRatio: subtitleCharRatio,
        })
      : null;

    const titleMaxHeight = Math.max(
      42,
      contentHeight - (subtitleFit ? subtitleFit.height + gap : 0),
    );

    const titleFit = fitTextBlock({
      text: creative.title,
      maxWidth: contentWidth,
      maxHeight: titleMaxHeight,
      maxLines: layout.title.maxLines,
      maxFontSize: layout.title.fontSize,
      minFontSize: getTitleMinFontSize(format.id),
      lineHeightRatio: layout.title.lineHeight / layout.title.fontSize,
      averageCharWidthRatio: titleCharRatio,
    });

    if (titleFit.truncated) {
      messages.push({
        level: 'error',
        formatId: format.id,
        field: 'title',
        message: `Tytuł nie mieści się w formacie ${format.label}.`,
      });
    } else if (titleFit.fontSize <= getTitleMinFontSize(format.id) + 2) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'title',
        message: `Tytuł w formacie ${format.label} schodzi do bardzo małego fontu: ${titleFit.fontSize}px.`,
      });
    }

    if (titleFit.fontSize * 0.25 < 8) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'title',
        message: `Tytuł po podglądzie 25% może być słabo czytelny: ${Math.round(
          titleFit.fontSize * 0.25,
        )}px.`,
      });
    }

    if (subtitleFit?.truncated) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'subtitle',
        message: `Dopisek nie mieści się w formacie ${format.label}.`,
      });
    }

    if (subtitleFit && subtitleFit.fontSize * 0.25 < 7) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'subtitle',
        message: `Dopisek po podglądzie 25% może być słabo czytelny: ${Math.round(
          subtitleFit.fontSize * 0.25,
        )}px.`,
      });
    }

    const row = layout.actionRow;
    const cta = row.cta;
    const city = row.city;
    const logo = row.logo;

    const ctaFit = fitSingleLineText({
      text: CTA_TEXT,
      maxWidth: Math.max(40, cta.maxWidth - cta.paddingX * 2),
      maxFontSize: cta.fontSize,
      minFontSize: Math.max(24, Math.round(cta.fontSize * 0.82)),
      averageCharWidthRatio: 0.56,
    });

    const ctaWidth = getPillWidth({
      text: ctaFit.text,
      fontSize: ctaFit.fontSize,
      paddingX: cta.paddingX,
      minWidth: cta.minWidth,
      maxWidth: cta.maxWidth,
      averageCharWidthRatio: 0.56,
    });

    if (ctaFit.truncated) {
      messages.push({
        level: 'error',
        formatId: format.id,
        field: 'cta',
        message: `CTA nie mieści się w pigułce w formacie ${format.label}.`,
      });
    } else if (ctaFit.fontSize < cta.fontSize) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'cta',
        message: `CTA w formacie ${format.label} zostało zmniejszone z ${cta.fontSize}px do ${ctaFit.fontSize}px.`,
      });
    }

    if (ctaFit.fontSize * 0.25 < 8) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'cta',
        message: `CTA po podglądzie 25% może być zbyt małe: ${Math.round(
          ctaFit.fontSize * 0.25,
        )}px.`,
      });
    }

    const buttonCityX = row.x + ctaWidth + row.gap;

    const maxCityWidthBeforeLogo = Math.max(
      city.minWidth,
      logo.x - buttonCityX - row.gap,
    );

    const safeCityMaxWidth = Math.min(city.maxWidth, maxCityWidthBeforeLogo);

    const cityRequiredWidth = Math.ceil(
      estimateTextWidth(creative.cityDisplay, city.fontSize, 0.54) +
        city.paddingX * 2,
    );

    const shouldUseStacked = cityRequiredWidth > safeCityMaxWidth;

    const cityAvailableWidth = shouldUseStacked
      ? Math.max(city.minWidth, logo.x - row.x - row.gap)
      : safeCityMaxWidth;

    const cityFit = fitSingleLineText({
      text: creative.cityDisplay,
      maxWidth: Math.max(20, cityAvailableWidth - city.paddingX * 2),
      maxFontSize: city.fontSize,
      minFontSize: Math.max(22, Math.round(city.fontSize * 0.86)),
      averageCharWidthRatio: 0.54,
    });

    if (shouldUseStacked) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'layout',
        message: `Miasto wymusza wariant stacked w formacie ${format.label}.`,
      });
    }

    if (cityRequiredWidth > city.maxWidth) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto jest dłuższe niż zalecana szerokość pigułki w formacie ${format.label}.`,
      });
    }

    if (cityFit.truncated) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto zostało skrócone w formacie ${format.label}.`,
      });
    } else if (cityFit.fontSize < city.fontSize) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto w formacie ${format.label} zostało zmniejszone z ${city.fontSize}px do ${cityFit.fontSize}px.`,
      });
    }

    if (cityFit.fontSize * 0.25 < 7) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto po podglądzie 25% może być słabo czytelne: ${Math.round(
          cityFit.fontSize * 0.25,
        )}px.`,
      });
    }

    if (safeCityMaxWidth <= city.minWidth && !shouldUseStacked) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'layout',
        message: `Mało miejsca między CTA a logo w formacie ${format.label}.`,
      });
    }
  }

  return {
    status: getWorstStatus(messages),
    messages,
  };
}