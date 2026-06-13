import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';
import { publicAssetPath } from '../../creative-stack/utils/publicAssetPath';
export type RenderSocialPartnerLogoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
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

export function renderSocialPartnerLogo({
  creative,
  slot,
  variant = 'default',
}: RenderSocialPartnerLogoOptions): string {
  if (!creative.enabledComponents.includes('partnerLogo')) {
    return '';
  }

  if (!creative.partner) {
    return '';
  }

  const style =
    variant === 'compact'
      ? SOCIAL_COMPONENT_STYLES.partnerLogo.compact
      : SOCIAL_COMPONENT_STYLES.partnerLogo.default;

  const cardWidth = Math.min(slot.width, style.maxWidth);
  const cardHeight = Math.min(slot.height, style.maxHeight);

  const logoX = slot.x + style.paddingX;
  const logoY = slot.y + style.paddingY;
  const logoWidth = Math.max(0, cardWidth - style.paddingX * 2);
  const logoHeight = Math.max(0, cardHeight - style.paddingY * 2);

  return `
    <g data-component="social-partner-logo">
      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${cardWidth}"
        height="${cardHeight}"
        rx="${style.radius}"
        fill="${style.backgroundColor}"
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