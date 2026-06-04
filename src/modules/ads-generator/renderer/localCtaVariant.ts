import type { GoogleAdsFormat, GoogleAdsFormatId } from './googleAdsFormats';

export type LocalCtaVariant = 'single-button' | 'button-plus-city' | 'stacked';

export interface LocalCtaVariantDecision {
  variant: LocalCtaVariant;
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
   * Etap 2:
   * Włączamy tylko stacked dla długich miast.
   * Krótkie miasta nadal renderujemy jako button-plus-city,
   * a single-button zostawiamy na osobny, późniejszy krok.
   */
  const variant: LocalCtaVariant =
    recommendedVariant === 'stacked' ? 'stacked' : 'button-plus-city';

  return {
    variant,
    recommendedVariant,
    cityLength,
    isLongCity: cityLength > 18,
    reason:
      recommendedVariant === variant
        ? 'recommended-variant-is-rendered'
        : `recommended-${recommendedVariant}-is-not-enabled-yet`,
  };
}