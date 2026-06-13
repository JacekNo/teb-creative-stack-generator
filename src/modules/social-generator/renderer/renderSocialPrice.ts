import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { getTextFallbackValue } from '../utils/getTextFallbackValue';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialPriceOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  variant?: 'default' | 'soft' | 'compact';
};

export function renderSocialPrice({
  creative,
  slot,
  styles,
  variant = 'default',
}: RenderSocialPriceOptions): string {
  if (!creative.enabledComponents.includes('price')) {
    return '';
  }

  const text = getTextFallbackValue(creative.priceLabel, 'short');

  if (!text) {
    return '';
  }

  const style = styles.price[variant];

  return renderSvgBadge({
    x: slot.x,
    y: slot.y,
    text,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    paddingX: style.paddingX,
    paddingY: style.paddingY,
    radius: style.radius,
    fill: style.backgroundColor,
    color: style.color,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    maxWidth: slot.width,
    dataComponent: 'social-price',
  }).svg;
}
