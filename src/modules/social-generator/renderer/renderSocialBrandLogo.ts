import { publicAssetExists } from '../../creative-stack/utils/publicAssetExists';
import { publicAssetPath } from '../../creative-stack/utils/publicAssetPath';
import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialBrandLogoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  system: SocialDesignSystem;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderSocialBrandLogo({
  creative,
  slot,
  styles,
  system,
}: RenderSocialBrandLogoOptions): string {
  if (!creative.enabledComponents.includes('brandLogo')) {
    return '';
  }

  const style = styles.brandLogo.default;
  const logoPath = system.brand.logoPath;

  if (publicAssetExists(logoPath)) {
    return `
      <g data-component="social-brand-logo">
        <image
          href="${escapeXml(publicAssetPath(logoPath))}"
          x="${slot.x}"
          y="${slot.y}"
          width="${slot.width}"
          height="${slot.height}"
          preserveAspectRatio="xMinYMid meet"
          aria-label="${escapeXml(system.brand.name)}"
        />
      </g>
    `;
  }

  const brandLabel = system.brand.name;
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
