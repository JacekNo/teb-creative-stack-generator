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

  if (!imageHref) {
    return `
      <g data-component="social-photo-placeholder">
        <rect
          x="${slot.x}"
          y="${slot.y}"
          width="${slot.width}"
          height="${slot.height}"
          rx="${style.radius}"
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
          <rect
            x="${slot.x}"
            y="${slot.y}"
            width="${slot.width}"
            height="${slot.height}"
            rx="${style.radius}"
          />
        </clipPath>
      </defs>

      <rect
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        rx="${style.radius}"
        fill="${style.placeholderBackground}"
      />

      <image
        href="${escapeXml(imageHref)}"
        x="${slot.x}"
        y="${slot.y}"
        width="${slot.width}"
        height="${slot.height}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#${clipPathId})"
      />
    </g>
  `;
}
