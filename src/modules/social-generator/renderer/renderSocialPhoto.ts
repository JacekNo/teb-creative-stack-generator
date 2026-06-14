import { publicAssetPath } from '../../creative-stack/utils/publicAssetPath';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import type { SocialComponentStyles } from './socialComponentStyles';

export type RenderSocialPhotoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
  styles: SocialComponentStyles;
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function createClipPathId(courseId: string): string {
  return `social-photo-clip-${courseId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function createBottomLeftRoundedPath({
  x,
  y,
  width,
  height,
  radius,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}): string {
  const cornerRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
  const right = x + width;
  const bottom = y + height;

  return [
    `M ${x} ${y}`,
    `H ${right}`,
    `V ${bottom}`,
    `H ${x + cornerRadius}`,
    `Q ${x} ${bottom} ${x} ${bottom - cornerRadius}`,
    `V ${y}`,
    'Z',
  ].join(' ');
}

function getFocalPointAlignment(value: number | undefined, axis: 'x' | 'y'): string {
  const normalized = typeof value === 'number' ? value : 0.5;

  if (axis === 'x') {
    if (normalized <= 0.33) {
      return 'xMin';
    }

    if (normalized >= 0.67) {
      return 'xMax';
    }

    return 'xMid';
  }

  if (normalized <= 0.33) {
    return 'YMin';
  }

  if (normalized >= 0.67) {
    return 'YMax';
  }

  return 'YMid';
}

function getPhotoPreserveAspectRatio(creative: SocialCreativeData): string {
  const focalPoint = creative.imageFocalPoint;
  const xAlign = getFocalPointAlignment(focalPoint?.x, 'x');
  const yAlign = getFocalPointAlignment(focalPoint?.y, 'y');

  return `${xAlign}${yAlign} slice`;
}

export function renderSocialPhoto({
  creative,
  slot,
  styles,
}: RenderSocialPhotoOptions): string {
  if (!creative.enabledComponents.includes('photo')) {
    return '';
  }

  const style = styles.photo.default;
  const clipPathId = createClipPathId(creative.courseId);
  const imageHref = creative.imagePath
    ? publicAssetPath(creative.imagePath)
    : undefined;
  const photoPath = createBottomLeftRoundedPath({
    x: slot.x,
    y: slot.y,
    width: slot.width,
    height: slot.height,
    radius: style.radius,
  });
  const preserveAspectRatio = getPhotoPreserveAspectRatio(creative);

  if (!imageHref) {
    return `
      <g data-component="social-photo-placeholder">
        <path
          d="${photoPath}"
          fill="${style.placeholderBackground}"
        />
        <text
          x="${slot.x + styles.scale.space.lg}"
          y="${slot.y + styles.scale.space.xl}"
          font-family="Roc Grotesk, Inter, Arial, sans-serif"
          font-size="${styles.scale.font.body}"
          font-weight="700"
          fill="${style.placeholderText}"
        >Brak zdjęcia</text>
      </g>
    `;
  }

  return `
    <g data-component="social-photo">
      <defs>
        <clipPath id="${clipPathId}">
          <path d="${photoPath}" />
        </clipPath>
      </defs>

      <path
        d="${photoPath}"
        fill="${style.placeholderBackground}"
      />

      <image
        href="${escapeXml(imageHref)}"
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        preserveAspectRatio="${preserveAspectRatio}"
        clip-path="url(#${clipPathId})"
      />
    </g>
  `;
}
