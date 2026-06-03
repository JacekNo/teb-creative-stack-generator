import type { GoogleAdsFormat } from './googleAdsFormats';

export function renderPattern(format: GoogleAdsFormat, color: string): string {
  return `
    <pattern
      id="brandPattern-${format.id}"
      width="74"
      height="74"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(0)"
    >
      <path
        d="M18 26 L36 12 L54 26 M36 12 V58"
        fill="none"
        stroke="${color}"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.15"
      />
    </pattern>
  `;
}