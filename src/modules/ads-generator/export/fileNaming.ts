import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from '../renderer/googleAdsFormats';

type CityLike = {
  city_code?: string;
  city_id?: string;
  city?: string;
  city_raw?: string;
  city_display?: string;
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function getCityExportCode(city: CityLike | null | undefined): string {
  if (city?.city_code) {
    return slugify(city.city_code);
  }

  if (city?.city_id) {
    return slugify(city.city_id);
  }

  if (city?.city) {
    return slugify(city.city);
  }

  if (city?.city_raw) {
    return slugify(city.city_raw);
  }

  if (city?.city_display) {
    return slugify(city.city_display);
  }

  return 'miasto';
}

function getCourseCode(creative: ResolvedCreativeInput): string {
  return slugify(creative.course.record_id || creative.title || 'kierunek');
}

export function getCreativeExportBaseName(creative: ResolvedCreativeInput): string {
  const brand = slugify(creative.brandKey || 'teb');
  const city = getCityExportCode(creative.city);
  const course = getCourseCode(creative);

  return [brand, city, course].filter(Boolean).join('_');
}

export function getCreativeFolderName(creative: ResolvedCreativeInput): string {
  return getCreativeExportBaseName(creative);
}

export function getCreativePngFileName(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const baseName = getCreativeExportBaseName(creative);

  return `${baseName}_${format.width}x${format.height}.png`;
}

export function getCreativeZipFileName(creative: ResolvedCreativeInput): string {
  const baseName = getCreativeExportBaseName(creative);

  return `${baseName}_google-ads-set.zip`;
}

export function getBatchZipFileName(options: {
  city?: CityLike | null;
  brand?: string;
  count?: number;
}): string {
  const city = getCityExportCode(options.city);
  const brand = slugify(options.brand || 'all-brands');
  const count = options.count ? `${options.count}-kierunkow` : 'batch';

  return `google-ads_${city}_${brand}_${count}.zip`;
}