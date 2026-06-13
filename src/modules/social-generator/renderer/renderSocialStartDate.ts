import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { getTextFallbackValue } from '../utils/getTextFallbackValue';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialStartDateOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  variant?: 'default' | 'compact';
};

export function renderSocialStartDate({
  creative,
  slot,
  styles,
  variant = 'default',
}: RenderSocialStartDateOptions): string {
  if (!creative.enabledComponents.includes('startDate')) {
    return '';
  }

  const text = getTextFallbackValue(creative.startDateLabel, 'short');

  if (!text) {
    return '';
  }

  const style =
    variant === 'compact'
      ? styles.startDate.compact
      : styles.startDate.default;

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
    dataComponent: 'social-start-date',
  }).svg;
}
