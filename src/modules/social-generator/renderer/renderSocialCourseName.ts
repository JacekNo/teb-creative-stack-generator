import { renderSvgBadge } from '../../creative-stack/svg-components/renderSvgBadge';
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
  const badgeStyle = system.components.badge;
  const linesSvg = fit.lines
    .map((line, index) => {
      const y = baselineY + index * fit.lineHeight;

      return `
        <text
          x="${slot.x}"
          y="${y}"
          font-family="${escapeXml(fit.fontFamily)}"
          font-size="${fit.fontSize}"
          font-weight="${fit.fontWeight}"
          fill="${system.theme.textPrimary}"
          letter-spacing="${fit.letterSpacing}"
        >${escapeXml(line.text)}</text>
      `;
    })
    .join('');
  const mainTextHeight =
    fit.lines.length > 0
      ? fit.fontSize + Math.max(0, fit.lines.length - 1) * fit.lineHeight
      : 0;
  const titleSubtitleGap = system.spacing[1];
  const titleModeGap = system.spacing[3];
  const subtitleStartY =
    slot.y + mainTextHeight + (fit.subtitleLines.length > 0 ? titleSubtitleGap : 0);
  const subtitleBaselineY = subtitleStartY + fit.subtitleFontSize;
  const subtitleSvg = fit.subtitleLines
    .map((line, index) => {
      const y = subtitleBaselineY + index * fit.subtitleLineHeight;

      return `
        <text
          x="${slot.x}"
          y="${y}"
          font-family="${escapeXml(fit.fontFamily)}"
          font-size="${fit.subtitleFontSize}"
          font-weight="${fit.subtitleFontWeight}"
          fill="${system.theme.textPrimary}"
          letter-spacing="${fit.subtitleLetterSpacing}"
        >${escapeXml(line.text)}</text>
      `;
    })
    .join('');
  const subtitleHeight =
    fit.subtitleLines.length > 0
      ? fit.subtitleFontSize +
        Math.max(0, fit.subtitleLines.length - 1) * fit.subtitleLineHeight
      : 0;
  const modeBadgeHeight = Math.round(badgeStyle.height * 0.78);
  const modeBadgeFontSize = Math.round(badgeStyle.fontSize * 0.84);
  const modeBadgeSvg = fit.modeLabel
    ? renderSvgBadge({
        x: slot.x,
        y:
          subtitleStartY +
          subtitleHeight +
          titleModeGap,
        text: fit.modeLabel,
        fontFamily: fit.fontFamily,
        fontSize: modeBadgeFontSize,
        fontWeight: badgeStyle.fontWeight,
        letterSpacing: system.typography.caption.letterSpacing,
        paddingX: Math.round(badgeStyle.paddingX * 0.76),
        paddingY: Math.round(badgeStyle.paddingY * 0.72),
        radius: badgeStyle.radius,
        height: modeBadgeHeight,
        fill: system.theme.badgeTones.online.fill,
        color: system.theme.badgeTones.online.color,
        borderColor: system.theme.badgeTones.online.borderColor,
        borderWidth: badgeStyle.borderWidth,
        maxWidth: slot.width,
        dataComponent: 'social-course-mode-badge',
      }).svg
    : '';

  return `
    <g
      data-component="social-course-name"
      data-title-variant="${fit.typographyKey}"
      data-title-fit="${fit.didFit ? 'fit' : 'overflow'}"
    >
      ${linesSvg}
      ${subtitleSvg}
      ${modeBadgeSvg}
    </g>
  `;
}
