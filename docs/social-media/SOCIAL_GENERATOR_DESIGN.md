# TEB Creative Stack Generator

## Dokument projektowy modułu Social Media — v0.1

### 1. Kontekst projektu

Projekt **TEB Creative Stack Generator** ma rozwijać się z gotowego generatora grafik Google Ads w szersze narzędzie do tworzenia materiałów marketingowych TEB. Etap Google Ads jest traktowany jako stabilny, działający moduł produkcyjny. Nowy etap dotyczy zaprojektowania osobnego modułu do generowania grafik social media.

Moduł social media nie powinien nadpisywać ani rozbudowywać bezpośrednio logiki Google Ads. Powinien powstać jako osobna warstwa, korzystająca ze wspólnych danych, resolverów, assetów, tokenów brandowych i mechanizmu renderowania SVG.

Główna zasada architektoniczna:

```txt
Google Ads zostaje jako działający moduł.
Social media budujemy obok.
Wspólne elementy stopniowo przenosimy do core creative-stack.
```

---

### 2. Cel modułu social media

Celem modułu social media jest generowanie zestawów grafik dla kierunków edukacyjnych TEB w formatach używanych w komunikacji social media.

Na etapie MVP generator działa na sztywnych danych. Nie budujemy jeszcze pełnego kreatora ani panelu edycji danych. Projektujemy jednak strukturę tak, aby w przyszłości można było przejść do trybu ręcznego składania materiałów z komponentów.

Docelowo moduł powinien obsługiwać:

* wybór kierunku,
* wybór formatu,
* dane kierunku,
* dane oferty,
* zdjęcie,
* nazwę kierunku,
* tryb oferty: online / stacjonarne,
* przewagę,
* cenę lub informację promocyjną,
* termin startu,
* opcjonalne miasto,
* logo TEB,
* logo partnera, jeśli kierunek ma partnera,
* eksport grafik do PNG / ZIP.

---

### 3. Zakres MVP

MVP modułu social media obejmuje:

```txt
1. Sztywne dane social.
2. Trzy formaty: 1080×1080, 1080×1350, 1080×1920.
3. Jeden roboczy layout bazowy.
4. Bazę komponentów SVG.
5. Resolver danych social.
6. Walidator jakości.
7. Render SVG.
8. Eksport PNG / ZIP.
9. Debug overlay dla safe zone i slotów.
```

Poza zakresem MVP:

```txt
1. Pełny kreator ręczny.
2. Backend.
3. Trwały zapis projektów.
4. Panel administracyjny danych.
5. Zaawansowana biblioteka layoutów.
6. Eksport video / reels.
7. Pełna obsługa wszystkich platform social media.
```

---

### 4. Format social media

Moduł social media obsługuje na start trzy formaty:

```ts
export type SocialFormatId =
  | 'square-1080'
  | 'feed-4x5-1080'
  | 'story-9x16-1080';
```

Definicje:

```ts
export const SOCIAL_FORMATS = {
  'square-1080': {
    id: 'square-1080',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    label: 'Post square 1080×1080',
  },

  'feed-4x5-1080': {
    id: 'feed-4x5-1080',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    label: 'Feed portrait 1080×1350',
  },

  'story-9x16-1080': {
    id: 'story-9x16-1080',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    label: 'Story / Reels 1080×1920',
  },
} as const;
```

Dla formatu story należy uwzględnić marginesy ochronne, aby kluczowe elementy nie kolidowały z interfejsem platformy.

W MVP nie musimy jeszcze ustalać finalnych wartości safe zone, ale renderer powinien mieć możliwość pokazania pomocniczej warstwy diagnostycznej.

---

### 5. Różnica względem Google Ads

Generator Google Ads opierał się na strukturze:

```txt
zdjęcie
nazwa kierunku
subtitle
CTA
miasto
logo
```

W module social media CTA nie jest komponentem obowiązkowym.

Social media opiera się raczej na strukturze:

```txt
zdjęcie
nazwa kierunku
tryb nauki / dopisek online
przewaga
cena / promocja
start / termin
logo TEB
logo partnera
opcjonalnie miasto
```

CTA może pojawić się później jako opcjonalny komponent, ale nie jest częścią podstawowego MVP. W social media CTA często może być obsługiwane przez opis posta, przycisk reklamowy platformy, link w stories, ostatni slajd karuzeli albo mechanikę kampanii.

---

### 6. Tryb oferty: online / stacjonarne

W module social media rozróżniamy dwa tryby oferty:

```ts
export type OfferMode = 'stationary' | 'online';
```

Zasady:

```txt
stationary:
- może mieć miasto,
- miasto może być domyślnie widoczne,
- nie pokazuje dopisku „Nauka online”.

online:
- domyślnie ukrywa miasto,
- pokazuje dopisek „Nauka online”,
- może korzystać z tych samych zdjęć lub mapowania fallbackowego.
```

Przykład domyślnych ustawień:

```ts
export const offerModeDefaults = {
  stationary: {
    label: undefined,
    showCity: true,
    showOfferModeLabel: false,
  },

  online: {
    label: 'Nauka online',
    showCity: false,
    showOfferModeLabel: true,
  },
} as const;
```

W przyszłości użytkownik w kreatorze może ręcznie zmienić widoczność miasta lub dopisku online, ale w MVP logika wynika z danych.

---

### 7. Kierunki online

Do oferty kursów mają dojść kierunki online. Należy sprawdzić, czy istniejące dane kierunków obejmują te pozycje.

Zadanie danych:

```txt
1. Sprawdzić courses.normalized.json.
2. Dodać brakujące kierunki online.
3. Dodać offerMode: "online".
4. Dodać domyślny label: "Nauka online".
5. Sprawdzić mapowanie zdjęć w image-map.final.json.
6. W razie braku zdjęcia użyć fallbacku z kierunku bazowego.
```

Przykład:

```ts
{
  courseId: 'pku-programowanie-python-online',
  courseName: 'Programowanie Python',
  brandKey: 'kursy',
  offerMode: 'online',
  offerModeLabel: 'Nauka online',
  imageKey: 'pku-programowanie-python'
}
```

---

### 8. Partnerzy

Partner jest przypisany do konkretnego kierunku.

W MVP partner nie jest globalnym elementem kampanii i nie jest ręcznie wybierany dla wszystkich kierunków.

Zasada MVP:

```txt
Jeżeli kierunek ma partnerKey, logo partnera występuje automatycznie.
Jeżeli kierunek nie ma partnerKey, komponent partnera nie jest renderowany.
```

Model danych kierunku:

```ts
export type SocialCourseData = {
  courseId: string;
  courseName: string;
  brandKey: string;
  offerMode: 'stationary' | 'online';

  partnerKey?: string;

  benefit?: string;
  priceLabel?: string;
  startDateLabel?: string;
};
```

Baza partnerów:

```ts
export type PartnerData = {
  partnerKey: string;
  name: string;
  logoPath: string;
  badgeStyle?: 'white-card';
};
```

Przykład:

```ts
export const partners = {
  cisco: {
    partnerKey: 'cisco',
    name: 'Cisco Networking Academy',
    logoPath: '/creative-stack/logos/partners/cisco.svg',
    badgeStyle: 'white-card',
  },
} as const;
```

Resolver:

```ts
const partner = course.partnerKey
  ? partners[course.partnerKey]
  : undefined;
```

Renderer:

```ts
if (!creative.partner) {
  return '';
}

return renderSocialPartnerLogoBadge({
  partner: creative.partner,
  slot: layout.slots.partnerLogo,
});
```

---

### 9. Logo partnera

Logo partnera powinno być renderowane jako badge na zdjęciu, na białej apli. Dzięki temu dolna część layoutu pozostaje dostępna dla ważniejszych treści sprzedażowych.

Zasada:

```txt
PartnerLogoBadge jest nakładką na PhotoFrame.
Nie zabiera miejsca w głównej sekcji tekstowej.
Zawsze ma białą aplę dla kontroli kontrastu.
```

Domyślne umieszczenie:

```ts
export type PartnerBadgePlacement =
  | 'photo-top-right'
  | 'photo-top-left'
  | 'photo-bottom-right';
```

Domyślnie:

```ts
partnerBadgePlacement: 'photo-top-right'
```

Styl:

```ts
export type PartnerBadgeStyle = {
  backgroundColor: '#FFFFFF';
  radius: number;
  paddingX: number;
  paddingY: number;
  maxWidth: number;
  maxHeight: number;
};
```

---

### 10. Partner w przyszłym kreatorze

W późniejszym trybie kreatora użytkownik powinien mieć możliwość ręcznego włączenia miejsca na partnera oraz wyboru lub wprowadzenia logotypu.

To działa na poziomie draftu kreacji, a nie na poziomie bazowych danych kierunku.

Typ:

```ts
export type PartnerSource =
  | 'from-course'
  | 'selected'
  | 'custom'
  | 'hidden';
```

Draft partnera:

```ts
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
```

Interpretacja:

```txt
from-course:
- partner przypisany do kierunku,
- domyślne zachowanie produkcyjne.

selected:
- użytkownik wybiera partnera z biblioteki.

custom:
- użytkownik wprowadza lub wgrywa własny logotyp.

hidden:
- partner ukryty w trybie ręcznym.
```

W MVP nie budujemy tej funkcjonalności, ale model powinien ją przewidywać.

---

### 11. Baza komponentów social

Moduł social powinien mieć bazę komponentów SVG. Każdy komponent ma własną funkcję renderującą oraz własny preset stylu.

Podstawowe komponenty:

```txt
PhotoFrame
CourseNameBlock
OfferModeBadge
BenefitBlock
PriceBadge
StartDateBadge
CityBadge
PartnerLogoBadge
BrandLogoAnchor
SafeZoneOverlay
DebugOverlay
```

Opis:

| Komponent        | Rola                                    |
| ---------------- | --------------------------------------- |
| PhotoFrame       | zdjęcie kierunku / tło                  |
| CourseNameBlock  | nazwa kierunku                          |
| OfferModeBadge   | dopisek „Nauka online”                  |
| BenefitBlock     | przewaga / wyróżnik                     |
| PriceBadge       | cena / promocja                         |
| StartDateBadge   | start / termin                          |
| CityBadge        | opcjonalne miasto                       |
| PartnerLogoBadge | logo partnera na białej apli            |
| BrandLogoAnchor  | logo TEB                                |
| SafeZoneOverlay  | warstwa pomocnicza dla stories          |
| DebugOverlay     | sloty, bounding boxy, nazwy komponentów |

---

### 12. Typy komponentów

```ts
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
```

Dane kreacji:

```ts
export type SocialCreativeData = {
  courseId: string;
  courseName: string;
  brandKey: string;

  offerMode: OfferMode;
  offerModeLabel?: string;

  imageKey?: string;
  imagePath?: string;

  benefit?: string;
  priceLabel?: string;
  startDateLabel?: string;

  cityId?: string;
  cityName?: string;

  partner?: {
    key: string;
    name: string;
    logoPath: string;
  };

  enabledComponents: SocialComponentId[];
};
```

---

### 13. Dane sztywne MVP

Na start tworzymy dane mockowe / robocze:

```txt
src/modules/social-generator/data/social-creatives.mock.ts
```

Przykład:

```ts
import type { SocialCreativeData } from '../types/social.types';

export const socialCreativesMock: SocialCreativeData[] = [
  {
    courseId: 'pku-barber',
    courseName: 'Barber',
    brandKey: 'kursy',
    offerMode: 'stationary',
    imageKey: 'pku-barber',
    benefit: 'Nauka praktyczna od pierwszych zajęć',
    priceLabel: 'od 0 zł',
    startDateLabel: 'Start: wrzesień',
    cityId: 'poznan',
    cityName: 'Poznań',
    enabledComponents: [
      'photo',
      'courseName',
      'benefit',
      'price',
      'startDate',
      'city',
      'brandLogo',
    ],
  },

  {
    courseId: 'pku-programowanie-python-z-cisco-networking-academy',
    courseName: 'Programowanie Python',
    brandKey: 'kursy',
    offerMode: 'online',
    offerModeLabel: 'Nauka online',
    imageKey: 'pku-programowanie-python',
    benefit: 'Praktyczna nauka programowania',
    priceLabel: 'od 0 zł',
    startDateLabel: 'Start: wrzesień',
    partner: {
      key: 'cisco',
      name: 'Cisco Networking Academy',
      logoPath: '/creative-stack/logos/partners/cisco.svg',
    },
    enabledComponents: [
      'photo',
      'courseName',
      'offerMode',
      'benefit',
      'price',
      'startDate',
      'partnerLogo',
      'brandLogo',
    ],
  },
];
```

---

### 14. Style komponentów

Tworzymy bazowy plik stylów komponentów:

```txt
src/modules/social-generator/renderer/socialComponentStyles.ts
```

Przykład:

```ts
export type SocialComponentStyleVariant =
  | 'default'
  | 'compact'
  | 'strong'
  | 'soft'
  | 'outline';

export type SocialTextComponentStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  color: string;
};

export type SocialBadgeStyle = {
  backgroundColor: string;
  color: string;
  radius: number;
  paddingX: number;
  paddingY: number;
  borderColor?: string;
};

export const socialComponentStyles = {
  courseName: {
    default: {
      fontFamily: 'TEBFont',
      fontWeight: 800,
      fontSize: 72,
      lineHeight: 0.95,
      color: 'var(--brand-primary)',
    },
  },

  benefit: {
    default: {
      fontFamily: 'TEBFont',
      fontWeight: 600,
      fontSize: 34,
      lineHeight: 1.15,
      color: 'var(--brand-primary)',
    },
  },

  price: {
    default: {
      backgroundColor: 'var(--brand-primary)',
      color: '#FFFFFF',
      radius: 999,
      paddingX: 28,
      paddingY: 14,
    },
  },

  startDate: {
    default: {
      backgroundColor: '#EAF1FF',
      color: 'var(--brand-primary)',
      radius: 999,
      paddingX: 24,
      paddingY: 12,
    },
  },

  offerMode: {
    default: {
      backgroundColor: '#FFFFFF',
      color: 'var(--brand-primary)',
      radius: 999,
      paddingX: 22,
      paddingY: 10,
      borderColor: 'rgba(16, 45, 105, 0.18)',
    },
  },

  partnerLogo: {
    default: {
      backgroundColor: '#FFFFFF',
      radius: 18,
      paddingX: 22,
      paddingY: 14,
      maxWidth: 220,
      maxHeight: 84,
    },
  },
} as const;
```

---

### 15. Layout jako sloty

Na tym etapie nie projektujemy finalnego wyglądu layoutów. Definiujemy layout jako mapę slotów.

```ts
export type SocialLayoutSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SocialLayoutDefinition = {
  id: string;
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
```

Dzięki temu można dopracowywać wygląd później, bez przepisywania modelu danych i rendererów.

---

### 16. Presety layoutowe

W MVP wdrażamy jeden layout roboczy, ale model powinien przewidywać kilka presetów.

```ts
export type SocialLayoutPreset =
  | 'photo-top-content-bottom'
  | 'photo-background-card'
  | 'split-photo-content'
  | 'story-editorial'
  | 'minimal-course-card';
```

Na start:

```txt
photo-top-content-bottom
```

Założenie:

```txt
zdjęcie u góry,
logo partnera na zdjęciu,
treść na dole,
logo TEB w lewym dolnym obszarze,
opcjonalne miasto w dolnym lub bocznym tagu.
```

---

### 17. Priorytety komponentów

Renderer powinien wiedzieć, które komponenty są obowiązkowe, a które mogą zostać ukryte lub skrócone przy braku miejsca.

```ts
export type SocialComponentPriority =
  | 'required'
  | 'recommended'
  | 'optional';
```

Proponowana hierarchia:

```txt
required:
- photo
- courseName
- brandLogo

recommended:
- offerMode
- price
- startDate
- partnerLogo, jeśli kierunek ma partnera

optional:
- city
- benefit
```

W przypadku konfliktów layoutu renderer lub walidator może zasugerować:

```txt
Miasto ukryte, bo oferta online.
Przewaga skrócona, bo nazwa kierunku jest długa.
Cena zachowana, bo ma wyższy priorytet.
```

---

### 18. Fallbacki tekstowe

Teksty powinny mieć warianty pełne i skrócone.

```ts
export type TextFallbackValue = {
  full: string;
  short?: string;
  compact?: string;
};
```

Przykład ceny:

```ts
priceLabel: {
  full: 'od 0 zł miesięcznie',
  short: 'od 0 zł',
}
```

Przykład startu:

```ts
startDateLabel: {
  full: 'Start zajęć: wrzesień 2026',
  short: 'Start: wrzesień',
  compact: 'wrzesień',
}
```

W MVP można zacząć od prostych stringów, ale docelowo fallbacki powinny zostać dodane do danych lub resolvera.

---

### 19. Focal point zdjęcia

To samo zdjęcie będzie kadrowane do trzech różnych proporcji. Dlatego każde zdjęcie powinno docelowo mieć punkt kadrowania.

```ts
export type ImageFocalPoint = {
  x: number; // 0–1
  y: number; // 0–1
};
```

Przykład:

```ts
imageFocalPoint: {
  x: 0.52,
  y: 0.38,
}
```

Zastosowanie:

```txt
1080×1080:
- kadr wokół centralnego obiektu.

1080×1350:
- więcej pionu, ale nadal ochrona twarzy / dłoni / stanowiska.

1080×1920:
- kadr story z ochroną safe zone i kluczowego obiektu.
```

---

### 20. Debug overlay

Moduł social powinien mieć tryb diagnostyczny.

Debug overlay pokazuje:

```txt
safe zone,
sloty layoutu,
bounding boxy tekstów,
nazwy komponentów,
elementy ukryte,
fallbacki,
kolizje komponentów.
```

Funkcja:

```ts
renderSocialDebugOverlay({
  format,
  layout,
  validation,
});
```

W MVP debug overlay będzie bardzo przydatny przy dopracowywaniu layoutów.

---

### 21. Brand tokens

Kolory, logo i typografia nie powinny być wpisywane na sztywno w komponentach. Powinny pochodzić z brand tokens.

```ts
export type SocialBrandTokens = {
  brandKey: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoPath: string;
  fontFamily: string;
};
```

Komponenty takie jak:

```txt
PriceBadge
OfferModeBadge
BenefitBlock
CourseNameBlock
```

powinny korzystać z tokenów brandu.

---

### 22. Walidacja social

Walidator social powinien być osobnym plikiem:

```txt
src/modules/social-generator/validators/validateSocialCreative.ts
```

Typy pól walidacji:

```ts
export type SocialValidationField =
  | 'courseName'
  | 'offerMode'
  | 'benefit'
  | 'price'
  | 'startDate'
  | 'city'
  | 'brandLogo'
  | 'partnerLogo'
  | 'safeZone'
  | 'image'
  | 'textOverflow'
  | 'contrast';
```

Reguły:

```txt
courseName:
- nie może wychodzić poza slot,
- może mieć zmniejszany font,
- może przechodzić do kilku linii.

offerMode:
- dla online pokazuje „Nauka online”,
- dla stacjonarne domyślnie niewidoczne.

city:
- dla online domyślnie ukryte,
- dla długich nazw może przejść w mniejszy tag,
- może zostać ukryte, jeśli jest opcjonalne.

partnerLogo:
- jeśli course.partnerKey istnieje, logo musi zostać wyrenderowane,
- jeśli brakuje pliku logo, walidator zgłasza warning/error,
- logo powinno mieć białą aplę,
- nie powinno wychodzić poza slot,
- w story nie może kolidować z safe zone.

safeZone:
- dotyczy szczególnie story,
- kluczowe teksty i logo nie powinny wchodzić w obszary ryzyka.

image:
- musi istnieć,
- powinno mieć fallback,
- docelowo powinno mieć focal point.

textOverflow:
- wykrywa przepełnienia tekstu.

contrast:
- sprawdza ryzyko nieczytelności tekstu na tle.
```

---

### 23. Architektura plików

Proponowana struktura:

```txt
src/modules/creative-stack/
  core/
    data/
    resolver/
    naming/
    brand/
    image/
    export/
    svg/

src/modules/ads-generator/
  components/
  data/
  export/
  renderer/
  types/
  utils/
  validators/

src/modules/social-generator/
  components/
    SocialWorkspace.vue
    SocialControlsPanel.vue
    SocialPreviewPanel.vue
    SocialFormatPreview.vue
    SocialDataSmokeTest.vue

  data/
    social-creatives.mock.ts
    partners.ts

  renderer/
    renderSocialSvg.ts
    renderSocialPhoto.ts
    renderSocialCourseName.ts
    renderSocialOfferMode.ts
    renderSocialBenefit.ts
    renderSocialPrice.ts
    renderSocialStartDate.ts
    renderSocialCity.ts
    renderSocialPartnerLogo.ts
    renderSocialBrandLogo.ts
    renderSocialDebugOverlay.ts
    socialFormats.ts
    socialLayouts.ts
    socialComponentStyles.ts

  stores/
    socialDraftStore.ts

  types/
    social.types.ts

  utils/
    resolveSocialCreative.ts

  validators/
    validateSocialCreative.ts
```

---

### 24. Resolver social

Resolver social przygotowuje dane dla renderera. Renderer nie powinien samodzielnie zgadywać, czy kierunek jest online, czy ma partnera, albo czy miasto ma być pokazane.

Funkcja:

```ts
resolveSocialCreative(input: ResolveSocialCreativeInput): SocialCreativeData
```

Przykład wejścia:

```ts
export type ResolveSocialCreativeInput = {
  courseId: string;
  cityId?: string;
  formatId: SocialFormatId;
};
```

Logika:

```txt
1. Pobierz kierunek.
2. Pobierz brand.
3. Pobierz zdjęcie.
4. Sprawdź offerMode.
5. Jeśli offerMode = online, dodaj label „Nauka online”.
6. Jeśli kierunek ma partnerKey, pobierz partnera.
7. Jeśli kierunek jest stacjonarny i ma cityId, dodaj miasto.
8. Zbuduj enabledComponents.
9. Zwróć SocialCreativeData.
```

---

### 25. Przyszły tryb kreatora

W przyszłości powstanie tryb ręcznego składania materiału z komponentów.

Użytkownik będzie mógł:

```txt
wybrać set / layout,
wybrać formaty,
wybrać zdjęcie,
wpisać nazwę kierunku,
wybrać online / stacjonarne,
włączyć lub ukryć miasto,
włączyć cenę,
wpisać cenę,
włączyć start,
wpisać termin,
włączyć przewagę,
wpisać przewagę,
włączyć partnera,
wybrać partnera z biblioteki,
wgrać lub wskazać własny logotyp.
```

Model draftu:

```ts
export type SocialCreativeDraft = {
  id: string;

  courseId?: string;
  formatIds: SocialFormatId[];

  courseName: string;
  imageKey?: string;

  offerMode: 'stationary' | 'online';
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
```

Ważne rozdzielenie:

```txt
SocialCreativeData:
- dane produkcyjne,
- automatyczne,
- oparte o kierunek.

SocialCreativeDraft:
- dane ręcznie składanej kreacji,
- może nadpisywać wartości,
- nie zmienia bazowych danych kierunku.
```

---

### 26. Eksport i nazewnictwo

Jednostka eksportu:

```txt
1 kierunek + 1 tryb oferty + opcjonalnie miasto = social set
```

Format ZIP:

```txt
brand_context_courseId_social-set.zip
```

Dla stacjonarnych:

```txt
kursy_poz_pku-barber_social-set.zip

kursy_poz_pku-barber_1080x1080.png
kursy_poz_pku-barber_1080x1350.png
kursy_poz_pku-barber_1080x1920.png
```

Dla online:

```txt
kursy_online_pku-python_social-set.zip

kursy_online_pku-python_1080x1080.png
kursy_online_pku-python_1080x1350.png
kursy_online_pku-python_1080x1920.png
```

Zasada:

```txt
stacjonarne:
brand_cityCode_courseId_format

online:
brand_online_courseId_format
```

---

### 27. Roadmapa wdrożenia

#### Etap 1 — Typy i formaty

Pliki:

```txt
social.types.ts
socialFormats.ts
```

Zakres:

```txt
SocialFormatId
OfferMode
SocialComponentId
SocialCreativeData
PartnerData
SocialLayoutSlot
SocialLayoutDefinition
Backlog danych i assetów
```

#### Etap 2 — Dane robocze

Pliki:

```txt
social-creatives.mock.ts
partners.ts
```

Zakres:

```txt
kilka kierunków testowych,
jeden kierunek stacjonarny,
jeden kierunek online,
jeden kierunek z partnerem.
```

#### Etap 3 — Style komponentów

Plik:

```txt
socialComponentStyles.ts
```

Zakres:

```txt
CourseNameBlock
OfferModeBadge
BenefitBlock
PriceBadge
StartDateBadge
CityBadge
PartnerLogoBadge
BrandLogoAnchor
```

#### Etap 4 — Pierwszy layout slotowy

Plik:

```txt
socialLayouts.ts
```

Zakres:

```txt
photo-top-content-bottom dla 1080×1080.
```

#### Etap 5 — Renderer SVG

Pliki:

```txt
renderSocialSvg.ts
renderSocialPhoto.ts
renderSocialCourseName.ts
renderSocialOfferMode.ts
renderSocialBenefit.ts
renderSocialPrice.ts
renderSocialStartDate.ts
renderSocialCity.ts
renderSocialPartnerLogo.ts
renderSocialBrandLogo.ts
```

Zakres:

```txt
render pierwszego formatu 1080×1080.
```

#### Etap 6 — Pozostałe formaty

Zakres:

```txt
1080×1350,
1080×1920,
safe zone dla story,
debug overlay.
```

#### Etap 7 — Walidacja

Plik:

```txt
validateSocialCreative.ts
```

Zakres:

```txt
braki danych,
overflow tekstu,
safe zone,
partner logo,
brak zdjęcia,
ryzyko kontrastu.
```

#### Etap 8 — UI robocze

Komponenty:

```txt
SocialWorkspace.vue
SocialControlsPanel.vue
SocialPreviewPanel.vue
SocialFormatPreview.vue
```

Zakres:

```txt
wybór kierunku,
podgląd 3 formatów,
debug overlay,
walidacja.
```

#### Etap 9 — Eksport

Zakres:

```txt
SVG → PNG,
ZIP setu,
nazewnictwo dla online i stacjonarnych.
```

---

### 28. Decyzje projektowe

1. Moduł social media powstaje jako osobny moduł `social-generator`.
2. Nie rozbudowujemy bezpośrednio `ads-generator`.
3. Wspólne elementy stopniowo przenosimy do `creative-stack/core`.
4. MVP działa na sztywnych danych.
5. Nie budujemy jeszcze pełnego kreatora.
6. CTA nie jest obowiązkowym komponentem social media.
7. Podstawowe formaty to 1080×1080, 1080×1350 i 1080×1920.
8. Dla story stosujemy safe zone i debug overlay.
9. Tryb oferty ma dwie wartości: online albo stacjonarne.
10. Dla online pokazujemy dopisek „Nauka online”.
11. Dla online miasto jest domyślnie ukryte.
12. Dla stacjonarnych miasto może być widoczne.
13. Partner jest przypisany do konkretnego kierunku.
14. Jeśli kierunek ma partnera, logo partnera renderuje się automatycznie.
15. Logo partnera występuje jako badge na zdjęciu, na białej apli.
16. W przyszłym kreatorze partner będzie możliwy do ręcznego włączenia, wybrania lub wgrania.
17. Każdy element social jest komponentem renderera SVG.
18. Layout opisujemy jako sloty, nie jako finalny projekt graficzny.
19. Komponenty mają własne style bazowe.
20. Renderer powinien obsługiwać priorytety komponentów i fallbacki.
21. Zdjęcia powinny docelowo mieć focal point.
22. Walidator social jest osobny względem walidatora Google Ads.
23. Eksport rozróżnia online i stacjonarne w nazwach plików.
24. Model danych powinien przewidywać przyszły tryb kompozytora.

---

### 29. Najbliższy krok techniczny

Pierwszy krok wdrożeniowy:

```txt
Utworzyć strukturę modułu social-generator i dodać:
- social.types.ts
- socialFormats.ts
- socialComponentStyles.ts
- partners.ts
- social-creatives.mock.ts
```

Nie zaczynać od finalnego layoutu. Najpierw zbudować język danych i komponentów. Layout będzie dopracowywany iteracyjnie w trakcie pracy z realnymi przykładami kierunków.

## Model podglądu i responsywnego renderowania

Social Generator powinien działać w modelu jednego aktywnego podglądu roboczego. Użytkownik nie pracuje równocześnie na kilku osobnych podglądach, lecz wybiera aktualny format, np. `1080×1080`, `1080×1350` albo `1080×1920`, a system dynamicznie przelicza kompozycję na podstawie tego formatu.

Oznacza to, że dane kreacji pozostają wspólne, natomiast format jest kontekstem renderowania. Ten sam draft powinien móc zostać wyrenderowany do różnych proporcji bez tworzenia osobnych układów ręcznie dla każdego formatu.

Model działania:

```txt
draft kreacji
+ aktywny format podglądu
+ theme
+ density
+ creative scale
→ responsive layout
→ SVG aktywnego podglądu
```

Przy eksporcie system powinien użyć tego samego draftu i tej samej logiki renderowania do wygenerowania całej paczki formatów:

```txt
draft kreacji
→ render 1080×1080
→ render 1080×1350
→ render 1080×1920
→ eksport paczki
```

### Założenia UX

W interfejsie użytkownik powinien widzieć jeden główny podgląd kreacji. Nad lub obok podglądu powinien znajdować się przełącznik formatu:

```txt
Square 1:1
Feed 4:5
Story / Reels 9:16
```

Zmiana formatu powinna płynnie zmieniać proporcje podglądu i przeliczać layout, ale nie powinna tworzyć osobnej kopii danych. Użytkownik nadal edytuje jedną kreację.

W podglądzie należy rozdzielić dwa rodzaje skali:

1. **Skala podglądu UI** — odpowiada tylko za to, jak duży SVG jest widoczny w aplikacji. Nie wpływa na eksport.
2. **Skala kompozycji** — wpływa na rzeczywiste rozmiary elementów w grafice: fonty, odstępy, wysokości sekcji, marginesy, badge i układ zdjęcia.

Dzięki temu użytkownik może wygodnie oglądać grafikę w aplikacji bez przypadkowego zmieniania finalnego eksportu.

### Responsywny system kompozycji

Nie zakładamy jednego sztywnego SVG skalowanego do wszystkich formatów. Zakładamy jeden responsywny system layoutu, który generuje różne proporcje z tych samych zasad.

System powinien definiować:

* hierarchię wizualną,
* skalę typografii,
* odstępy pionowe i poziome,
* siatkę / jednostkę bazową,
* wysokości sekcji,
* zasady łamania tekstu,
* priorytety widoczności komponentów,
* tryby gęstości układu,
* motywy jasny / ciemny,
* bezpieczne strefy dla formatów story.

Przykładowa hierarchia wizualna:

```txt
1. Zdjęcie / kontekst wizualny
2. Nazwa kierunku
3. Cena lub główna przewaga
4. Start / tryb nauki / miasto
5. Partner
6. Logo TEB
```

W przypadku braku miejsca system powinien najpierw skracać lub ukrywać elementy opcjonalne, a nie zmniejszać bez końca najważniejszych elementów. Nazwa kierunku, zdjęcie i logo marki powinny pozostać elementami nadrzędnymi.

### Format jako kontekst renderowania

Format powinien być przekazywany do renderera jako kontekst, np.:

```ts
type SocialRenderContext = {
  formatId: SocialFormatId;
  width: number;
  height: number;
  ratio: '1:1' | '4:5' | '9:16';
};
```

Natomiast dane kreacji powinny pozostać niezależne od formatu:

```ts
type SocialCreativeDraft = {
  courseName: string;
  imagePath: string;
  offerMode: 'stationary' | 'online';
  cityName?: string;
  benefit?: string;
  priceLabel?: string;
  startDateLabel?: string;
  partner?: {
    name: string;
    logoPath: string;
  };
  themeMode: 'light' | 'dark';
  layoutPreset: string;
  density: 'compact' | 'default' | 'comfortable';
  creativeScale: number;
};
```

Docelowy schemat:

```txt
SocialCreativeDraft
+ SocialRenderContext
+ CreativeTheme
+ ResponsiveScale
→ SocialResponsiveLayout
→ SVG
```

### Tryby gęstości

Zamiast od razu dodawać wiele ręcznych suwaków, warto wprowadzić kontrolę gęstości kompozycji:

```txt
compact
default
comfortable
```

Znaczenie:

```txt
compact:
  mniejsze odstępy,
  więcej treści,
  bardziej użytkowy układ.

default:
  standardowy rytm kompozycji.

comfortable:
  większe odstępy,
  bardziej premium,
  mniej zagęszczona komunikacja.
```

Dodatkowo można przewidzieć ekspercki parametr `creativeScale`, np. w zakresie `0.9–1.1`, który proporcjonalnie skaluje fonty, odstępy i komponenty bez naruszania proporcji całego formatu.

### Konsekwencje dla implementacji

W praktyce social-generator powinien rozwijać się w kierunku:

```txt
jeden aktywny podgląd
+ przełącznik formatu
+ responsive layout engine
+ wspólne dane draftu
+ eksport paczki formatów
```

Proponowane komponenty i pliki:

```txt
src/modules/social-generator/components/SocialPreviewStage.vue
src/modules/social-generator/renderer/layout/createSocialResponsiveLayout.ts
src/modules/creative-stack/design-system/createResponsiveScale.ts
src/modules/creative-stack/design-system/creativeTokens.ts
src/modules/creative-stack/design-system/creativeThemes.ts
```

`SocialPreviewStage.vue` powinien odpowiadać tylko za prezentację jednego aktywnego formatu w UI. Renderer SVG powinien nadal generować grafikę w realnych wymiarach eksportowych, np. `1080×1080`, `1080×1350`, `1080×1920`.

Eksport powinien działać niezależnie od aktywnego podglądu. Aktywny podgląd określa tylko to, co użytkownik aktualnie ogląda i edytuje. Eksport może wygenerować wszystkie zaznaczone formaty na podstawie tego samego draftu.
