import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialBrandLogoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
};

function getBrandLabel(brandKey: string): string {
  if (brandKey === 'kursy') {
    return 'TEB Kursy';
  }

  if (brandKey === 'medyczne') {
    return 'TEB Medyczne';
  }

  if (brandKey === 'policealne') {
    return 'TEB Policealne';
  }

  return 'TEB Edukacja';
}

export function renderSocialBrandLogo({
  creative,
  slot,
}: RenderSocialBrandLogoOptions): string {
  if (!creative.enabledComponents.includes('brandLogo')) {
    return '';
  }

  const style = SOCIAL_COMPONENT_STYLES.brandLogo.default;
  const brandLabel = getBrandLabel(creative.brandKey);

  return `
    <g data-component="social-brand-logo">
      <text
        x="${slot.x}"
        y="${slot.y + Math.min(slot.height, style.maxHeight) * 0.72}"
        font-family="Roc Grotesk, Inter, Arial, sans-serif"
        font-size="32"
        font-weight="800"
        fill="#102D69"
      >${brandLabel}</text>
    </g>
  `;
}