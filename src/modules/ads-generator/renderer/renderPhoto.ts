import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { getPublicAssetPath } from '../utils/publicAssetPath';

function renderBottomLeftRoundedPath(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}): string {
  const { x, y, width, height } = options;
  const radius = Math.max(0, Math.min(options.radius, width / 2, height / 2));

  const right = x + width;
  const bottom = y + height;

  /**
   * Ścieżka:
   * - start od lewego górnego rogu
   * - góra idzie do prawego górnego rogu, więc narożnik styka się z layoutem
   * - prawa i dolna krawędź są ostre
   * - zaokrąglamy tylko lewy dolny narożnik
   */
  return [
    `M ${x} ${y}`,
    `H ${right}`,
    `V ${bottom}`,
    `H ${x + radius}`,
    `Q ${x} ${bottom} ${x} ${bottom - radius}`,
    `V ${y}`,
    'Z',
  ].join(' ');
}

export function renderPhotoDefs(format: GoogleAdsFormat): string {
  const layout = getGoogleAdsLayout(format);
  const radius = layout.photo.radius ?? 0;

  return `
    <clipPath id="photoClip-${format.id}">
      <path
        d="${renderBottomLeftRoundedPath({
          x: layout.photo.x,
          y: layout.photo.y,
          width: layout.photo.width,
          height: layout.photo.height,
          radius,
        })}"
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
      href="${getPublicAssetPath(creative.imagePath)}"
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