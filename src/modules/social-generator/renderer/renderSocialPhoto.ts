import { publicAssetPath } from '../../creative-stack/utils/publicAssetPath';
import type {
  SocialCreativeData,
  SocialLayoutSlot,
} from '../types/social.types';
import { SOCIAL_COMPONENT_STYLES } from './socialComponentStyles';

export type RenderSocialPhotoOptions = {
  creative: SocialCreativeData;
  slot: SocialLayoutSlot;
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
}: RenderSocialPhotoOptions): string {
  if (!creative.enabledComponents.includes('photo')) {
    return '';
  }

  const style = SOCIAL_COMPONENT_STYLES.photo.default;
  const clipPathId = createClipPathId(creative.courseId);

  const imageHref = creative.imagePath
  ? publicAssetPath(creative.imagePath)
  : undefined;
  console.log('Social photo path debug:', {
  rawImagePath: creative.imagePath,
  imageHref,
});

  if (!imageHref) {
    return `
      <g data-component="social-photo-placeholder">
        <rect
          x="${slot.x}"
          y="${slot.y}"
          width="${slot.width}"
          height="${slot.height}"
          rx="${style.radius}"
          fill="#EAF1FF"
        />
        <text
          x="${slot.x + 36}"
          y="${slot.y + 64}"
          font-family="Roc Grotesk, Inter, Arial, sans-serif"
          font-size="28"
          font-weight="700"
          fill="#102D69"
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
        fill="#EAF1FF"
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