import type { PartnerData } from '../types/social.types';

function createWhiteCardPartner(
  partnerKey: string,
  name: string,
  logoFile: string,
): PartnerData {
  return {
    partnerKey,
    name,
    logoPath: `/creative-stack/logos/partners/${logoFile}`,
    badgeStyle: 'white-card',
  };
}

export const SOCIAL_PARTNERS: Record<string, PartnerData> = {
  '3shape': createWhiteCardPartner('3shape', '3shape', '3shape.svg'),
  'altkom-akademia': createWhiteCardPartner(
    'altkom-akademia',
    'Altkom Akademia',
    'altkom-akademia.svg',
  ),
  bego: createWhiteCardPartner('bego', 'BEGO', 'bego.svg'),
  bielenda: createWhiteCardPartner(
    'bielenda',
    'Bielenda PROFESSIONAL',
    'bielenda-professional.svg',
  ),
  canon: createWhiteCardPartner('canon', 'Canon', 'canon.svg'),
  cisco: createWhiteCardPartner(
    'cisco',
    'Cisco Networking Academy',
    'cisco.svg',
  ),
  colgate: createWhiteCardPartner('colgate', 'Colgate', 'colgate.svg'),
  'denon-dental': createWhiteCardPartner(
    'denon-dental',
    'DENON DENTAL',
    'denon-dental.svg',
  ),
  dietetykpro: createWhiteCardPartner(
    'dietetykpro',
    'dietetykpro',
    'dietetykpro.svg',
  ),
  ecolab: createWhiteCardPartner('ecolab', 'ECOLAB', 'ecolab.svg'),
  fagron: createWhiteCardPartner('fagron', 'Fagron', 'fagron.svg'),
  farmona: createWhiteCardPartner('farmona', 'Farmona', 'farmona.svg'),
  felg: createWhiteCardPartner('felg', 'FELG', 'felg.svg'),
  gameup: createWhiteCardPartner('gameup', 'GameUp', 'gameup.svg'),
  gemini: createWhiteCardPartner(
    'gemini',
    'Gemini Polska',
    'gemini-polska.svg',
  ),
  habys: createWhiteCardPartner('habys', 'HABYS', 'habys.svg'),
  inglot: createWhiteCardPartner('inglot', 'INGLOT', 'inglot.svg'),
  insert: createWhiteCardPartner('insert', 'InsERT', 'insert.svg'),
  intel: createWhiteCardPartner('intel', 'Intel', 'intel.svg'),
  'interton-gn': createWhiteCardPartner(
    'interton-gn',
    'Interton GN',
    'interton-gn.svg',
  ),
  kamsoft: createWhiteCardPartner('kamsoft', 'KAMSOFT', 'kamsoft.svg'),
  kind: createWhiteCardPartner('kind', 'Kind', 'kind.svg'),
  kryolan: createWhiteCardPartner('kryolan', 'KRYOLAN', 'kryolan.svg'),
  microsoft: createWhiteCardPartner(
    'microsoft',
    'Microsoft',
    'microsoft.svg',
  ),
  morebananas: createWhiteCardPartner(
    'morebananas',
    'More Bananas',
    'morebananas.svg',
  ),
  msi: createWhiteCardPartner('msi', 'MSI', 'msi.svg'),
  'oral-b': createWhiteCardPartner('oral-b', 'Oral-B', 'oral-b.svg'),
  podopharm: createWhiteCardPartner(
    'podopharm',
    'PODOPHARM',
    'podopharm.svg',
  ),
  progrupa: createWhiteCardPartner('progrupa', 'ProGrupa', 'progrupa.svg'),
  promedica24: createWhiteCardPartner(
    'promedica24',
    'PROMEDICA 24',
    'promedica-24.svg',
  ),
  protefix: createWhiteCardPartner('protefix', 'Protefix', 'protefix.svg'),
  salesmanago: createWhiteCardPartner(
    'salesmanago',
    'SALESmanago',
    'salesmanago.svg',
  ),
  schwarzkopf: createWhiteCardPartner(
    'schwarzkopf',
    'Schwarzkopf Professional',
    'schwarzkopf-professional.svg',
  ),
  semilac: createWhiteCardPartner(
    'semilac',
    'Semilac Professional',
    'semilac-professional.svg',
  ),
  vita: createWhiteCardPartner('vita', 'VITA', 'vita.svg'),
  webmetric: createWhiteCardPartner('webmetric', 'webmetric', 'webmetric.svg'),
  zabka: createWhiteCardPartner('zabka', 'zabka', 'zabka.svg'),
};

const SOCIAL_PARTNER_ALIASES: Record<string, string> = {
  'altkom-akademia': 'altkom-akademia',
  'altkom-akademia-sa': 'altkom-akademia',
  'bielenda-professional': 'bielenda',
  'cisco-networking-academy': 'cisco',
  'denon-dental': 'denon-dental',
  'gemini-polska': 'gemini',
  'interton-gn': 'interton-gn',
  'oral-b': 'oral-b',
  'promedica-24': 'promedica24',
  'promedica24': 'promedica24',
  'salesmanago': 'salesmanago',
  'schwarzkopf-professional': 'schwarzkopf',
  'semilac-professional': 'semilac',
  'zabka': 'zabka',
};

function normalizePartnerKey(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getSocialPartner(partnerKey: string): PartnerData | undefined {
  const normalizedKey = normalizePartnerKey(partnerKey);
  const resolvedKey = SOCIAL_PARTNER_ALIASES[normalizedKey] ?? normalizedKey;

  return SOCIAL_PARTNERS[partnerKey] ?? SOCIAL_PARTNERS[resolvedKey];
}

export function getPrimarySocialPartner(
  partnersValue: string | undefined,
): PartnerData | undefined {
  if (!partnersValue) {
    return undefined;
  }

  const partnerNames = partnersValue
    .split(';')
    .map((partnerName) => partnerName.trim())
    .filter(Boolean);

  for (const partnerName of partnerNames) {
    const partner = getSocialPartner(partnerName);

    if (partner) {
      return partner;
    }
  }

  return undefined;
}
