import {
  buildImagePublicPath,
  getCourses,
  getImageMap,
  resolveBrandKey,
} from '../../ads-generator/utils/creativeResolver';
import type {
  CourseRecord,
  ImageMapRecord,
} from '../../ads-generator/types/ads.types';
import type {
  SocialCourseBadge,
  SocialCourseBadgeTone,
  SocialCourseFact,
  SocialCreativeData,
} from '../types/social.types';
import { getPrimarySocialPartner } from './partners';

const badgeToneOrder: SocialCourseBadgeTone[] = [
  'primary',
  'green',
  'light',
  'popular',
];

const imageMapByCourseId = new Map(
  getImageMap().map((image) => [image.record_id, image]),
);

function isOnlineCourse(course: CourseRecord): boolean {
  return (
    course.offer_type === 'PKU_ONLINE' ||
    course.course_name_raw.toLocaleLowerCase('pl').includes(' online')
  );
}

function normalizeOnlineTitle(value: string): string {
  return value.replace(/\s+online$/i, '').trim();
}

function normalizeBadgeLabel(value: string): string {
  const normalized = value.trim();

  if (/zaw[oó]d bez matury/i.test(normalized)) {
    return 'Nie wymagamy matury!';
  }

  if (/szybki start/i.test(normalized)) {
    return 'Szybki START';
  }

  return normalized.replace(/#(\d)/g, ' #$1');
}

function getCourseTitle(course: CourseRecord): string {
  return normalizeOnlineTitle(
    course.social_headline || course.course_title || course.course_name_raw,
  );
}

function getCourseSubtitle(course: CourseRecord): string {
  return normalizeOnlineTitle(
    course.social_subheadline || course.course_subtitle || '',
  );
}

function createCourseFacts(course: CourseRecord): SocialCourseFact[] {
  const facts: SocialCourseFact[] = [];

  if (course.duration) {
    facts.push({
      id: 'duration',
      type: 'duration',
      value: course.duration,
      label: 'czas trwania',
      icon: 'clock',
    });
  }

  if (course.start_label) {
    facts.push({
      id: 'start',
      type: 'start',
      value: course.start_label,
      label: 'start',
      icon: 'calendar',
    });
  }

  return facts;
}

function createCourseBadges(course: CourseRecord): SocialCourseBadge[] {
  const badges: SocialCourseBadge[] = [];

  if (isOnlineCourse(course)) {
    badges.push({
      id: 'online',
      label: 'nauka online',
      tone: 'online',
    });
  }

  const sourceBadges = [
    course.claims,
    course.advantages,
    course.certificates,
  ]
    .filter(Boolean)
    .flatMap((value) =>
      String(value)
        .split(';')
        .map(normalizeBadgeLabel)
        .filter(Boolean),
    );

  sourceBadges.slice(0, 4).forEach((label, index) => {
    badges.push({
      id: `badge-${index + 1}`,
      label,
      tone: badgeToneOrder[index % badgeToneOrder.length],
    });
  });

  return badges.slice(0, 5);
}

function createSocialPartner(course: CourseRecord) {
  const partner = getPrimarySocialPartner(course.partners);

  if (!partner) {
    return undefined;
  }

  return {
    key: partner.partnerKey,
    name: partner.name,
    logoPath: partner.logoPath,
  };
}

function createSocialCreativeFromCourse(
  course: CourseRecord,
  image: ImageMapRecord,
): SocialCreativeData {
  const title = getCourseTitle(course);
  const subtitle = getCourseSubtitle(course);
  const courseFacts = createCourseFacts(course);
  const courseBadges = createCourseBadges(course);
  const partner = createSocialPartner(course);
  const enabledComponents: SocialCreativeData['enabledComponents'] = [
    'photo',
    'courseName',
    'brandLogo',
  ];

  if (courseFacts.length > 0) {
    enabledComponents.push('courseFacts');
  }

  if (courseBadges.length > 0) {
    enabledComponents.push('courseBadges');
  }

  if (partner) {
    enabledComponents.push('partnerLogo');
  }

  return {
    courseId: course.record_id,
    courseName: [title, subtitle].filter(Boolean).join(' '),
    courseNameParts: {
      main: title,
      subtitle,
    },
    brandKey: resolveBrandKey(course, image),
    offerMode: isOnlineCourse(course) ? 'online' : 'stationary',
    imageKey: image.record_id,
    imagePath: buildImagePublicPath(image),
    imageFocalPoint: {
      x: image.image_focus_x,
      y: image.image_focus_y,
    },
    courseFacts,
    courseBadges,
    partner,
    enabledComponents,
  };
}

export function getSocialCreativeCatalog(): SocialCreativeData[] {
  return getCourses()
    .map((course) => {
      const image = imageMapByCourseId.get(course.record_id);

      if (!image) {
        return undefined;
      }

      return createSocialCreativeFromCourse(course, image);
    })
    .filter((creative): creative is SocialCreativeData => Boolean(creative));
}

export const socialCreativeCatalog = getSocialCreativeCatalog();
