import type { SocialDesignSystem } from '../design-system/createSocialDesignSystem';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { fitSocialCourseTitle } from './layout/socialTitleFit';

export type RenderSocialCourseNameOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  system: SocialDesignSystem;
  maxLines?: number;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderSocialCourseName({
  creative,
  slot,
  system,
  maxLines = 3,
}: RenderSocialCourseNameOptions): string {
  if (!creative.enabledComponents.includes('courseName')) {
    return '';
  }

  const fit = fitSocialCourseTitle({
    creative,
    system,
    width: slot.width,
    maxHeight: slot.height,
    maxLines,
  });

  const baselineY = slot.y + fit.fontSize;
  const linesSvg = fit.lines
    .map((line, index) => {
      const y = baselineY + index * fit.lineHeight;
      const textTransform = line.isModeLabel ? 'uppercase' : 'none';

      return `
        <text
          x="${slot.x}"
          y="${y}"
          font-family="${escapeXml(fit.fontFamily)}"
          font-size="${fit.fontSize}"
          font-weight="${fit.fontWeight}"
          fill="${system.theme.textPrimary}"
          letter-spacing="${fit.letterSpacing}"
          style="text-transform: ${textTransform};"
        >${escapeXml(line.text)}</text>
      `;
    })
    .join('');

  return `
    <g
      data-component="social-course-name"
      data-title-variant="${fit.typographyKey}"
      data-title-fit="${fit.didFit ? 'fit' : 'overflow'}"
    >
      ${linesSvg}
    </g>
  `;
}
