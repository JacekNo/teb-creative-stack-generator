import type {
  SocialCreativeData,
  SocialFormatId,
  SocialLayoutSlot,
} from '../types/social.types';
import type { CreativeThemeMode } from '../../creative-stack/design-system/creativeThemes';
import type { CreativeDensity } from '../../creative-stack/design-system/createResponsiveScale';
import {
  createSocialDesignSystem,
  type SocialDensity,
} from '../design-system/createSocialDesignSystem';
import { getSocialFormat } from './socialFormats';
import { createSocialResponsiveLayout } from './layout/createSocialResponsiveLayout';
import { createSocialComponentStyles } from './socialComponentStyles';
import { renderSocialBackground } from './renderSocialBackground';
import { renderSocialBrandLogo } from './renderSocialBrandLogo';
import { renderSocialCity } from './renderSocialCity';
import { renderSocialCourseBadges } from './renderSocialCourseBadges';
import { renderSocialCourseFacts } from './renderSocialCourseFacts';
import { renderSocialCourseName } from './renderSocialCourseName';
import { renderSocialPartnerLogo } from './renderSocialPartnerLogo';
import { renderSocialPhoto } from './renderSocialPhoto';

export type RenderSocialSvgOptions = {
  creative: SocialCreativeData;
  formatId: SocialFormatId;
  showDebugOverlay?: boolean;
  themeMode?: CreativeThemeMode;
  density?: SocialDensity;
  creativeScale?: number;
};

type SocialRenderSlots = Record<string, SocialLayoutSlot>;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderSurfaceCard({
  slot,
  radius,
  fill,
}: {
  slot: SocialLayoutSlot;
  radius: number;
  fill: string;
}): string {
  return `
    <rect
      data-component="social-title-card-surface"
      x="${slot.x}"
      y="${slot.y}"
      width="${slot.width}"
      height="${slot.height}"
      rx="${radius}"
      fill="${fill}"
    />
  `;
}

function renderDebugSlot(
  name: string,
  slot: SocialLayoutSlot,
  stroke: string,
): string {
  return `
    <g data-debug-slot="${escapeXml(name)}">
      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        fill="none"
        stroke="${stroke}"
        stroke-width="2"
        stroke-dasharray="8 8"
      />
      <text
        x="${slot.x + 8}"
        y="${slot.y + 24}"
        font-family="Arial, sans-serif"
        font-size="18"
        font-weight="700"
        fill="${stroke}"
      >${escapeXml(name)}</text>
    </g>
  `;
}

function renderDebugOverlay(
  slots: SocialRenderSlots,
  stroke: string,
): string {
  return `
    <g data-component="social-debug-overlay">
      ${Object.entries(slots)
        .map(([name, slot]) => renderDebugSlot(name, slot, stroke))
        .join('')}
    </g>
  `;
}

function renderSafeZoneOverlay(
  slot: SocialLayoutSlot,
  stroke: string,
): string {
  return `
    <g data-component="social-safe-zone-overlay">
      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        fill="none"
        stroke="${stroke}"
        stroke-width="3"
        stroke-dasharray="12 10"
      />
      <text
        x="${slot.x + 12}"
        y="${slot.y + 32}"
        font-family="Arial, sans-serif"
        font-size="22"
        font-weight="700"
        fill="${stroke}"
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

  const system = createSocialDesignSystem({
    brandKey: creative.brandKey,
    formatId,
    density,
    creativeScale,
  });

  const styles = createSocialComponentStyles({
    width: format.width,
    height: format.height,
    brandKey: creative.brandKey,
    themeMode,
    density: density as CreativeDensity,
    creativeScale,
  });

  const layout = createSocialResponsiveLayout({
    format,
    system,
    creative,
  });

  const slots: SocialRenderSlots = {
    photo: layout.photo,
    partnerLogo: layout.partnerLogo,
    titleCard: layout.titleCard,
    courseName: layout.courseName,
    courseFacts: layout.courseFacts,
    courseBadges: layout.courseBadges,
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
      aria-label="${escapeXml(creative.courseName)}"
    >
      ${renderSocialBackground({ system })}

      ${renderSocialPhoto({
        creative,
        slot: slots.photo,
        styles,
      })}

      ${renderSocialPartnerLogo({
        creative,
        slot: slots.partnerLogo,
        styles,
      })}

      ${renderSurfaceCard({
        slot: layout.titleCard,
        radius: system.components.titleCard.radius,
        fill: system.theme.surface,
      })}

      ${renderSocialCourseName({
        creative,
        slot: slots.courseName,
        system,
        maxLines: 3,
      })}

      ${renderSocialCourseFacts({
        creative,
        slot: slots.courseFacts,
        system,
      })}

      ${renderSocialCourseBadges({
        creative,
        slot: slots.courseBadges,
        system,
      })}

      ${renderSocialCity({
        creative,
        slot: slots.city,
        styles,
        variant: 'compact',
      })}

      ${renderSocialBrandLogo({
        creative,
        slot: slots.brandLogo,
        styles,
        system,
      })}

      ${showDebugOverlay
        ? renderSafeZoneOverlay(layout.safeArea, styles.debug.safeZoneStroke)
        : ''}
      ${showDebugOverlay
        ? renderDebugOverlay(slots, styles.debug.slotStroke)
        : ''}
    </svg>
  `;
}
