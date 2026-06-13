import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { getTextFallbackValue } from '../utils/getTextFallbackValue';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialPriceOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  variant?: 'default' | 'soft';
};

export function renderSocialPrice({
  creative,
  slot,
  variant = 'default',
}: RenderSocialPriceOptions): string {
  if (!creative.enabledComponents.includes('price')) {
    return '';
  }

  const text = getTextFallbackValue(creative.priceLabel, 'short');

  if (!text) {
    return '';
  }

  const style =
    variant === 'soft'
      ? SOCIAL_COMPONENT_STYLES.price.soft
      : SOCIAL_COMPONENT_STYLES.price.default;

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
    maxWidth: slot.width,
    dataComponent: 'social-price',
  }).svg;
}