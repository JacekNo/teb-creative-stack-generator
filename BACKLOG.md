# Backlog — TEB Creative Stack Generator

## Done

### Google Ads Generator

- Rozbito renderer SVG na mniejsze moduły.
- Dodano wspólne helpery SVG w `svgUtils.ts`.
- Dodano globalną strukturę stylów aplikacji:
  - `src/styles/tokens.css`,
  - `src/styles/base.css`,
  - `src/styles/components.css`,
  - `src/styles/fonts.css`.
- Uporządkowano `googleAdsLayouts.ts` jako centralny config layoutów Google Ads.
- Przebudowano `CourseTitleCard` w kierunku logiki `hug content`.
- Dostosowano walidator do nowego modelu `titleCard` opartego o `minWidth`, `maxWidth`, `minHeight`, `maxHeight`.
- Dodano poprawki polskiego łamania tekstu, aby unikać wdów i bękartów na końcach linii.
- Wydzielono dolny pasek na:
  - `LocalCTA`,
  - `BrandAnchor`.
- Dodano resolver wariantów `LocalCTA`.
- Dodano wariant `stacked` dla długich miast.
- Dodano fallback do `stacked`, gdy miasto nie mieści się między CTA a logo.
- Ustabilizowano rozmiar CTA, miasta i logo.
- Usunięto dodatkową aplę pod logo SVG.
- Podmieniono zdjęcia kierunków na wersje HD `1920×1280`.
- Dodano fonty Roc Grotesk do projektu i SVG.

### Social Generator

- Dodano strukturę modułu `src/modules/social-generator/`.
- Dodano wspólną warstwę `src/modules/creative-stack/`.
- Dodano formaty social:
  - `1080×1080`,
  - `1080×1350`,
  - `1080×1920`.
- Dodano mockowe dane social i partnerów.
- Dodano renderery SVG elementów social.
- Dodano `publicAssetPath.ts`, który rozwiązuje ścieżki publicznych assetów z `BASE_URL`.
- Dodano podgląd jednego aktywnego formatu:
  - `SocialPreviewStage.vue`,
  - `SocialGeneratorSmokeTest.vue`.
- Dodano design system social:
  - `socialDesignTokens.ts`,
  - `createSocialDesignSystem.ts`.
- Naprawiono typowanie `letterSpacing` — helpery SVG dostają wartości liczbowe.
- Dodano `createSocialResponsiveLayout.ts` jako warstwę geometrii layoutu.
- Przepięto `renderSocialSvg.ts` na sloty layoutu.
- Przekazano `styles` z design systemu do rendererów komponentów social.
- Rozszerzono model danych o:
  - `courseFacts`,
  - `courseBadges`,
  - `courseNameParts`.
- Dodano renderery:
  - `renderSocialCourseFacts.ts`,
  - `renderSocialCourseBadges.ts`.
- Przebudowano Social Generator w kierunku układu informacyjnego kierunku zamiast układu kampanijnego.
- Przygotowano responsywny title flow:
  - auto-fit skali tytułu,
  - max 3 linie,
  - pełna szerokość netto title card,
  - podział długich nazw na `main`, `subtitle`, `modeLabel`,
  - dynamiczna wysokość title card.

## Now

### 1. Social Generator — Stage 3A: weryfikacja responsywnego title flow

Cel: sprawdzić, czy title card, facts, badges i footer zachowują się poprawnie dla krótkich i długich nazw kierunków.

Zakres:

- sprawdzić `Barber` w formatach:
  - `1080×1080`,
  - `1080×1350`,
  - `1080×1920`,
- sprawdzić `Programowanie Python z Cisco Networking Academy ONLINE` w tych samych formatach,
- zweryfikować, czy tytuł nie nachodzi na facts,
- zweryfikować, czy facts i badges układają się pod dynamicznym title card,
- sprawdzić, czy footer jest zakotwiczony w dolnej safe area,
- ocenić, czy max 3 linie jest wystarczające dla długich nazw.

### 2. Social Generator — Stage 3B: tło, brand logo i partner logo

Cel: uzupełnić warstwę wizualną social generatora o elementy brandowe znane z Google Ads.

Zakres:

- dodać tło/pattern wykorzystywane wcześniej w module Google Ads,
- dodać `renderSocialBackground.ts`, jeśli warstwa tła wymaga osobnego renderera,
- podpiąć realne logotypy brandów w lewym dolnym rogu:
  - TEB Edukacja,
  - TEB Kursy,
  - TEB Szkoły Medyczne,
  - TEB Szkoły Policealne,
- zastąpić tekstowy fallback `TEB Kursy` logotypem lub uporządkowanym fallbackiem,
- dodać fallback/ukrywanie `partnerLogo`, jeśli asset logo nie istnieje,
- sprawdzić, czy partner logo nie pokazuje broken image.

### 3. Social Generator — Stage 3C: system badge’y

Cel: poprawić UI badge’y, które obecnie są robocze.

Zakres:

- zdefiniować tony badge’y:
  - `primary`,
  - `secondary`,
  - `light`,
  - `green`,
  - `yellow`,
  - `popular`,
  - `online`,
- poprawić paddingi badge’y,
- poprawić wysokość badge’y,
- poprawić border radius,
- dodać flow z zawijaniem badge’y,
- sprawdzić czytelność przy 2–4 badge’ach,
- upewnić się, że badge’e korzystają z design tokens, a nie lokalnych magic numbers.

### 4. Social Generator — dane online i partnerzy

Cel: przygotować dane pod pełniejsze generowanie grafik social na podstawie informacji z teb.pl.

Zakres:

- uzupełnić listę kierunków o kursy online,
- dodać do danych `deliveryMode` albo utrzymać spójny model `offerMode`,
- dodać `modeLabel` / `offerModeLabel` dla kierunków online,
- przygotować pełną listę partnerów,
- przypisać partnerów do konkretnych kierunków,
- przygotować pliki logotypów partnerów,
- osadzić logotypy partnerów w publicznych assetach,
- zweryfikować, czy każdy `partnerKey` ma istniejący plik logo.

## Next

### 1. Social Generator — kontrolki UI design systemu

Cel: umożliwić testowanie responsywności bez edycji kodu.

Zakres:

- format aktywnego podglądu,
- brand,
- density:
  - `compact`,
  - `default`,
  - `comfortable`,
- `creativeScale`,
- debug overlay on/off,
- wybór mockowej kreacji.

### 2. Social Generator — walidator jakości

Cel: wykrywać problemy produkcyjne przed eksportem.

Zakres ostrzeżeń:

- tytuł osiągnął minimalny font,
- tytuł przekroczył max lines,
- facts nachodzą na title card,
- badges nie mieszczą się w dostępnej przestrzeni,
- footer koliduje z innymi elementami,
- brak zdjęcia,
- brak logo partnera,
- partner logo wychodzi poza slot,
- elementy story wchodzą w safe zone ryzyka,
- ryzyko zbyt małego tekstu po skalowaniu.

### 3. Social Generator — cleanup legacy rendererów

Cel: usunąć stare komponenty kampanijne, jeśli nie są już używane.

Do sprawdzenia/usunięcia:

- `renderSocialPrice.ts`,
- `renderSocialStartDate.ts`,
- `renderSocialOfferMode.ts`,
- `renderSocialBenefit.ts`, jeśli został zastąpiony przez `courseFacts` / `courseBadges`,
- `socialLayouts.ts`, jeśli stary statyczny layout nie jest już importowany,
- stare typy komponentów kampanijnych w `social.types.ts`.

### 4. Social Generator — eksport paczki formatów

Cel: wygenerować komplet grafik social z jednego draftu.

Zakres:

- render `1080×1080`,
- render `1080×1350`,
- render `1080×1920`,
- eksport PNG,
- ZIP setu,
- nazewnictwo dla online i stacjonarnych,
- raport eksportu.

### 5. Google Ads — eksport PNG

Cel: przygotować eksport gotowych grafik z SVG do PNG.

Do sprawdzenia:

- `@resvg/resvg-js`,
- `sharp`,
- obsługa fontów w eksporcie,
- obsługa obrazów lokalnych,
- nazewnictwo plików eksportowych.

### 6. Google Ads — batch export

Cel: wygenerować zestawy grafik dla wielu kierunków i miast.

Zakres:

- wybór kampanii,
- wybór brandu,
- wybór miasta,
- wybór listy kierunków,
- generowanie 3 formatów Google Ads,
- raport błędów i ostrzeżeń.

### 7. Clean Google asset mode

Cel: przygotować alternatywny tryb eksportu bez tekstu, CTA i logo dla assetowego modelu Google Ads / Performance Max.

Zakres:

- samo zdjęcie,
- opcjonalny subtelny brand frame,
- bez tekstów na grafice,
- zgodność z rekomendacjami assetowymi Google Ads.
