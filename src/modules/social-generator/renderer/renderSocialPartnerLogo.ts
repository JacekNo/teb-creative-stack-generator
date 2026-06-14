import { publicAssetExists } from '../../creative-stack/utils/publicAssetExists';
import { publicAssetPath } from '../../creative-stack/utils/publicAssetPath';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialPartnerLogoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  variant?: 'default' | 'compact';
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderStrokeAttributes(
  borderColor: string | undefined,
  borderWidth: number | undefined,
): string {
  if (!borderColor || !borderWidth || borderWidth <= 0) {
    return '';
  }

  return `stroke="${borderColor}" stroke-width="${borderWidth}"`;
}

export function renderSocialPartnerLogo({
  creative,
  slot,
  styles,
  variant = 'default',
}: RenderSocialPartnerLogoOptions): string {
  if (!creative.enabledComponents.includes('partnerLogo')) {
    return '';
  }

  if (!creative.partner) {
    return '';
  }

  if (!publicAssetExists(creative.partner.logoPath)) {
    return '';
  }

  const style =
    variant === 'compact'
      ? styles.partnerLogo.compact
      : styles.partnerLogo.default;

  const cardWidth = Math.min(slot.width, style.maxWidth);
  const cardHeight = Math.min(slot.height, style.maxHeight);

  const logoX = slot.x + style.paddingX;
  const logoY = slot.y + style.paddingY;
  const logoWidth = Math.max(0, cardWidth - style.paddingX * 2);
  const logoHeight = Math.max(0, cardHeight - style.paddingY * 2);
  const strokeAttributes = renderStrokeAttributes(
    style.borderColor,
    style.borderWidth,
  );

  return `
    <g data-component="social-partner-logo">
      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${cardWidth}"
        height="${cardHeight}"
        rx="${style.radius}"
        fill="${style.backgroundColor}"
        ${strokeAttributes}
      />
      <image
        href="${escapeXml(publicAssetPath(creative.partner.logoPath))}"
        x="${logoX}"
        y="${logoY}"
        width="${logoWidth}"
        height="${logoHeight}"
        preserveAspectRatio="xMidYMid meet"
        aria-label="${escapeXml(creative.partner.name)}"
      />
    </g>
  `;
}
