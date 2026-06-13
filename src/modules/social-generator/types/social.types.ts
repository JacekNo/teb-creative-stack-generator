export type SocialFormatId =
  | 'square-1080'
  | 'feed-4x5-1080'
  | 'story-9x16-1080';

export type OfferMode = 'stationary' | 'online';

export type SocialComponentId =
  | 'photo'
  | 'courseName'
  | 'offerMode'
  | 'benefit'
  | 'price'
  | 'startDate'
  | 'city'
  | 'partnerLogo'
  | 'brandLogo'
  | 'safeZone'
  | 'debug';

export type SocialComponentPriority =
  | 'required'
  | 'recommended'
  | 'optional';

export type SocialLayoutPreset =
  | 'photo-top-content-bottom'
  | 'photo-background-card'
  | 'split-photo-content'
  | 'story-editorial'
  | 'minimal-course-card';

export type PartnerBadgePlacement =
  | 'photo-top-right'
  | 'photo-top-left'
  | 'photo-bottom-right';

export type PartnerSource =
  | 'from-course'
  | 'selected'
  | 'custom'
  | 'hidden';

export type ImageFocalPoint = {
  x: number;
  y: number;
};

export type TextFallbackValue = {
  full: string;
  short?: string;
  compact?: string;
};

export type PartnerData = {
  partnerKey: string;
  name: string;
  logoPath: string;
  badgeStyle?: 'white-card';
};

export type SocialCreativePartner = {
  key: string;
  name: string;
  logoPath: string;
};

export type SocialCreativeData = {
  courseId: string;
  courseName: string;
  brandKey: string;

  offerMode: OfferMode;
  offerModeLabel?: string;

  imageKey?: string;
  imagePath?: string;
  imageFocalPoint?: ImageFocalPoint;

  benefit?: string | TextFallbackValue;
  priceLabel?: string | TextFallbackValue;
  startDateLabel?: string | TextFallbackValue;

  cityId?: string;
  cityName?: string;

  partner?: SocialCreativePartner;

  enabledComponents: SocialComponentId[];
};

export type SocialLayoutSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SocialLayoutDefinition = {
  id: SocialLayoutPreset;
  formatId: SocialFormatId;

  slots: {
    photo: SocialLayoutSlot;
    courseName: SocialLayoutSlot;
    offerMode?: SocialLayoutSlot;
    benefit?: SocialLayoutSlot;
    price?: SocialLayoutSlot;
    startDate?: SocialLayoutSlot;
    city?: SocialLayoutSlot;
    partnerLogo?: SocialLayoutSlot;
    brandLogo: SocialLayoutSlot;
  };
};

export type SocialDraftPartner = {
  enabled: boolean;
  source: PartnerSource;
  partnerKey?: string;
  customPartner?: {
    name: string;
    logoPath: string;
    fileName?: string;
  };
};

export type SocialCreativeDraft = {
  id: string;

  courseId?: string;
  formatIds: SocialFormatId[];

  courseName: string;
  imageKey?: string;

  offerMode: OfferMode;
  showOfferModeLabel: boolean;

  cityId?: string;
  showCity: boolean;

  benefit?: string;
  showBenefit: boolean;

  priceLabel?: string;
  showPrice: boolean;

  startLabel?: string;
  showStart: boolean;

  partner: SocialDraftPartner;

  layoutId: SocialLayoutPreset;
};