import type { SocialCreativeData, SocialFormatId } from '../types/social.types';
import { getSocialFormat } from './socialFormats';
import { getSocialLayout } from './socialLayouts';
import { renderSocialBenefit } from './renderSocialBenefit';
import { renderSocialBrandLogo } from './renderSocialBrandLogo';
import { renderSocialCity } from './renderSocialCity';
import { renderSocialCourseName } from './renderSocialCourseName';
import { renderSocialOfferMode } from './renderSocialOfferMode';
import { renderSocialPartnerLogo } from './renderSocialPartnerLogo';
import { renderSocialPhoto } from './renderSocialPhoto';
import { renderSocialPrice } from './renderSocialPrice';
import { renderSocialStartDate } from './renderSocialStartDate';

export type RenderSocialSvgOptions = {
  creative: SocialCreativeData;
  formatId: SocialFormatId;
  showDebugOverlay?: boolean;
};

function renderCanvasBackground(width: number, height: number): string {
  return `
    <rect
      x="0"
      y="0"
      width="${width}"
      height="${height}"
      fill="#F6F8FC"
    />
  `;
}

function renderDebugSlot(
  name: string,
  slot: { x: number; y: number; width: number; height: number },
): string {
  return `
    <g data-debug-slot="${name}">
      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        fill="none"
        stroke="#FF4652"
        stroke-width="2"
        stroke-dasharray="8 8"
      />
      <text
        x="${slot.x + 8}"
        y="${slot.y + 24}"
        font-family="Arial, sans-serif"
        font-size="18"
        font-weight="700"
        fill="#FF4652"
      >${name}</text>
    </g>
  `;
}

function renderDebugOverlay(
  slots: ReturnType<typeof getSocialLayout>['slots'],
): string {
  return `
    <g data-component="social-debug-overlay">
      ${Object.entries(slots)
        .map(([name, slot]) => {
          if (!slot) {
            return '';
          }

          return renderDebugSlot(name, slot);
        })
        .join('')}
    </g>
  `;
}

function renderSafeZoneOverlay(formatId: SocialFormatId): string {
  const format = getSocialFormat(formatId);

  if (!format.safeZone) {
    return '';
  }

  const { top, right, bottom, left } = format.safeZone;

  return `
    <g data-component="social-safe-zone-overlay">
      <rect
        x="${left}"
        y="${top}"
        width="${format.width - left - right}"
        height="${format.height - top - bottom}"
        fill="none"
        stroke="#009BDE"
        stroke-width="3"
        stroke-dasharray="12 10"
      />
      <text
        x="${left + 12}"
        y="${top + 32}"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="700"
        fill="#009BDE"
      >safe zone</text>
    </g>
  `;
}

export function renderSocialSvg({
  creative,
  formatId,
  showDebugOverlay = false,
}: RenderSocialSvgOptions): string {
  const format = getSocialFormat(formatId);
  const layout = getSocialLayout(formatId);
  const { slots } = layout;

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${format.width}"
      height="${format.height}"
      viewBox="0 0 ${format.width} ${format.height}"
      role="img"
      aria-label="${creative.courseName}"
    >
      ${renderCanvasBackground(format.width, format.height)}

      ${renderSocialPhoto({
        creative,
        slot: slots.photo,
      })}

      ${
        slots.partnerLogo
          ? renderSocialPartnerLogo({
              creative,
              slot: slots.partnerLogo,
            })
          : ''
      }

      ${
        slots.offerMode
          ? renderSocialOfferMode({
              creative,
              slot: slots.offerMode,
            })
          : ''
      }

      ${renderSocialCourseName({
        creative,
        slot: slots.courseName,
      })}

      ${
        slots.benefit
          ? renderSocialBenefit({
              creative,
              slot: slots.benefit,
            })
          : ''
      }

      ${
        slots.price
          ? renderSocialPrice({
              creative,
              slot: slots.price,
            })
          : ''
      }

      ${
        slots.startDate
          ? renderSocialStartDate({
              creative,
              slot: slots.startDate,
            })
          : ''
      }

      ${
        slots.city
          ? renderSocialCity({
              creative,
              slot: slots.city,
            })
          : ''
      }

      ${renderSocialBrandLogo({
        creative,
        slot: slots.brandLogo,
      })}

      ${showDebugOverlay ? renderSafeZoneOverlay(formatId) : ''}
      ${showDebugOverlay ? renderDebugOverlay(slots) : ''}
    </svg>
  `;
}