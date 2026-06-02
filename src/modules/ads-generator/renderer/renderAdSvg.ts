import type { ResolvedCreativeInput } from "../types/ads.types";
import type { GoogleAdsFormat } from "./googleAdsFormats";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function splitTextToLines(
  text: string,
  maxChars: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

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

function renderTextLines(options: {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  lineHeight: number;
  fill: string;
  weight?: number;
}): string {
  const { lines, x, y, fontSize, lineHeight, fill, weight = 800 } = options;

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
          letter-spacing="-1.5"
          fill="${fill}"
        >${escapeXml(line)}</text>
      `;
    })
    .join("");
}

function getLayout(format: GoogleAdsFormat) {
  if (format.id === "landscape_1200x628") {
    return {
      image: { x: 656, y: 0, width: 544, height: 628 },
      panel: { x: 0, y: 0, width: 700, height: 628 },
      title: {
        x: 74,
        y: 188,
        maxChars: 24,
        maxLines: 3,
        fontSize: 58,
        lineHeight: 62,
      },
      subtitle: {
        x: 74,
        y: 394,
        maxChars: 36,
        maxLines: 2,
        fontSize: 30,
        lineHeight: 36,
      },
      city: { x: 74, y: 502, fontSize: 28 },
      logo: { x: 74, y: 72 },
    };
  }

  if (format.id === "portrait_960x1200") {
    return {
      image: { x: 0, y: 0, width: 960, height: 610 },
      panel: { x: 0, y: 520, width: 960, height: 680 },
      title: {
        x: 76,
        y: 720,
        maxChars: 22,
        maxLines: 4,
        fontSize: 62,
        lineHeight: 66,
      },
      subtitle: {
        x: 76,
        y: 990,
        maxChars: 34,
        maxLines: 2,
        fontSize: 31,
        lineHeight: 38,
      },
      city: { x: 76, y: 1102, fontSize: 30 },
      logo: { x: 76, y: 640 },
    };
  }

  return {
    image: { x: 0, y: 0, width: 1200, height: 660 },
    panel: { x: 0, y: 560, width: 1200, height: 640 },
    title: {
      x: 86,
      y: 770,
      maxChars: 24,
      maxLines: 4,
      fontSize: 68,
      lineHeight: 72,
    },
    subtitle: {
      x: 86,
      y: 1036,
      maxChars: 38,
      maxLines: 2,
      fontSize: 34,
      lineHeight: 40,
    },
    city: { x: 86, y: 1138, fontSize: 32 },
    logo: { x: 86, y: 676 },
  };
}

export function renderAdSvg(
  creative: ResolvedCreativeInput,
  format: GoogleAdsFormat,
): string {
  const layout = getLayout(format);

  const titleLines = splitTextToLines(
    creative.title,
    layout.title.maxChars,
    layout.title.maxLines,
  );

  const subtitleLines = creative.subtitle
    ? splitTextToLines(
        creative.subtitle,
        layout.subtitle.maxChars,
        layout.subtitle.maxLines,
      )
    : [];

  const cityText = creative.cta || creative.cityDisplay;
  const logoPath =
    creative.logoPath || "/creative-stack/logos/teb-edukacja.svg";
  const logoWidth = 260;
  const logoHeight = 74;

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
        <clipPath id="imageClip-${format.id}">
          <rect
            x="${layout.image.x}"
            y="${layout.image.y}"
            width="${layout.image.width}"
            height="${layout.image.height}"
            rx="0"
          />
        </clipPath>

        <linearGradient id="photoShade-${format.id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.18" />
        </linearGradient>
      </defs>

      <rect width="${format.width}" height="${format.height}" fill="${creative.colors.soft}" />

      <image
        href="${creative.imagePath}"
        x="${layout.image.x}"
        y="${layout.image.y}"
        width="${layout.image.width}"
        height="${layout.image.height}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#imageClip-${format.id})"
      />

      <rect
        x="${layout.image.x}"
        y="${layout.image.y}"
        width="${layout.image.width}"
        height="${layout.image.height}"
        fill="url(#photoShade-${format.id})"
        clip-path="url(#imageClip-${format.id})"
      />

      <rect
        x="${layout.panel.x}"
        y="${layout.panel.y}"
        width="${layout.panel.width}"
        height="${layout.panel.height}"
        fill="${creative.colors.soft}"
      />

      <circle
        cx="${layout.panel.x + layout.panel.width - 80}"
        cy="${layout.panel.y + 80}"
        r="190"
        fill="${creative.colors.primary}"
        opacity="0.12"
      />

<rect
  x="${layout.logo.x}"
  y="${layout.logo.y - 56}"
  width="${logoWidth}"
  height="${logoHeight}"
  rx="37"
  fill="#ffffff"
  opacity="0.94"
/>

<image
  href="${logoPath}"
  x="${layout.logo.x + 24}"
  y="${layout.logo.y - 42}"
  width="${logoWidth - 48}"
  height="${logoHeight - 28}"
  preserveAspectRatio="xMidYMid meet"
/>

 

      ${renderTextLines({
        lines: titleLines,
        x: layout.title.x,
        y: layout.title.y,
        fontSize: layout.title.fontSize,
        lineHeight: layout.title.lineHeight,
        fill: creative.colors.text,
        weight: 900,
      })}

      ${
        subtitleLines.length
          ? renderTextLines({
              lines: subtitleLines,
              x: layout.subtitle.x,
              y: layout.subtitle.y,
              fontSize: layout.subtitle.fontSize,
              lineHeight: layout.subtitle.lineHeight,
              fill: creative.colors.primary,
              weight: 800,
            })
          : ""
      }

      <rect
        x="${layout.city.x}"
        y="${layout.city.y - 44}"
        width="${Math.min(520, cityText.length * 17 + 56)}"
        height="62"
        rx="31"
        fill="${creative.colors.primary}"
      />

      <text
        x="${layout.city.x + 28}"
        y="${layout.city.y - 4}"
        font-family="Roc Grotesk, Arial, sans-serif"
        font-size="${layout.city.fontSize}"
        font-weight="900"
        fill="#ffffff"
      >${escapeXml(cityText)}</text>
    </svg>
  `;
}
