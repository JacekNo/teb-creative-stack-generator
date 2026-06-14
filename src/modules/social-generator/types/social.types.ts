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
  | 'courseFacts'
  | 'courseBadges'
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


export type SocialCourseNameParts = {
  main: string | TextFallbackValue;
  subtitle?: string | TextFallbackValue;
  modeLabel?: string | TextFallbackValue;
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

export type SocialCourseFactIcon =
  | 'clock'
  | 'calendar'
  | 'online'
  | 'info'
  | 'certificate'
  | 'none';

export type SocialCourseFactType =
  | 'duration'
  | 'hours'
  | 'educationLength'
  | 'schedule'
  | 'start'
  | 'online'
  | 'custom';

export type SocialCourseFact = {
  id: string;
  type: SocialCourseFactType;
  value: string | TextFallbackValue;
  label?: string | TextFallbackValue;
  icon?: SocialCourseFactIcon;
};

export type SocialCourseBadgeTone =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'green'
  | 'popular'
  | 'yellow'
  | 'online';

export type SocialCourseBadge = {
  id: string;
  label: string | TextFallbackValue;
  tone?: SocialCourseBadgeTone;
};

export type SocialCreativeData = {
  courseId: string;
  courseName: string;
  courseNameParts?: SocialCourseNameParts;
  brandKey: string;

  offerMode: OfferMode;
  offerModeLabel?: string;

  imageKey?: string;
  imagePath?: string;
  imageFocalPoint?: ImageFocalPoint;

  /**
   * Legacy campaign fields. They stay optional until the social renderer is
   * fully migrated to courseFacts/courseBadges.
   */
  benefit?: string | TextFallbackValue;
  priceLabel?: string | TextFallbackValue;
  startDateLabel?: string | TextFallbackValue;

  /**
   * Product/course information taken from the course page header.
   * This is the target model for social creatives.
   */
  courseFacts?: SocialCourseFact[];
  courseBadges?: SocialCourseBadge[];

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
    courseFacts?: SocialLayoutSlot;
    courseBadges?: SocialLayoutSlot;
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
  courseNameParts?: SocialCourseNameParts;
  imageKey?: string;

  offerMode: OfferMode;
  showOfferModeLabel: boolean;

  cityId?: string;
  showCity: boolean;

  benefit?: string;
  showBenefit: boolean;

  /**
   * Legacy price/start controls. They will be removed after the renderer
   * migrates to courseFacts/courseBadges.
   */
  priceLabel?: string;
  showPrice: boolean;

  startLabel?: string;
  showStart: boolean;

  courseFacts?: SocialCourseFact[];
  showCourseFacts: boolean;

  courseBadges?: SocialCourseBadge[];
  showCourseBadges: boolean;

  partner: SocialDraftPartner;

  layoutId: SocialLayoutPreset;
};
