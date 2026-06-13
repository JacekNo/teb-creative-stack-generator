import type {
  SocialCreativeData,
  SocialFormatId,
  SocialLayoutSlot,
} from '../types/social.types';
import type { CreativeThemeMode } from '../../creative-stack/design-system/creativeThemes';
import type { CreativeDensity } from '../../creative-stack/design-system/createResponsiveScale';
import {
  getSocialFormat,
  type SocialFormatDefinition,
} from './socialFormats';
import { createSocialComponentStyles } from './socialComponentStyles';
import { createSocialResponsiveLayout } from './layout/createSocialResponsiveLayout';
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
  themeMode?: CreativeThemeMode;
  density?: CreativeDensity;
  creativeScale?: number;
};

type SocialRenderSlots = Record<string, SocialLayoutSlot>;

function renderCanvasBackground(
  width: number,
  height: number,
  fill: string,
): string {
  return `
    <rect
      x="0"
      y="0"
      width="${width}"
      height="${height}"
      fill="${fill}"
    />
  `;
}

function renderDebugSlot(
  name: string,
  slot: SocialLayoutSlot,
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

function renderDebugOverlay(slots: SocialRenderSlots): string {
  return `
    <g data-component="social-debug-overlay">
      ${Object.entries(slots)
        .map(([name, slot]) => renderDebugSlot(name, slot))
        .join('')}
    </g>
  `;
}

function renderSafeZoneOverlay(format: SocialFormatDefinition): string {
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
  themeMode = 'light',
  density = 'default',
  creativeScale = 1,
}: RenderSocialSvgOptions): string {
  const format = getSocialFormat(formatId);

  const styles = createSocialComponentStyles({
    width: format.width,
    height: format.height,
    brandKey: creative.brandKey,
    themeMode,
    density,
    creativeScale,
  });

  const layout = createSocialResponsiveLayout({
    format,
    scale: styles.scale,
  });

  const slots: SocialRenderSlots = {
    photo: layout.photo,
    partnerLogo: layout.partnerLogo,
    offerMode: layout.offerMode,
    courseName: layout.courseName,
    benefit: layout.benefit,
    price: layout.price,
    startDate: layout.startDate,
    city: layout.city,
    brandLogo: layout.brandLogo,
  };

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${format.width}"
      height="${format.height}"
      viewBox="0 0 ${format.width} ${format.height}"
      role="img"
      aria-label="${creative.courseName}"
    >
      ${renderCanvasBackground(
        format.width,
        format.height,
        styles.canvas.backgroundColor,
      )}

      ${renderSocialPhoto({
        creative,
        slot: slots.photo,
      })}

      ${renderSocialPartnerLogo({
        creative,
        slot: slots.partnerLogo,
      })}

      ${renderSocialOfferMode({
        creative,
        slot: slots.offerMode,
      })}

      ${renderSocialCourseName({
        creative,
        slot: slots.courseName,
      })}

      ${renderSocialBenefit({
        creative,
        slot: slots.benefit,
      })}

      ${renderSocialPrice({
        creative,
        slot: slots.price,
      })}

      ${renderSocialStartDate({
        creative,
        slot: slots.startDate,
      })}

      ${renderSocialCity({
        creative,
        slot: slots.city,
      })}

      ${renderSocialBrandLogo({
        creative,
        slot: slots.brandLogo,
      })}

      ${showDebugOverlay ? renderSafeZoneOverlay(format) : ''}
      ${showDebugOverlay ? renderDebugOverlay(slots) : ''}
    </svg>
  `;
}