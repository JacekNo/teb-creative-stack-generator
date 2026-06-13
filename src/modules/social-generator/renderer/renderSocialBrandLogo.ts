import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialBrandLogoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

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
  styles,
}: RenderSocialBrandLogoOptions): string {
  if (!creative.enabledComponents.includes('brandLogo')) {
    return '';
  }

  const style = styles.brandLogo.default;
  const brandLabel = getBrandLabel(creative.brandKey);
  const baselineY = slot.y + Math.min(slot.height, style.maxHeight) * 0.72;

  return `
    <g data-component="social-brand-logo">
      <text
        x="${slot.x}"
        y="${baselineY}"
        font-family="${escapeXml(style.fontFamily)}"
        font-size="${style.fontSize}"
        font-weight="${style.fontWeight}"
        letter-spacing="${style.letterSpacing}"
        fill="${style.fill}"
      >${escapeXml(brandLabel)}</text>
    </g>
  `;
}
