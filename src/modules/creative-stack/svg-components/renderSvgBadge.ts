import { renderSvgTextBlock } from './renderSvgTextBlock';

export type SvgBadgeOptions = {
  x: number;
  y: number;
  text: string;

  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  letterSpacing?: number;

  paddingX: number;
  paddingY: number;
  radius: number;

  fill: string;
  color: string;

  borderColor?: string;
  borderWidth?: number;

  minWidth?: number;
  maxWidth?: number;

  className?: string;
  dataComponent?: string;
};

export type SvgBadgeResult = {
  svg: string;
  width: number;
  height: number;
  didOverflow: boolean;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}

export function renderSvgBadge(options: SvgBadgeOptions): SvgBadgeResult {
  const {
    x,
    y,
    text,
    fontFamily,
    fontSize,
    fontWeight = 700,
    letterSpacing,
    paddingX,
    paddingY,
    radius,
    fill,
    color,
    borderColor,
    borderWidth = 0,
    minWidth = 0,
    maxWidth,
    className,
    dataComponent = 'svg-badge',
  } = options;

  const estimatedTextWidth = estimateTextWidth(text, fontSize);
  const naturalWidth = estimatedTextWidth + paddingX * 2;
  const width = Math.max(
    minWidth,
    typeof maxWidth === 'number' ? Math.min(naturalWidth, maxWidth) : naturalWidth,
  );
  const height = fontSize + paddingY * 2;

  const textWidth = Math.max(0, width - paddingX * 2);
  const textBaselineY = y + paddingY + fontSize * 0.78;

  const textBlock = renderSvgTextBlock({
    x: x + paddingX,
    y: textBaselineY,
    width: textWidth,
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    fill: color,
    maxLines: 1,
    dataComponent: `${dataComponent}-text`,
  });

  const strokeAttributes =
    borderColor && borderWidth > 0
      ? `stroke="${borderColor}" stroke-width="${borderWidth}"`
      : '';

  const classAttribute = className ? ` class="${escapeXml(className)}"` : '';

  const svg = `
    <g data-component="${escapeXml(dataComponent)}"${classAttribute}>
      <rect
        x="${x}"
        y="${y}"
        width="${width}"
        height="${height}"
        rx="${radius}"
        fill="${fill}"
        ${strokeAttributes}
      />
      ${textBlock.svg}
    </g>
  `;

  return {
    svg,
    width,
    height,
    didOverflow: textBlock.didOverflow || naturalWidth > width,
  };
}