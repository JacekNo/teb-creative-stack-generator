# TEB Creative Stack Generator

## Dokument projektowy modułu Social Media — v0.3

### 1. Kontekst projektu

Projekt **TEB Creative Stack Generator** rozwija się z generatora grafik Google Ads w szersze narzędzie do tworzenia materiałów marketingowych TEB.

Moduł Google Ads pozostaje osobnym, działającym modułem. Moduł social media powstaje obok, korzystając ze wspólnych danych, assetów, helperów SVG i zasad brandowych.

Główna zasada architektoniczna:

```txt
Google Ads zostaje jako działający moduł.
Social media budujemy obok.
Wspólne elementy stopniowo przenosimy do creative-stack.
```

---

### 2. Cel modułu social media

Celem modułu social media jest generowanie zestawów grafik dla kierunków edukacyjnych TEB w formatach używanych w social media.

Moduł ma działać jako jeden kreator z jednym aktywnym podglądem. Użytkownik przełącza format, ale dane kreacji pozostają wspólne. Eksport docelowo generuje paczkę formatów z tego samego draftu.

Model działania:

```txt
jeden draft kreacji
+ aktywny format podglądu
+ brand
+ design system
+ responsive layout flow
→ SVG aktywnego podglądu
```

Docelowy eksport:

```txt
jeden draft kreacji
→ 1080×1080
→ 1080×1350
→ 1080×1920
→ paczka eksportowa
```

---

### 3. Format social media

Moduł obsługuje trzy formaty:

```ts
export type SocialFormatId =
  | 'square-1080'
  | 'feed-4x5-1080'
  | 'story-9x16-1080';
```

Wymiary:

```txt
1080×1080 — post square / 1:1
1080×1350 — feed portrait / 4:5
1080×1920 — story / reels / 9:16
```

Dla formatu story należy uwzględniać safe zone, aby kluczowe elementy nie kolidowały z interfejsem platformy.

---

### 4. Główna decyzja architektoniczna

Social Generator nie powinien być zestawem ręcznie ustawianych layoutów dla każdego formatu. Projekt przyjmuje model:

```txt
format → brand → design system → layout flow → SVG renderer
```

Wartości liczbowe mogą istnieć w tokenach, ale nie powinny być powielane bezpośrednio w rendererach.

Zasada:

```txt
renderer nie wymyśla layoutu,
renderer tylko rysuje komponenty według layoutu i stylów.
```

---

### 5. Design system social

Social Generator ma osobny design system:

```txt
src/modules/social-generator/design-system/socialDesignTokens.ts
src/modules/social-generator/design-system/createSocialDesignSystem.ts
```

Design system definiuje:

- brandy,
- kolory,
- typografię,
- line height,
- spacing,
- radius,
- formaty,
- safe zones,
- komponenty:
  - title card,
  - badge,
  - logo box,
  - partner box,
  - info grid.

Skala spacingu oparta jest o 4 px:

```txt
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128
```

Przykład zasady:

```txt
fontSize, padding, gap, radius i lineHeight powinny wynikać z tokenów,
a nie z lokalnych wartości wpisanych w rendererze.
```

---

### 6. Brandy

Social Generator obsługuje cztery brandy:

```ts
export type SocialBrand =
  | 'edukacja'
  | 'kursy'
  | 'medyczne'
  | 'policealne';
```

Kolory bazowe:

```txt
TEB Edukacja
#102D69
#0F4496

TEB Kursy
#994365
#C7839F

TEB Szkoły Medyczne
#009489
#B8DDD5

TEB Szkoły Policealne
#E27D00
#F5B062

Pomocniczy
#FFC965
```

Docelowo logo brandu powinno być realnym assetem w lewym dolnym rogu, a nie tekstowym placeholderem.

---

### 7. Model danych kierunku

Moduł social przechodzi z modelu kampanijnego:

```txt
benefit / price / startDate / offerMode
```

na model informacji kierunku zgodny z logiką nagłówków kierunków na teb.pl:

```txt
courseNameParts
courseFacts
courseBadges
deliveryMode / offerMode
brandLogo
partnerLogo
city
```

Ceny i raty są na obecnym etapie pomijane.

---

### 8. Nazwa kierunku

Długie nazwy powinny być dzielone strukturalnie:

```ts
type CourseNameParts = {
  main: string;
  subtitle?: string;
  modeLabel?: string;
};
```

Przykład:

```ts
courseNameParts: {
  main: 'Programowanie Python',
  subtitle: 'z Cisco Networking Academy',
}
```

Zasady:

- title card korzysta z pełnej szerokości netto formatu,
- nazwa ma auto-fit po skali typografii,
- maksymalnie 3 linie dla głównego obszaru tytułu,
- długi tekst schodzi stopień niżej z wielkością fontu,
- facts i badges układają się pod dynamiczną title card,
- title card nie może nachodzić na facts.

Mechanika inspirowana jest rozwiązaniami z modułu Google Ads, ale w social media może być mniej restrykcyjna.

---

### 9. Course facts

`courseFacts` opisują merytoryczne informacje o kierunku.

Przykłady:

```txt
2 semestry
Czas trwania

188 godzin
10 miesięcy kształcenia

Tryb weekendowy
Zajęcia online na żywo
```

Model:

```ts
type SocialCourseFact = {
  id: string;
  icon?: 'clock' | 'calendar' | 'online' | 'info';
  value: string;
  label?: string;
};
```

Zasady renderowania:

- 1 fakt: jeden element informacyjny,
- 2 fakty: układ w dwóch kolumnach, jeśli jest miejsce,
- 3–4 fakty: układ flow / grid,
- facts nie powinny być ręcznie pozycjonowane względem title card,
- facts powinny podążać za dynamiczną wysokością title card.

---

### 10. Course badges

`courseBadges` opisują krótkie wyróżniki i etykiety sprzedażowe.

Przykłady:

```txt
Nie wymagamy matury!
Popularne
Szybki START
W SIERPNIU
ONLINE
```

Model:

```ts
type SocialBadgeTone =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'green'
  | 'yellow'
  | 'popular'
  | 'online';

type SocialCourseBadge = {
  id: string;
  label: string;
  tone: SocialBadgeTone;
};
```

Badge UI wymaga osobnego dopracowania:

- paddingi, wysokość i radius wynikają z design tokens,
- badge’e układają się w flow z zawijaniem,
- tryb online na obecnym etapie renderujemy jako pierwszy `courseBadge`,
- course badges nie powinny dublować badge’a trybu,
- tony kolorystyczne są brand-aware,
- finalne warianty wizualne wymagają QA na brandach Kursy, SP, SM i Edukacja.

---

### 11. Tryb online / stacjonarny

W module social należy obsługiwać kierunki online jako pełnoprawny wariant danych.

Aktualnie można korzystać z `offerMode`, ale docelowo warto rozważyć nazwę `deliveryMode`:

```ts
type DeliveryMode = 'stationary' | 'online' | 'hybrid';
```

Zasady:

```txt
stationary:
- może mieć miasto,
- miasto może być widoczne.

online:
- domyślnie ukrywa miasto,
- pokazuje `nauka online` jako pierwszy badge w tonie `online`,
- może mieć fact „Zajęcia online na żywo”.
```

Kierunki online muszą zostać uzupełnione w danych, ponieważ wcześniejszy moduł banner-ads nie uwzględniał ich w pełni.

---

### 12. Partnerzy

Partner jest przypisany do konkretnego kierunku.

Zasada MVP:

```txt
Jeżeli kierunek ma partnerKey, logo partnera występuje automatycznie.
Jeżeli kierunek nie ma partnerKey, komponent partnera nie jest renderowany.
```

Logo partnera jest nakładką na zdjęciu, na białej apli.

Zasady:

- domyślnie pozycja przy prawej dolnej krawędzi zdjęcia,
- apla partnera przylega do dolnej krawędzi zdjęcia,
- apla ma zaokrąglone tylko górne narożniki,
- w lewym górnym rogu apli znajduje się mały dopisek `partner`,
- partner logo nie zabiera miejsca w głównej sekcji tekstowej,
- brak assetu nie powinien pokazywać broken image,
- jeśli asset nie istnieje, komponent pokazuje kontrolowany placeholder `logo partnera`.

---

### 13. Tło / pattern

Social Generator powinien wykorzystywać tło lub pattern znane z modułu Google Ads.

Planowany komponent:

```txt
renderSocialBackground.ts
```

Kolejność renderowania:

```txt
background
photo
partnerLogo
courseName
modeBadge
courseBadges
courseFacts
footer / brandLogo / facts
debug overlay
```

Tło powinno korzystać z brandu i tokenów, a nie być lokalnym, przypadkowym kolorem.

---

### 14. Layout flow

Aktualny kierunek layoutu:

```txt
photo
courseName
courseBadges
city optional
footer
```

Zasada:

```txt
sekcje układają się jedna po drugiej,
a nie przez ręczne współrzędne y dla każdego elementu.
```

Docelowo:

```txt
photo = pełna szerokość, start od y=0
photo height = 500 / 600 / 850
photo clip = tylko lewy dolny narożnik
courseName.y = photo.y + photo.height
courseName = main title + subtitle + optional mode badge
badges.y = courseName.y + courseName.height + gap
city.y = badges.y + badges.height + gap
footer = kotwiczony do dolnej safe area
facts = w dolnym rzędzie obok brand logo
```

Dzięki temu długie nazwy kierunków nie nachodzą na zdjęcie, facts i badges.

---

### 15. Debug overlay

Debug overlay pokazuje:

- safe zone,
- sloty layoutu,
- bounding boxy tekstów,
- nazwy komponentów,
- elementy ukryte,
- fallbacki,
- potencjalne kolizje.

Tryb debug jest kluczowy przy kalibracji sociali dla trzech formatów.

---

### 16. Aktualnie zrealizowane

Zrealizowano:

- strukturę `social-generator`,
- formaty social,
- mockowe dane,
- helper `publicAssetPath.ts`,
- podgląd jednego aktywnego formatu,
- renderery SVG,
- `socialDesignTokens.ts`,
- `createSocialDesignSystem.ts`,
- `createSocialResponsiveLayout.ts`,
- przekazywanie styles do rendererów,
- `courseFacts`,
- `courseBadges`,
- `courseNameParts`,
- `renderSocialCourseFacts.ts`,
- `renderSocialCourseBadges.ts`,
- responsywny title flow z auto-fit,
- `renderSocialBackground.ts`,
- `socialBadgeFlow.ts`,
- pełnoszerokie zdjęcie z kadrowaniem `slice` i `imageFocalPoint`,
- nazwa bez białej apli,
- `subtitle` jako mniejszy dopisek,
- `modeLabel` jako badge przy tytule,
- partner card z placeholderem,
- facts w dolnym rzędzie obok brand logo.

---

### 17. Najbliższe etapy

#### Stage 3A — weryfikacja title flow

- wykonane: sprawdzono krótkie i długie nazwy w 3 formatach,
- wykonane: tytuł nie nachodzi na zdjęcie, facts ani badges,
- wykonane: footer jest zakotwiczony w dolnej safe area.

#### Stage 3B — background i logo

- dodać tło/pattern z banner-ads,
- dodać `renderSocialBackground.ts`, jeśli będzie potrzebny,
- podpiąć realne logo brandu w lewym dolnym rogu,
- dodać fallback/ukrywanie partner logo,
- wykonane: dodano kontrolowany placeholder partnera.

#### Stage 3C — badge system

- poprawić UI badge’y,
- dodać tony badge’y,
- poprawić flow i zawijanie,
- oprzeć paddingi i rozmiary o design tokens,
- wykonane: online może być renderowany jako badge w `courseBadges`.

#### Stage 3D — dane i warianty brandów

- dodać mocki SP i SM,
- uzupełnić dane online i partnerów,
- dodać realne assety partnerów,
- dopracować warianty badge’y dla brandów,
- podmienić wspólne brand logo na docelowe assety brandowe.

#### Stage 3E — cleanup

- usunąć stare renderery kampanijne, jeśli nie są już używane,
- usunąć stare layouty statyczne,
- uporządkować typy.

---

### 18. Walidacja social

Walidator social powinien być osobnym modułem:

```txt
src/modules/social-generator/validators/validateSocialCreative.ts
```

Zakres walidacji:

- overflow tytułu,
- minimalna wielkość fontu,
- przekroczenie max lines,
- kolizja title card z facts,
- kolizja badges z footerem,
- brak zdjęcia,
- brak logo partnera,
- broken partner logo,
- safe zone dla stories,
- zbyt mały tekst po skalowaniu,
- ryzyko kontrastu.

---

### 19. Eksport i nazewnictwo

Jednostka eksportu:

```txt
1 kierunek + 1 tryb oferty + opcjonalnie miasto = social set
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

### 20. Decyzje projektowe

1. Moduł social media powstaje jako osobny moduł `social-generator`.
2. Nie rozbudowujemy bezpośrednio `ads-generator`.
3. Wspólne elementy stopniowo przenosimy do `creative-stack`.
4. MVP działa na sztywnych danych.
5. Nie budujemy jeszcze pełnego kreatora.
6. CTA nie jest obowiązkowym komponentem social media.
7. Podstawowe formaty to 1080×1080, 1080×1350 i 1080×1920.
8. Dla story stosujemy safe zone i debug overlay.
9. Social Generator działa jako jeden draft z aktywnym podglądem formatu.
10. Eksport docelowo generuje paczkę formatów z tego samego draftu.
11. Layout social ma działać jako flow, nie jako ręczna mapa y dla każdego elementu.
12. Nazwa kierunku korzysta z `courseNameParts`.
13. Długie nazwy mają schodzić po skali fontu, aż zmieszczą się w limicie.
14. Ceny i raty pomijamy na obecnym etapie social.
15. Informacje kierunku modelujemy jako `courseFacts`.
16. Wyróżniki modelujemy jako `courseBadges`.
17. Kierunki online muszą zostać uzupełnione w danych.
18. Partner jest przypisany do konkretnego kierunku.
19. Jeśli kierunek ma partnera, logo partnera renderuje się automatycznie.
20. Brak assetu partnera nie może pokazywać broken image.
21. Logo brandu powinno być realnym assetem w lewym dolnym rogu.
22. Tło/pattern powinno zostać przeniesione z modułu Google Ads.
23. Badge UI wymaga osobnego systemu i kalibracji.
24. Walidator social jest osobny względem walidatora Google Ads.
25. Eksport rozróżnia online i stacjonarne w nazwach plików.

---

### 21. Ważne pliki

```txt
src/modules/social-generator/design-system/socialDesignTokens.ts
src/modules/social-generator/design-system/createSocialDesignSystem.ts
src/modules/social-generator/renderer/layout/createSocialResponsiveLayout.ts
src/modules/social-generator/renderer/layout/socialTitleFit.ts
src/modules/social-generator/renderer/renderSocialSvg.ts
src/modules/social-generator/renderer/renderSocialCourseName.ts
src/modules/social-generator/renderer/renderSocialCourseFacts.ts
src/modules/social-generator/renderer/renderSocialCourseBadges.ts
src/modules/social-generator/renderer/renderSocialPartnerLogo.ts
src/modules/social-generator/renderer/renderSocialBrandLogo.ts
src/modules/social-generator/data/social-creatives.mock.ts
src/modules/social-generator/types/social.types.ts
```
