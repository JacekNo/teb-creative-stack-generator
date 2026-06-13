import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialOfferModeOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
};

export function renderSocialOfferMode({
  creative,
  slot,
}: RenderSocialOfferModeOptions): string {
  if (creative.offerMode !== 'online') {
    return '';
  }

  if (!creative.enabledComponents.includes('offerMode')) {
    return '';
  }

  const text = creative.offerModeLabel ?? 'Nauka online';
  const style = SOCIAL_COMPONENT_STYLES.offerMode.default;

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
    dataComponent: 'social-offer-mode',
  }).svg;
}