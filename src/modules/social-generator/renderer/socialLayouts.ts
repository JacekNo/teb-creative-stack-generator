import type {
  SocialFormatId,
  SocialLayoutDefinition,
} from '../types/social.types';

export const SOCIAL_DEFAULT_LAYOUT_ID = 'photo-top-content-bottom';

export const SOCIAL_LAYOUTS: Record<SocialFormatId, SocialLayoutDefinition> = {
  'square-1080': {
    id: SOCIAL_DEFAULT_LAYOUT_ID,
    formatId: 'square-1080',
    slots: {
      photo: {
        x: 56,
        y: 56,
        width: 968,
        height: 548,
      },
      partnerLogo: {
        x: 760,
        y: 88,
        width: 220,
        height: 92,
      },
      courseName: {
        x: 72,
        y: 648,
        width: 780,
        height: 210,
      },
      offerMode: {
        x: 72,
        y: 590,
        width: 260,
        height: 64,
      },
      benefit: {
        x: 72,
        y: 840,
        width: 720,
        height: 88,
      },
      price: {
        x: 72,
        y: 940,
        width: 190,
        height: 72,
      },
      startDate: {
        x: 280,
        y: 940,
        width: 250,
        height: 72,
      },
      city: {
        x: 720,
        y: 940,
        width: 260,
        height: 72,
      },
      brandLogo: {
        x: 72,
        y: 994,
        width: 178,
        height: 62,
      },
    },
  },

  'feed-4x5-1080': {
    id: SOCIAL_DEFAULT_LAYOUT_ID,
    formatId: 'feed-4x5-1080',
    slots: {
      photo: {
        x: 56,
        y: 56,
        width: 968,
        height: 690,
      },
      partnerLogo: {
        x: 760,
        y: 88,
        width: 220,
        height: 92,
      },
      courseName: {
        x: 72,
        y: 800,
        width: 820,
        height: 250,
      },
      offerMode: {
        x: 72,
        y: 728,
        width: 260,
        height: 64,
      },
      benefit: {
        x: 72,
        y: 1048,
        width: 760,
        height: 92,
      },
      price: {
        x: 72,
        y: 1160,
        width: 190,
        height: 72,
      },
      startDate: {
        x: 280,
        y: 1160,
        width: 250,
        height: 72,
      },
      city: {
        x: 720,
        y: 1160,
        width: 260,
        height: 72,
      },
      brandLogo: {
        x: 72,
        y: 1256,
        width: 178,
        height: 62,
      },
    },
  },

  'story-9x16-1080': {
    id: SOCIAL_DEFAULT_LAYOUT_ID,
    formatId: 'story-9x16-1080',
    slots: {
      photo: {
        x: 64,
        y: 284,
        width: 952,
        height: 760,
      },
      partnerLogo: {
        x: 756,
        y: 320,
        width: 220,
        height: 92,
      },
      courseName: {
        x: 72,
        y: 1100,
        width: 820,
        height: 270,
      },
      offerMode: {
        x: 72,
        y: 1028,
        width: 260,
        height: 64,
      },
      benefit: {
        x: 72,
        y: 1376,
        width: 760,
        height: 96,
      },
      price: {
        x: 72,
        y: 1498,
        width: 190,
        height: 72,
      },
      startDate: {
        x: 280,
        y: 1498,
        width: 250,
        height: 72,
      },
      city: {
        x: 72,
        y: 1588,
        width: 280,
        height: 72,
      },
      brandLogo: {
        x: 72,
        y: 1688,
        width: 178,
        height: 62,
      },
    },
  },
};

export function getSocialLayout(
  formatId: SocialFormatId,
): SocialLayoutDefinition {
  return SOCIAL_LAYOUTS[formatId];
}