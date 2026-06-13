import type { SocialFormatId } from '../types/social.types';

export type SocialFormatDefinition = {
  id: SocialFormatId;
  label: string;
  width: number;
  height: number;
  ratio: '1:1' | '4:5' | '9:16';
  safeZone?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export const SOCIAL_FORMATS: Record<SocialFormatId, SocialFormatDefinition> = {
  'square-1080': {
    id: 'square-1080',
    label: 'Post square 1080×1080',
    width: 1080,
    height: 1080,
    ratio: '1:1',
  },

  'feed-4x5-1080': {
    id: 'feed-4x5-1080',
    label: 'Feed portrait 1080×1350',
    width: 1080,
    height: 1350,
    ratio: '4:5',
  },

  'story-9x16-1080': {
    id: 'story-9x16-1080',
    label: 'Story / Reels 1080×1920',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    safeZone: {
      top: 270,
      right: 65,
      bottom: 384,
      left: 65,
    },
  },
};

export const SOCIAL_FORMAT_ORDER: SocialFormatId[] = [
  'square-1080',
  'feed-4x5-1080',
  'story-9x16-1080',
];

export function getSocialFormat(
  formatId: SocialFormatId,
): SocialFormatDefinition {
  return SOCIAL_FORMATS[formatId];
}