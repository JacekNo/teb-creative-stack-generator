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
  styles?: unknown;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function estimateTextWidth(
  text: string,
  fontSize: number,
  textWidthRatio: number,
): number {
  return text.length * fontSize * textWidthRatio;
}

function renderTextLines({
  lines,
  x,
  y,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fill,
  dataComponent,
}: {
  lines: { text: string }[];
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  fill: string;
  dataComponent: string;
}): string {
  return lines
    .map((line, index) => `
      <text
        x="${x}"
        y="${y + index * lineHeight}"
        font-family="${escapeXml(fontFamily)}"
        font-size="${fontSize}"
        font-weight="${fontWeight}"
        letter-spacing="${letterSpacing}"
        fill="${fill}"
        data-component="${dataComponent}"
      >${escapeXml(line.text)}</text>
    `)
    .join('');
}

function renderModeBadge({
  label,
  x,
  y,
  system,
}: {
  label: string;
  x: number;
  y: number;
  system: SocialDesignSystem;
}): string {
  if (!label) {
    return '';
  }

  const style = system.components.titleStack.modeBadge;
  const tone = system.theme.courseModeBadge;
  const width = Math.ceil(
    style.paddingX * 2 +
      estimateTextWidth(label, style.fontSize, style.textWidthRatio),
  );

  return `
    <g data-component="social-course-mode-badge">
      <rect
        x="${x}"
        y="${y}"
        width="${width}"
        height="${style.height}"
        rx="${style.radius}"
        fill="${tone.fill}"
        stroke="${tone.borderColor}"
        stroke-width="0"
      />
      <text
        x="${x + style.paddingX}"
        y="${y + style.height / 2}"
        font-family="${escapeXml(system.typography.fontFamily)}"
        font-size="${style.fontSize}"
        font-weight="${style.fontWeight}"
        letter-spacing="${style.letterSpacing}"
        fill="${tone.color}"
        dominant-baseline="central"
      >${escapeXml(label)}</text>
    </g>
  `;
}

export function renderSocialCourseName({
  creative,
  slot,
  system,
}: RenderSocialCourseNameOptions): string {
  if (!creative.enabledComponents.includes('courseName')) {
    return '';
  }

  const fit = fitSocialCourseTitle({
    creative,
    system,
    width: slot.width,
    maxHeight: slot.height,
    maxLines: 3,
  });

  const titleY = slot.y + fit.fontSize;
  const subtitleStartY =
    titleY +
    Math.max(0, fit.lines.length - 1) * fit.lineHeight +
    (fit.subtitleLines.length > 0
      ? system.components.titleStack.titleSubtitleGap + fit.subtitleFontSize
      : 0);
  const modeBadgeY =
    fit.subtitleLines.length > 0
      ? subtitleStartY +
        Math.max(0, fit.subtitleLines.length - 1) * fit.subtitleLineHeight +
        system.components.titleStack.subtitleModeGap
      : titleY +
        Math.max(0, fit.lines.length - 1) * fit.lineHeight +
        system.components.titleStack.subtitleModeGap;

  return `
    <g data-component="social-course-name" data-title-fit="${fit.typographyKey}">
      ${renderTextLines({
        lines: fit.lines,
        x: slot.x,
        y: titleY,
        fontFamily: fit.fontFamily,
        fontSize: fit.fontSize,
        fontWeight: fit.fontWeight,
        lineHeight: fit.lineHeight,
        letterSpacing: fit.letterSpacing,
        fill: system.theme.textPrimary,
        dataComponent: 'social-course-name-main',
      })}

      ${renderTextLines({
        lines: fit.subtitleLines,
        x: slot.x,
        y: subtitleStartY,
        fontFamily: fit.fontFamily,
        fontSize: fit.subtitleFontSize,
        fontWeight: fit.subtitleFontWeight,
        lineHeight: fit.subtitleLineHeight,
        letterSpacing: fit.subtitleLetterSpacing,
        fill: system.theme.textPrimary,
        dataComponent: 'social-course-name-subtitle',
      })}

      ${renderModeBadge({
        label: fit.modeLabel,
        x: slot.x,
        y: modeBadgeY,
        system,
      })}
    </g>
  `;
}
