import coursesRaw from '../data/courses.normalized.json';
import citiesRaw from '../data/cities.normalized.json';
import brandsRaw from '../data/brands.json';
import imageMapRaw from '../data/image-map.final.json';
import campaignsRaw from '../data/campaigns.json';

import type {
  BrandKey,
  BrandToken,
  CampaignRecord,
  CityRecord,
  CourseRecord,
  ImageMapRecord,
  ResolvedCreativeInput,
} from '../types/ads.types';

const courses = coursesRaw as CourseRecord[];
const cities = citiesRaw as CityRecord[];
const brands = brandsRaw as BrandToken[];
const imageMap = imageMapRaw as ImageMapRecord[];
const campaigns = campaignsRaw as CampaignRecord[];

function normalizePublicPath(path: string): string {
  return path.replaceAll('\\', '/').replace(/^\/+/, '');
}

function resolveCta(template: string | undefined, city: CityRecord): string {
  if (!template) return '';

  return template
    .replaceAll('{{city_display}}', city.city_display)
    .replaceAll('{{city}}', city.city)
    .replaceAll('{{city_locative}}', city.city_locative);
}

export function getCourses(): CourseRecord[] {
  return courses;
}

export function getCities(): CityRecord[] {
  return cities;
}

export function getBrands(): BrandToken[] {
  return brands;
}

export function getImageMap(): ImageMapRecord[] {
  return imageMap;
}

export function findCourse(courseId: string): CourseRecord | undefined {
  return courses.find((course) => course.record_id === courseId);
}

export function findCity(cityId: string): CityRecord | undefined {
  return cities.find((city) => city.city_id === cityId);
}

export function findImage(courseId: string): ImageMapRecord | undefined {
  return imageMap.find((image) => image.record_id === courseId);
}

export function findCampaign(campaignId = 'google_ads_2026_default'): CampaignRecord | undefined {
  return campaigns.find((campaign) => campaign.campaign_id === campaignId);
}

export function resolveBrandKey(course: CourseRecord, image?: ImageMapRecord): BrandKey {
  if (course.brand_key && course.brand_key !== 'unknown') {
    return course.brand_key;
  }

  if (image?.brand_key && image.brand_key !== 'unknown') {
    return image.brand_key;
  }

  return 'unknown';
}

export function findBrand(brandKey: BrandKey): BrandToken | undefined {
  if (brandKey === 'unknown') return undefined;

  return brands.find((brand) => brand.brand_key === brandKey);
}

export function buildImagePublicPath(image: ImageMapRecord): string {
  const normalizedPath = normalizePublicPath(image.image_relative_path);
  return `/creative-stack/images/${normalizedPath}`;
}

export function resolveCreativeInput(
  courseId: string,
  cityId: string,
  campaignId = 'google_ads_2026_default',
): ResolvedCreativeInput {
  const warnings: string[] = [];

  const course = findCourse(courseId);
  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }

  const city = findCity(cityId);
  if (!city) {
    throw new Error(`City not found: ${cityId}`);
  }

  const image = findImage(courseId);
  if (!image) {
    throw new Error(`Image mapping not found for course: ${courseId}`);
  }

  const brandKey = resolveBrandKey(course, image);
  const brand = findBrand(brandKey);

  if (!brand) {
    throw new Error(`Brand not found or unknown for course: ${courseId}`);
  }

  const campaign = findCampaign(campaignId);
  if (!campaign) {
    throw new Error(`Campaign not found: ${campaignId}`);
  }

  if (course.brand_key === 'unknown') {
    warnings.push(`Course brand is unknown. Resolved brand from image map: ${brandKey}.`);
  }

  if (image.image_status !== 'mapped') {
    warnings.push(`Image status is: ${image.image_status}.`);
  }

  if (course.review_flags) {
    warnings.push(`Course review flags: ${course.review_flags}.`);
  }

  if (city.review_flags) {
    warnings.push(`City review flags: ${city.review_flags}.`);
  }

  const title = course.course_title || course.course_name_raw;
  const subtitle = course.course_subtitle || '';
  const cityDisplay = city.city_display;
  const cta = resolveCta(campaign.cta, city);

  return {
  course,
  city,
  brand,
  image,
  campaign,

  courseId,
  cityId,
  brandKey: brand.brand_key,

  title,
  subtitle,
  cityDisplay,
  cta,

  imagePath: buildImagePublicPath(image),
  logoPath: buildLogoPublicPath(brand),

  colors: {
    primary: brand.primary,
    soft: brand.soft,
    text: brand.text,
  },

  meta: {
    offerType: course.offer_type,
    layoutVariant: course.layout_variant || 'standard',
    courseLengthClass: course.length_class || 'unknown',
    cityLengthClass: city.city_length_class || 'unknown',
    warnings,
  },
};
}

export function resolveTestCreatives(): ResolvedCreativeInput[] {
  return [
    resolveCreativeInput('pku-barber', 'pila'),
    resolveCreativeInput('sp-technik-dentystyczny-z-technologia-cad-cam', 'poznan'),
    resolveCreativeInput(
      'sp-technik-uslug-kosmetycznych-z-certyfikatem-bielenda-professional',
      'piotrkow-trybunalski',
    ),
  ];
}

export function buildLogoPublicPath(brand?: BrandToken): string {
  const logoFile = brand?.logo || 'teb-edukacja.svg';

  return `/creative-stack/logos/${logoFile}`;
}