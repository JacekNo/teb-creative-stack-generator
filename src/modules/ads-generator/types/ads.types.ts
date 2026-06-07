export type BrandKey = "kursy" | "medyczne" | "policealne" | "unknown";

export type OfferType = "SP" | "PKU" | "KKZ" | string;

export type ImageStatus = "mapped" | "missing" | "needs-review" | string;

export interface CourseRecord {
  record_id: string;
  source_sheet?: string;
  offer_type: OfferType;
  course_name_raw: string;
  course_title: string;
  course_subtitle?: string;
  duration?: string;
  brand_key: BrandKey;
  brand_label?: string;
  start_label?: string;
  partners?: string;
  claims?: string;
  advantages?: string;
  certificates?: string;
  social_headline?: string;
  social_subheadline?: string;
  image_file?: string;
  image_focus_x?: number;
  image_focus_y?: number;
  image_status?: ImageStatus;
  layout_variant?: string;
  length_class?: string;
  review_flags?: string;
  status?: string;
}

export interface CityRecord {
  city_id: string;
  city_raw: string;
  city: string;
  city_locative: string;
  city_display: string;
  preposition?: string;
  city_length_class?: string;
  address?: string;
  phone?: string;
  email?: string;
  review_flags?: string;
  city_code?: string;
}

export interface BrandToken {
  brand_key: Exclude<BrandKey, 'unknown'>;
  brand_label: string;
  source_offer_types?: string;
  primary: string;
  soft: string;
  text: string;
  logo?: string;
  notes?: string;
}

export interface ImageMapRecord {
  record_id: string;
  course_name_raw: string;
  offer_type: OfferType;
  brand_key: BrandKey;
  image_file: string;
  image_relative_path: string;
  image_source_relative_path?: string;
  image_status: ImageStatus;
  image_focus_x: number;
  image_focus_y: number;
  notes?: string;
}

export interface CampaignRecord {
  campaign_id: string;
  format_group: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  start_label?: string;
  price_info?: string;
  legal_note?: string;
  notes?: string;
}

export interface ResolvedCreativeInput {
  course: CourseRecord;
  city: CityRecord;
  brand: BrandToken;
  image: ImageMapRecord;
  campaign: CampaignRecord;

  courseId: string;
  cityId: string;
  brandKey: BrandKey;

  title: string;
  subtitle: string;
  cityDisplay: string;
  cta: string;

  imagePath: string;
  logoPath: string;
  colors: {
    primary: string;
    soft: string;
    text: string;
  };

  meta: {
    offerType: OfferType;
    layoutVariant: string;
    courseLengthClass: string;
    cityLengthClass: string;
    warnings: string[];
  };
}
