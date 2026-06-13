import type { PartnerData } from '../types/social.types';

export const SOCIAL_PARTNERS: Record<string, PartnerData> = {
  cisco: {
    partnerKey: 'cisco',
    name: 'Cisco Networking Academy',
    logoPath: '/creative-stack/logos/partners/cisco.svg',
    badgeStyle: 'white-card',
  },
};

export function getSocialPartner(partnerKey: string): PartnerData | undefined {
  return SOCIAL_PARTNERS[partnerKey];
}