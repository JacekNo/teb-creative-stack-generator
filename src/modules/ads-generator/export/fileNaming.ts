import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from '../renderer/googleAdsFormats';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function getCityCode(creative: ResolvedCreativeInput): string {
  const cityCode = creative.city.city_code;

  if (cityCode) {
    return slugify(cityCode);
  }

  return slugify(creative.city.city_id || creative.cityDisplay || 'miasto');
}

function getCourseCode(creative: ResolvedCreativeInput): string {
  return slugify(creative.course.record_id || creative.title || 'kierunek');
}

export function getCreativeExportBaseName(creative: ResolvedCreativeInput): string {
  const brand = slugify(creative.brandKey || 'teb');
  const city = getCityCode(creative);
  const course = getCourseCode(creative);

  return [brand, city, course].filter(Boolean).join('_');
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