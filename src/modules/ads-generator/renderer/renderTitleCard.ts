import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";
import { getGoogleAdsLayout } from "./googleAdsLayouts";
import { estimateTextWidth, fitTextBlock } from "./textFit";
import { renderTextLines } from "./svgUtils";

const TITLE_FONT_FAMILY = "'Roc Grotesk', Arial, sans-serif";
const BODY_FONT_FAMILY = "'Roc Grotesk', Arial, sans-serif";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getTitleMinFontSize(format: GoogleAdsFormat): number {
  if (format.id === "landscape_1200x628") {
    return 40;
  }

  return 46;
}

function getSubtitleMinFontSize(format: GoogleAdsFormat): number {
  if (format.id === "landscape_1200x628") {
    return 30;
  }

  return 36;
}

function getTitleCharRatio(format: GoogleAdsFormat): number {
  /**
   * Roc Grotesk Bold jest węższy niż Roc Grotesk Wide.
   * Zbyt wysokie ratio powodowało przedwczesne obcinanie długich słów,
   * np. "farmaceutyczny" albo "niepełnosprawnej".
   */
  if (format.id === "landscape_1200x628") {
    return 0.54;
  }

  return 0.56;
}

function getInlineGuard(format: GoogleAdsFormat): number {
  /**
   * Guard do bezpieczeństwa renderu, ale mniejszy niż wcześniej,
   * żeby apla nie zostawiała dużego pustego marginesu po prawej.
   */
  if (format.id === "landscape_1200x628") {
    return 6;
  }

  return 10;
}

function getHugLinesWidth(options: {
  lines: string[];
  fontSize: number;
  averageCharWidthRatio: number;
  correction?: number;
}): number {
  const {
    lines,
    fontSize,
    averageCharWidthRatio,
    correction = 0.94,
  } = options;

  if (!lines.length) {
    return 0;
  }

  /**
   * estimateTextWidth ma własny guard bezpieczeństwa.
   * Do obliczenia szerokości apli częściowo go kompensujemy,
   * bo inaczej karta robi się wizualnie zbyt szeroka względem tekstu.
   */
  return Math.max(
    ...lines.map((line) =>
      Math.ceil(
        estimateTextWidth(line, fontSize, averageCharWidthRatio) * correction,
      ),
    ),
  );
}

function getVisualTextBlockHeight(options: {
  titleLineCount: number;
  titleFontSize: number;
  titleLineHeight: number;
  subtitleLineCount: number;
  subtitleFontSize: number;
  subtitleLineHeight: number;
  gap: number;
}): number {
  const {
    titleLineCount,
    titleFontSize,
    titleLineHeight,
    subtitleLineCount,
    subtitleFontSize,
    subtitleLineHeight,
    gap,
  } = options;

  const titleVisualHeight =
    titleLineCount > 0
      ? titleFontSize + Math.max(0, titleLineCount - 1) * titleLineHeight
      : 0;

  const subtitleVisualHeight =
    subtitleLineCount > 0
      ? subtitleFontSize +
        Math.max(0, subtitleLineCount - 1) * subtitleLineHeight
      : 0;

  return (
    titleVisualHeight +
    (subtitleVisualHeight > 0 ? gap + subtitleVisualHeight : 0)
  );
}

export function renderTitleCard(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getGoogleAdsLayout(format);
  const card = layout.titleCard;

  const minCardWidth = card.minWidth 
  const maxCardWidth = card.maxWidth 
  const minCardHeight = card.minHeight 
  const maxCardHeight = card.maxHeight 

  const inlineGuard = getInlineGuard(format);
  const blockGuard = 4;

  /**
   * maxWidth nie jest docelową szerokością apli.
   * To wyłącznie limit obszaru, w którym tekst może się łamać.
   * Rzeczywista szerokość karty jest liczona później:
   * najdłuższa linia + paddingi + mały guard.
   */
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

  const titleCharRatio = getTitleCharRatio(format);
  const subtitleCharRatio = 0.55;

  /**
   * Landscape ma najmniej miejsca w poziomie, więc dopuszczamy 4 linie,
   * nawet jeśli layout config ma jeszcze starszą wartość 3.
   */
  const titleMaxLines =
    format.id === "landscape_1200x628"
      ? Math.max(layout.title.maxLines, 4)
      : layout.title.maxLines;

  const subtitleMaxLines = layout.subtitle.maxLines;

  const subtitleFit = hasSubtitle
    ? fitTextBlock({
        text: creative.subtitle ?? "",
        maxWidth: maxContentWidth,
        maxHeight: Math.max(34, Math.round(maxContentHeight * 0.36)),
        maxLines: subtitleMaxLines,
        maxFontSize: layout.subtitle.fontSize,
        minFontSize: getSubtitleMinFontSize(format),
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
    maxLines: titleMaxLines,
    maxFontSize: layout.title.fontSize,
    minFontSize: getTitleMinFontSize(format),
    lineHeightRatio: layout.title.lineHeight / layout.title.fontSize,
    averageCharWidthRatio: titleCharRatio,
  });

  const hugCorrection = format.id === "landscape_1200x628" ? 0.92 : 0.94;

  const titleHugWidth = getHugLinesWidth({
    lines: titleFit.lines,
    fontSize: titleFit.fontSize,
    averageCharWidthRatio: titleCharRatio,
    correction: hugCorrection,
  });

  const subtitleHugWidth =
    subtitleFit && subtitleFit.lines.length
      ? getHugLinesWidth({
          lines: subtitleFit.lines,
          fontSize: subtitleFit.fontSize,
          averageCharWidthRatio: subtitleCharRatio,
          correction: hugCorrection,
        })
      : 0;

  const contentWidth = Math.max(titleHugWidth, subtitleHugWidth);

  const textBlockHeight =
    titleFit.height + (subtitleHeight ? gap + subtitleHeight : 0);

  /**
   * Figma Hug:
   * card = realna szerokość/wysokość tekstu + padding + guard,
   * ograniczona przez min/max z layoutu.
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

  const visualTextBlockHeight = getVisualTextBlockHeight({
    titleLineCount,
    titleFontSize: titleFit.fontSize,
    titleLineHeight: titleFit.lineHeight,
    subtitleLineCount,
    subtitleFontSize: subtitleFit?.fontSize ?? 0,
    subtitleLineHeight: subtitleFit?.lineHeight ?? 0,
    gap,
  });

  const groupCenterY =
    card.contentVerticalAlign === "top"
      ? card.y + card.paddingY + visualTextBlockHeight / 2
      : card.y + cardHeight / 2;

  const groupStartY = groupCenterY - visualTextBlockHeight / 2;

  const titleY = groupStartY + titleFit.fontSize / 2;

  const titleVisualHeight =
    titleLineCount > 0
      ? titleFit.fontSize + Math.max(0, titleLineCount - 1) * titleFit.lineHeight
      : 0;

  const subtitleY =
    subtitleFit && subtitleFit.lines.length
      ? groupStartY +
        titleVisualHeight +
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
      weight: 700,
      letterSpacing: -1.1,
      dominantBaseline: "middle",
      fontFamily: TITLE_FONT_FAMILY,
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
            weight: 500,
            letterSpacing: -0.4,
            dominantBaseline: "middle",
            fontFamily: BODY_FONT_FAMILY,
          })
        : ""
    }
  `;
}
