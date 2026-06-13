import { renderSvgTextBlock } from '../../creative-stack/svg-components/renderSvgTextBlock';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialCourseNameOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
  variant?: 'default' | 'compact';
};

export function renderSocialCourseName({
  creative,
  slot,
  styles,
  variant = 'default',
}: RenderSocialCourseNameOptions): string {
  if (!creative.enabledComponents.includes('courseName')) {
    return '';
  }

  const style =
    variant === 'compact'
      ? styles.courseName.compact
      : styles.courseName.default;

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
