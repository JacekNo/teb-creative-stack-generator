import type { ResolvedCreativeInput } from '../types/ads.types';
import type { GoogleAdsFormat } from './googleAdsFormats';
import { getGoogleAdsLayout } from './googleAdsLayouts';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function splitTextToLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Math.ceil(text.length * fontSize * 0.55);
}

function renderTextLines(options: {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  lineHeight: number;
  fill: string;
  weight?: number;
  letterSpacing?: number;
}): string {
  const {
    lines,
    x,
    y,
    fontSize,
    lineHeight,
    fill,
    weight = 800,
    letterSpacing = -1.2,
  } = options;

  return lines
    .map((line, index) => {
      const lineY = y + index * lineHeight;

      return `
        <text
          x="${x}"
          y="${lineY}"
          font-family="Roc Grotesk, Arial, sans-serif"
          font-size="${fontSize}"
          font-weight="${weight}"
          letter-spacing="${letterSpacing}"
          fill="${fill}"
        >${escapeXml(line)}</text>
      `;
    })
    .join('');
}

function renderPattern(format: GoogleAdsFormat, color: string): string {
  return `
    <pattern
      id="brandPattern-${format.id}"
      width="74"
      height="74"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(0)"
    >
      <path
        d="M18 26 L36 12 L54 26 M36 12 V58"
        fill="none"
        stroke="${color}"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.15"
      />
    </pattern>
  `;
}

function renderTitleCard(creative: ResolvedCreativeInput, format: GoogleAdsFormat): string {
  const layout = getGoogleAdsLayout(format);

  const titleLines = splitTextToLines(
    creative.title,
    layout.title.maxChars,
    layout.title.maxLines,
  );

  const subtitleLines = creative.subtitle
    ? splitTextToLines(creative.subtitle, layout.subtitle.maxChars, layout.subtitle.maxLines)
    : [];

  return `
    <rect
      x="${layout.titleCard.x}"
      y="${layout.titleCard.y}"
      width="${layout.titleCard.width}"
      height="${layout.titleCard.height}"
      rx="${layout.titleCard.radius ?? 20}"
      fill="#ffffff"
      opacity="0.96"
    />

    ${renderTextLines({
      lines: titleLines,
      x: layout.title.x,
      y: layout.title.y,
      fontSize: layout.title.fontSize,
      lineHeight: layout.title.lineHeight,
      fill: creative.colors.text,
      weight: 900,
      letterSpacing: -1.3,
    })}

    ${
      subtitleLines.length
        ? renderTextLines({
            lines: subtitleLines,
            x: layout.subtitle.x,
            y: layout.subtitle.y,
            fontSize: layout.subtitle.fontSize,
            lineHeight: layout.subtitle.lineHeight,
            fill: creative.colors.text,
            weight: 700,
            letterSpacing: -0.5,
          })
        : ''
    }
  `;
}

function renderActionRow(creative: ResolvedCreativeInput, format: GoogleAdsFormat): string {
  const layout = getGoogleAdsLayout(format);
  const row = layout.actionRow;

  const logoPath = creative.logoPath || '/creative-stack/logos/teb-edukacja.svg';

  const ctaText = 'rozpocznij naukę';
  const cityText = creative.cityDisplay;

  const cityWidth = Math.min(
    row.city.maxWidth,
    Math.max(row.city.minWidth, estimateTextWidth(cityText, row.city.fontSize) + 42),
  );

  const ctaX = row.x;
  const cityX = ctaX + row.cta.width + row.gap;
  const logoX = cityX + cityWidth + row.gap;

  const radius = row.height / 2;

  return `
    <g id="action-row-${format.id}">
      <rect
        x="${ctaX}"
        y="${row.y}"
        width="${row.cta.width}"
        height="${row.height}"
        rx="${radius}"
        fill="#0941A1"
      />

      <text
        x="${ctaX + row.cta.width / 2}"
        y="${row.y + row.height / 2 + row.cta.fontSize * 0.34}"
        text-anchor="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${row.cta.fontSize}"
        font-weight="900"
        fill="#ffffff"
        letter-spacing="-0.4"
      >${escapeXml(ctaText)}</text>

      <rect
        x="${cityX}"
        y="${row.y}"
        width="${cityWidth}"
        height="${row.height}"
        rx="${radius}"
        fill="#ffffff"
        opacity="0.96"
      />

      <text
        x="${cityX + cityWidth / 2}"
        y="${row.y + row.height / 2 + row.city.fontSize * 0.34}"
        text-anchor="middle"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${row.city.fontSize}"
        font-weight="800"
        fill="#0941A1"
        letter-spacing="-0.2"
      >${escapeXml(cityText)}</text>

      <rect
        x="${logoX}"
        y="${row.y}"
        width="${row.logo.width}"
        height="${row.logo.height}"
        rx="${Math.min(16, radius)}"
        fill="#0941A1"
      />

      <image
        href="${logoPath}"
        x="${logoX + 18}"
        y="${row.y + 10}"
        width="${row.logo.width - 36}"
        height="${row.logo.height - 20}"
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  `;
}

export function renderAdSvg(creative: ResolvedCreativeInput, format: GoogleAdsFormat): string {
  const layout = getGoogleAdsLayout(format);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${format.width}"
      height="${format.height}"
      viewBox="0 0 ${format.width} ${format.height}"
      role="img"
      aria-label="${escapeXml(`${creative.title} ${creative.cityDisplay}`)}"
    >
      <defs>
        <clipPath id="photoClip-${format.id}">
          <rect
            x="${layout.photo.x}"
            y="${layout.photo.y}"
            width="${layout.photo.width}"
            height="${layout.photo.height}"
            rx="${layout.photo.radius ?? 0}"
          />
        </clipPath>

        <linearGradient id="photoShade-${format.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.16" />
        </linearGradient>

        ${renderPattern(format, '#ffffff')}
      </defs>

      <rect
        x="${layout.background.x}"
        y="${layout.background.y}"
        width="${layout.background.width}"
        height="${layout.background.height}"
        fill="${creative.colors.primary}"
      />

      <rect
        x="${layout.background.x}"
        y="${layout.background.y}"
        width="${layout.background.width}"
        height="${layout.background.height}"
        fill="url(#brandPattern-${format.id})"
        opacity="0.58"
      />

      <image
        href="${creative.imagePath}"
        x="${layout.photo.x}"
        y="${layout.photo.y}"
        width="${layout.photo.width}"
        height="${layout.photo.height}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#photoClip-${format.id})"
      />

      <rect
        x="${layout.photo.x}"
        y="${layout.photo.y}"
        width="${layout.photo.width}"
        height="${layout.photo.height}"
        fill="url(#photoShade-${format.id})"
        clip-path="url(#photoClip-${format.id})"
      />

      ${renderTitleCard(creative, format)}

      ${renderActionRow(creative, format)}
    </svg>
  `;
}