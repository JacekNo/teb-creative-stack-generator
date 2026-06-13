import { renderSvgTextBlock } from '../../creative-stack/svg-components/renderSvgTextBlock';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { getTextFallbackValue } from '../utils/getTextFallbackValue';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialBenefitOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  variant?: 'default' | 'compact';
};

export function renderSocialBenefit({
  creative,
  slot,
  styles,
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
      ? styles.benefit.compact
      : styles.benefit.default;

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
