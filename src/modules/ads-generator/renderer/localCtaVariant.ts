import type { GoogleAdsFormat, GoogleAdsFormatId } from './googleAdsFormats';

export type LocalCtaVariant = 'single-button' | 'button-plus-city' | 'stacked';

export interface LocalCtaVariantDecision {
  /**
   * Aktualnie renderowany wariant.
   * Na razie trzymamy stabilnie button-plus-city,
   * żeby nie zmieniać wyglądu bez osobnego commita.
   */
  variant: LocalCtaVariant;

  /**
   * Wariant rekomendowany przez resolver.
   * Przyda się później dla walidatora i wdrażania stacked/single-button.
   */
  recommendedVariant: LocalCtaVariant;

  reason: string;
  cityLength: number;
  isLongCity: boolean;
}

function normalizeCityLabel(cityLabel: string): string {
  return cityLabel.trim().replace(/\s+/g, ' ');
}

function getRecommendedVariant(
  cityLength: number,
  formatId: GoogleAdsFormatId,
): LocalCtaVariant {
  const longCity = cityLength > 18;

  if (longCity) {
    return 'stacked';
  }

  if (formatId === 'landscape_1200x628') {
    return cityLength > 14 ? 'button-plus-city' : 'single-button';
  }

  if (formatId === 'portrait_960x1200') {
    return cityLength > 16 ? 'stacked' : 'button-plus-city';
  }

  return cityLength > 16 ? 'button-plus-city' : 'single-button';
}

export function resolveLocalCtaVariant(
  cityLabel: string,
  format: GoogleAdsFormat,
): LocalCtaVariantDecision {
  const normalizedCityLabel = normalizeCityLabel(cityLabel);
  const cityLength = normalizedCityLabel.length;
  const recommendedVariant = getRecommendedVariant(cityLength, format.id);

  /**
   * Etap 1:
   * Zawsze renderujemy button-plus-city.
   *
   * Dzięki temu ten commit jest strukturalny i bezpieczny:
   * dodaje resolver, ale nie zmienia jeszcze wyglądu kreacji.
   */
  const variant: LocalCtaVariant = 'button-plus-city';

  return {
    variant,
    recommendedVariant,
    cityLength,
    isLongCity: cityLength > 18,
    reason:
      recommendedVariant === variant
        ? 'recommended-variant-is-currently-rendered'
        : `recommended-${recommendedVariant}-will-be-enabled-later`,
  };
}