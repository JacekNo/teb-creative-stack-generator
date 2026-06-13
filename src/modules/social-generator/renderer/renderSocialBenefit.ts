import { renderSvgTextBlock } from '../../creative-stack/svg-components/renderSvgTextBlock';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { getTextFallbackValue } from '../utils/getTextFallbackValue';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialBenefitOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  variant?: 'default' | 'compact';
};

export function renderSocialBenefit({
  creative,
  slot,
  variant = 'default',
}: RenderSocialBenefitOptions): string {
  if (!creative.enabledComponents.includes('benefit')) {
    return '';
  }

  const text = getTextFallbackValue(creative.benefit, 'short');

  if (!text) {
    return '';
  }

  const style =
    variant === 'compact'
      ? SOCIAL_COMPONENT_STYLES.benefit.compact
      : SOCIAL_COMPONENT_STYLES.benefit.default;

  return renderSvgTextBlock({
    x: slot.x,
    y: slot.y + style.fontSize,
    width: slot.width,
    text,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    fill: style.color,
    maxLines: style.maxLines,
    dataComponent: 'social-benefit',
  }).svg;
}