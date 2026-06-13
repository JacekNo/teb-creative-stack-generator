import { renderSvgTextBlock } from '../../creative-stack/svg-components/renderSvgTextBlock';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialCourseNameOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  variant?: 'default' | 'compact';
};

export function renderSocialCourseName({
  creative,
  slot,
  variant = 'default',
}: RenderSocialCourseNameOptions): string {
  if (!creative.enabledComponents.includes('courseName')) {
    return '';
  }

  const style =
    variant === 'compact'
      ? SOCIAL_COMPONENT_STYLES.courseName.compact
      : SOCIAL_COMPONENT_STYLES.courseName.default;

  return renderSvgTextBlock({
    x: slot.x,
    y: slot.y + style.fontSize,
    width: slot.width,
    text: creative.courseName,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    fill: style.color,
    maxLines: style.maxLines,
    dataComponent: 'social-course-name',
  }).svg;
}