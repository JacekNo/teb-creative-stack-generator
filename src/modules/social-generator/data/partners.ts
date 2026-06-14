import type { PartnerData } from '../types/social.types';

export const SOCIAL_PARTNERS: Record<string, PartnerData> = {
  '3shape': {
    partnerKey: '3shape',
    name: '3shape',
    logoPath: '/creative-stack/logos/partners/3shape.svg',
    badgeStyle: 'white-card',
  },
  bielenda: {
    partnerKey: 'bielenda',
    name: 'Bielenda PROFESSIONAL',
    logoPath: '/creative-stack/logos/partners/bielenda-professional.svg',
    badgeStyle: 'white-card',
  },
  canon: {
    partnerKey: 'canon',
    name: 'Canon',
    logoPath: '/creative-stack/logos/partners/canon.svg',
    badgeStyle: 'white-card',
  },
  cisco: {
    partnerKey: 'cisco',
    name: 'Cisco Networking Academy',
    logoPath: '/creative-stack/logos/partners/cisco.svg',
    badgeStyle: 'white-card',
  },
  'denon-dental': {
    partnerKey: 'denon-dental',
    name: 'DENON DENTAL',
    logoPath: '/creative-stack/logos/partners/denon-dental.svg',
    badgeStyle: 'white-card',
  },
  dietetykpro: {
    partnerKey: 'dietetykpro',
    name: 'dietetykpro',
    logoPath: '/creative-stack/logos/partners/dietetykpro.svg',
    badgeStyle: 'white-card',
  },
  ecolab: {
    partnerKey: 'ecolab',
    name: 'ECOLAB',
    logoPath: '/creative-stack/logos/partners/ecolab.svg',
    badgeStyle: 'white-card',
  },
  felg: {
    partnerKey: 'felg',
    name: 'FELG',
    logoPath: '/creative-stack/logos/partners/felg.svg',
    badgeStyle: 'white-card',
  },
  gemini: {
    partnerKey: 'gemini',
    name: 'Gemini Polska',
    logoPath: '/creative-stack/logos/partners/gemini-polska.svg',
    badgeStyle: 'white-card',
  },
  habys: {
    partnerKey: 'habys',
    name: 'HABYS',
    logoPath: '/creative-stack/logos/partners/habys.svg',
    badgeStyle: 'white-card',
  },
  inglot: {
    partnerKey: 'inglot',
    name: 'INGLOT',
    logoPath: '/creative-stack/logos/partners/inglot.svg',
    badgeStyle: 'white-card',
  },
  insert: {
    partnerKey: 'insert',
    name: 'InsERT',
    logoPath: '/creative-stack/logos/partners/insert.svg',
    badgeStyle: 'white-card',
  },
  'interton-gn': {
    partnerKey: 'interton-gn',
    name: 'Interton GN',
    logoPath: '/creative-stack/logos/partners/interton-gn.svg',
    badgeStyle: 'white-card',
  },
  kamsoft: {
    partnerKey: 'kamsoft',
    name: 'KAMSOFT',
    logoPath: '/creative-stack/logos/partners/kamsoft.svg',
    badgeStyle: 'white-card',
  },
  kryolan: {
    partnerKey: 'kryolan',
    name: 'KRYOLAN',
    logoPath: '/creative-stack/logos/partners/kryolan.svg',
    badgeStyle: 'white-card',
  },
  'oral-b': {
    partnerKey: 'oral-b',
    name: 'Oral-B',
    logoPath: '/creative-stack/logos/partners/oral-b.svg',
    badgeStyle: 'white-card',
  },
  podopharm: {
    partnerKey: 'podopharm',
    name: 'PODOPHARM',
    logoPath: '/creative-stack/logos/partners/podopharm.svg',
    badgeStyle: 'white-card',
  },
  progrupa: {
    partnerKey: 'progrupa',
    name: 'ProGrupa',
    logoPath: '/creative-stack/logos/partners/progrupa.svg',
    badgeStyle: 'white-card',
  },
  promedica24: {
    partnerKey: 'promedica24',
    name: 'PROMEDICA 24',
    logoPath: '/creative-stack/logos/partners/promedica-24.svg',
    badgeStyle: 'white-card',
  },
  salesmanago: {
    partnerKey: 'salesmanago',
    name: 'SALESmanago',
    logoPath: '/creative-stack/logos/partners/salesmanago.svg',
    badgeStyle: 'white-card',
  },
  schwarzkopf: {
    partnerKey: 'schwarzkopf',
    name: 'Schwarzkopf Professional',
    logoPath: '/creative-stack/logos/partners/schwarzkopf-professional.svg',
    badgeStyle: 'white-card',
  },
  semilac: {
    partnerKey: 'semilac',
    name: 'Semilac Professional',
    logoPath: '/creative-stack/logos/partners/semilac-professional.svg',
    badgeStyle: 'white-card',
  },
  vita: {
    partnerKey: 'vita',
    name: 'VITA',
    logoPath: '/creative-stack/logos/partners/vita.svg',
    badgeStyle: 'white-card',
  },
};

export function getSocialPartner(partnerKey: string): PartnerData | undefined {
  return SOCIAL_PARTNERS[partnerKey];
}
