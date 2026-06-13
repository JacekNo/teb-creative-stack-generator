import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialCityOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  variant?: 'default' | 'compact';
};

export function renderSocialCity({
  creative,
  slot,
  variant = 'default',
}: RenderSocialCityOptions): string {
  if (!creative.enabledComponents.includes('city')) {
    return '';
  }

  if (creative.offerMode === 'online') {
    return '';
  }

  if (!creative.cityName) {
    return '';
  }

  const style =
    variant === 'compact'
      ? SOCIAL_COMPONENT_STYLES.city.compact
      : SOCIAL_COMPONENT_STYLES.city.default;

  return renderSvgBadge({
    x: slot.x,
    y: slot.y,
    text: creative.cityName,
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
    dataComponent: 'social-city',
  }).svg;
}