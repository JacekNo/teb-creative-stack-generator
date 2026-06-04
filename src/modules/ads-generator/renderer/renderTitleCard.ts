import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";
import { getGoogleAdsLayout } from "./googleAdsLayouts";
import { fitTextBlock } from "./textFit";
import { renderTextLines } from "./svgUtils";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function renderTitleCard(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const card = layout.titleCard;

  const minCardWidth = card.minWidth ?? card.width;
  const maxCardWidth = card.maxWidth ?? card.width;
  const minCardHeight = card.minHeight ?? card.height;
  const maxCardHeight = card.maxHeight ?? card.height;

  /**
   * Dodatkowy bufor szerokości.
   * Symuluje bezpieczny margines przy braku prawdziwego pomiaru fontu.
   */
  const inlineGuard = 14;
  const blockGuard = 4;

  const maxContentWidth = Math.max(
    80,
    maxCardWidth - card.paddingX * 2 - inlineGuard,
  );

  const maxContentHeight = Math.max(
    40,
    maxCardHeight - card.paddingY * 2 - blockGuard,
  );

  const hasSubtitle = Boolean(creative.subtitle);
  const gap = hasSubtitle ? 10 : 0;

  /**
   * Delikatnie konserwatywne ratio.
   * Lepiej zawinąć tekst odrobinę wcześniej niż pozwolić mu wyjść poza aplę.
   */
  const titleCharRatio = 0.58;
  const subtitleCharRatio = 0.55;

  const subtitleFit = hasSubtitle
    ? fitTextBlock({
        text: creative.subtitle ?? "",
        maxWidth: maxContentWidth,
        maxHeight: Math.max(34, Math.round(maxContentHeight * 0.38)),
        maxLines: layout.subtitle.maxLines,
        maxFontSize: layout.subtitle.fontSize,
        minFontSize: 16,
        lineHeightRatio: layout.subtitle.lineHeight / layout.subtitle.fontSize,
        averageCharWidthRatio: subtitleCharRatio,
      })
    : null;

  const subtitleHeight =
    subtitleFit && subtitleFit.lines.length ? subtitleFit.height : 0;

  const titleMaxHeight = Math.max(
    42,
    maxContentHeight - (subtitleHeight ? subtitleHeight + gap : 0),
  );

  const titleFit = fitTextBlock({
    text: creative.title,
    maxWidth: maxContentWidth,
    maxHeight: titleMaxHeight,
    maxLines: layout.title.maxLines,
    maxFontSize: layout.title.fontSize,
    minFontSize: 22,
    lineHeightRatio: layout.title.lineHeight / layout.title.fontSize,
    averageCharWidthRatio: titleCharRatio,
  });

  const contentWidth = Math.max(titleFit.width, subtitleFit?.width ?? 0);

  const textBlockHeight =
    titleFit.height + (subtitleHeight ? gap + subtitleHeight : 0);

  /**
   * To jest właściwy odpowiednik Figma Hug:
   * card = text block + padding + guard.
   */
  const cardWidth = clamp(
    Math.ceil(contentWidth + card.paddingX * 2 + inlineGuard),
    minCardWidth,
    maxCardWidth,
  );

  const cardHeight = clamp(
    Math.ceil(textBlockHeight + card.paddingY * 2 + blockGuard),
    minCardHeight,
    maxCardHeight,
  );

  const contentX = card.x + card.paddingX;

  const titleLineCount = titleFit.lines.length;
  const subtitleLineCount = subtitleFit?.lines.length ?? 0;

  const titleVisualHeight =
    titleLineCount > 0 ? (titleLineCount - 1) * titleFit.lineHeight : 0;

  const subtitleVisualHeight =
    subtitleFit && subtitleLineCount > 0
      ? (subtitleLineCount - 1) * subtitleFit.lineHeight
      : 0;

  const visualTextBlockHeight =
    titleVisualHeight +
    titleFit.fontSize +
    (subtitleFit && subtitleLineCount > 0
      ? gap + subtitleVisualHeight + subtitleFit.fontSize
      : 0);

  const groupCenterY =
    card.contentVerticalAlign === "top"
      ? card.y + card.paddingY + visualTextBlockHeight / 2
      : card.y + cardHeight / 2;

  const groupStartY = groupCenterY - visualTextBlockHeight / 2;

  const titleY = groupStartY + titleFit.fontSize / 2;

  const subtitleY =
    subtitleFit && subtitleFit.lines.length
      ? titleY +
        titleVisualHeight +
        titleFit.fontSize / 2 +
        gap +
        subtitleFit.fontSize / 2
      : 0;

  return `
    <rect
      x="${card.x}"
      y="${card.y}"
      width="${cardWidth}"
      height="${cardHeight}"
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
      dominantBaseline: "middle",
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
            dominantBaseline: "middle",
          })
        : ""
    }
  `;
}
