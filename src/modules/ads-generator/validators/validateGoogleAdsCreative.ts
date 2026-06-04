import type { ResolvedCreativeInput } from '../types/ads.types';
import { GOOGLE_ADS_FORMATS } from '../renderer/googleAdsFormats';
import { getGoogleAdsLayout } from '../renderer/googleAdsLayouts';
import { fitSingleLineText, fitTextBlock } from '../renderer/textFit';

export type CreativeValidationLevel = 'ok' | 'warning' | 'error';

export interface CreativeValidationMessage {
  level: CreativeValidationLevel;
  formatId?: string;
  field: 'title' | 'subtitle' | 'city' | 'image' | 'course' | 'city-data' | 'brand';
  message: string;
}

export interface CreativeValidationResult {
  status: CreativeValidationLevel;
  messages: CreativeValidationMessage[];
}

function getWorstStatus(messages: CreativeValidationMessage[]): CreativeValidationLevel {
  if (messages.some((message) => message.level === 'error')) return 'error';
  if (messages.some((message) => message.level === 'warning')) return 'warning';

  return 'ok';
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

const contentWidth = Math.max(80, card.maxWidth - card.paddingX * 2);
const contentHeight = Math.max(40, card.maxHeight - card.paddingY * 2);

    const hasSubtitle = Boolean(creative.subtitle);
    const gap = hasSubtitle ? 10 : 0;

    const subtitleFit = hasSubtitle
      ? fitTextBlock({
          text: creative.subtitle,
          maxWidth: contentWidth,
          maxHeight: Math.max(34, Math.round(contentHeight * 0.36)),
          maxLines: layout.subtitle.maxLines,
          maxFontSize: layout.subtitle.fontSize,
          minFontSize: 16,
          lineHeightRatio: layout.subtitle.lineHeight / layout.subtitle.fontSize,
          averageCharWidthRatio: 0.52,
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
      minFontSize: 22,
      lineHeightRatio: layout.title.lineHeight / layout.title.fontSize,
      averageCharWidthRatio: 0.54,
    });

    if (titleFit.truncated) {
      messages.push({
        level: 'error',
        formatId: format.id,
        field: 'title',
        message: `Tytuł nie mieści się w formacie ${format.label}.`,
      });
    } else if (titleFit.fontSize <= 24) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'title',
        message: `Tytuł w formacie ${format.label} schodzi do bardzo małego fontu: ${titleFit.fontSize}px.`,
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

    const cityFit = fitSingleLineText({
      text: creative.cityDisplay,
      maxWidth: layout.actionRow.city.maxWidth - 42,
      maxFontSize: layout.actionRow.city.fontSize,
      minFontSize: 13,
      averageCharWidthRatio: 0.53,
    });

    if (cityFit.truncated) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto zostało skrócone w formacie ${format.label}.`,
      });
    } else if (cityFit.fontSize <= 14) {
      messages.push({
        level: 'warning',
        formatId: format.id,
        field: 'city',
        message: `Miasto w formacie ${format.label} używa bardzo małego fontu: ${cityFit.fontSize}px.`,
      });
    }
  }

  return {
    status: getWorstStatus(messages),
    messages,
  };
}