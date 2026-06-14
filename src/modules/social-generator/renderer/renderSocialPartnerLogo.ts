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

function createTopRoundedPath({
  x,
  y,
  width,
  height,
  radius,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}): string {
  const cornerRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  const right = x + width;
  const bottom = y + height;

  return [
    `M ${x} ${bottom}`,
    `V ${y + cornerRadius}`,
    `Q ${x} ${y} ${x + cornerRadius} ${y}`,
    `H ${right - cornerRadius}`,
    `Q ${right} ${y} ${right} ${y + cornerRadius}`,
    `V ${bottom}`,
    'Z',
  ].join(' ');
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

  const style =
    variant === 'compact'
      ? styles.partnerLogo.compact
      : styles.partnerLogo.default;
  const hasLogoAsset = publicAssetExists(creative.partner.logoPath);

  const cardWidth = Math.min(slot.width, style.maxWidth);
  const cardHeight = Math.min(slot.height, style.maxHeight);
  const labelFontFamily = styles.brandLogo.default.fontFamily;

  const logoX = slot.x;
  const logoY = slot.y;
  const logoWidth = cardWidth;
  const logoHeight = cardHeight;
  const placeholderFontSize = Math.max(18, Math.round(cardHeight * 0.1));
  const strokeAttributes = renderStrokeAttributes(
    style.borderColor,
    style.borderWidth,
  );
  const backgroundPath = createTopRoundedPath({
    x: slot.x,
    y: slot.y,
    width: cardWidth,
    height: cardHeight,
    radius: style.radius,
  });

  return `
    <g
      data-component="social-partner-logo"
      data-partner-logo-state="${hasLogoAsset ? 'asset' : 'placeholder'}"
    >
      <path
        d="${backgroundPath}"
        fill="${style.backgroundColor}"
        ${strokeAttributes}
      />
      ${hasLogoAsset
        ? `
          <image
            href="${escapeXml(publicAssetPath(creative.partner.logoPath))}"
            x="${logoX}"
            y="${logoY}"
            width="${logoWidth}"
            height="${logoHeight}"
            preserveAspectRatio="xMidYMid meet"
            aria-label="${escapeXml(creative.partner.name)}"
          />
        `
        : `
          <text
            x="${logoX + logoWidth / 2}"
            y="${logoY + logoHeight * 0.58}"
            font-family="${escapeXml(labelFontFamily)}"
            font-size="${placeholderFontSize}"
            font-weight="800"
            fill="rgba(16, 45, 105, 0.42)"
            text-anchor="middle"
          >logo partnera</text>
        `}
    </g>
  `;
}
