import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';

export function renderPhotoDefs(format: GoogleAdsFormat): string {
  const layout = getGoogleAdsLayout(format);

  return `
    <clipPath id="photoClip-${format.id}">
      <rect
        x="${layout.photo.x}"
        y="${layout.photo.y}"
        width="${layout.photo.width}"
        height="${layout.photo.height}"
        rx="${layout.photo.radius ?? 0}"
      />
    </clipPath>

    <linearGradient id="photoShade-${format.id}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.16" />
    </linearGradient>
  `;
}

export function renderPhoto(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);

  return `
    <image
      href="${creative.imagePath}"
      x="${layout.photo.x}"
      y="${layout.photo.y}"
      width="${layout.photo.width}"
      height="${layout.photo.height}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#photoClip-${format.id})"
    />

    <rect
      x="${layout.photo.x}"
      y="${layout.photo.y}"
      width="${layout.photo.width}"
      height="${layout.photo.height}"
      fill="url(#photoShade-${format.id})"
      clip-path="url(#photoClip-${format.id})"
    />
  `;
}