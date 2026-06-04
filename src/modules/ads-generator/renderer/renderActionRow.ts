import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { renderBrandAnchor } from './renderBrandAnchor';
import { renderLocalCta } from './renderLocalCta';

export function renderActionRow(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  return `
    <g id="action-row-${format.id}">
      ${renderLocalCta(creative, format)}
      ${renderBrandAnchor(creative, format)}
    </g>
  `;
}