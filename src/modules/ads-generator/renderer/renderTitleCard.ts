import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';
import { fitTextBlock } from './textFit';
import { renderTextLines } from './svgUtils';

export function renderTitleCard(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const card = layout.titleCard;

  const contentX = card.x + card.paddingX;
  const contentY = card.y + card.paddingY;
  const contentWidth = card.width - card.paddingX * 2;
  const contentHeight = card.height - card.paddingY * 2;

  const hasSubtitle = Boolean(creative.subtitle);
  const gap = hasSubtitle ? 10 : 0;

  const subtitleFit = hasSubtitle
    ? fitTextBlock({
        text: creative.subtitle ?? '',
        maxWidth: contentWidth,
        maxHeight: Math.max(34, Math.round(contentHeight * 0.36)),
        maxLines: layout.subtitle.maxLines,
        maxFontSize: layout.subtitle.fontSize,
        minFontSize: 16,
        lineHeightRatio: layout.subtitle.lineHeight / layout.subtitle.fontSize,
        averageCharWidthRatio: 0.52,
      })
    : null;

  const titleMaxHeight = Math.max(
    42,
    contentHeight - (subtitleFit ? subtitleFit.height + gap : 0),
  );

  const titleFit = fitTextBlock({
    text: creative.title,
    maxWidth: contentWidth,
    maxHeight: titleMaxHeight,
    maxLines: layout.title.maxLines,
    maxFontSize: layout.title.fontSize,
    minFontSize: 22,
    lineHeightRatio: layout.title.lineHeight / layout.title.fontSize,
    averageCharWidthRatio: 0.54,
  });

  const titleY = contentY + titleFit.fontSize;
  const subtitleY = titleY + titleFit.height + gap + (subtitleFit?.fontSize ?? 0);

  return `
    <rect
      x="${card.x}"
      y="${card.y}"
      width="${card.width}"
      height="${card.height}"
      rx="${card.radius ?? 20}"
      fill="#ffffff"
      opacity="0.96"
    />

    ${renderTextLines({
      lines: titleFit.lines,
      x: contentX,
      y: titleY,
      fontSize: titleFit.fontSize,
      lineHeight: titleFit.lineHeight,
      fill: creative.colors.text,
      weight: 900,
      letterSpacing: -1.3,
    })}

    ${
      subtitleFit && subtitleFit.lines.length
        ? renderTextLines({
            lines: subtitleFit.lines,
            x: contentX,
            y: subtitleY,
            fontSize: subtitleFit.fontSize,
            lineHeight: subtitleFit.lineHeight,
            fill: creative.colors.text,
            weight: 700,
            letterSpacing: -0.5,
          })
        : ''
    }
  `;
}