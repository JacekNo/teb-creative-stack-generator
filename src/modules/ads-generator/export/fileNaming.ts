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

export function getCreativeExportBaseName(creative: ResolvedCreativeInput): string {
  const brand = slugify(creative.brandKey || 'teb');
  const city = slugify(creative.cityDisplay || 'miasto');
  const title = slugify(creative.title || 'kierunek');

  return [brand, city, title].filter(Boolean).join('_');
}

export function getCreativePngFileName(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const baseName = getCreativeExportBaseName(creative);

  return `${baseName}_${format.width}x${format.height}.png`;
}