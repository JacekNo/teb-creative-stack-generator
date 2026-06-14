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
- Zweryfikowano Stage 3A dla krótkiej i długiej nazwy w trzech formatach.
- Dodano Stage 3B:
  - `renderSocialBackground.ts`,
  - pattern przeniesiony z Google Ads,
  - realny asset logo TEB jako brand logo,
  - kontrolowany fallback partner logo bez broken image.
- Dodano Stage 3C:
  - tony badge’y,
  - flow z zawijaniem,
  - wspólny helper `socialBadgeFlow.ts`,
  - badge’e oparte o design tokens.
- Przebudowano layout social zgodnie z kierunkiem wizualnym:
  - zdjęcie pełną szerokością od góry,
  - stałe wysokości zdjęcia: `500`, `600`, `850`,
  - kadrowanie `slice` z obsługą `imageFocalPoint`,
  - zaokrąglenie tylko lewego dolnego narożnika zdjęcia,
  - nazwa kierunku bez białej apli,
  - `subtitle` jako mniejszy dopisek pod nazwą,
  - `modeLabel` jako badge przy tytule,
  - partner card na prawym dolnym rogu zdjęcia,
  - facts w dolnym rzędzie obok brand logo,
  - miasto jako opcjonalny element pod badge’ami.
- Zaktualizowano dane wejściowe social:
  - `courses.normalized.json` ma 139 kierunków,
  - dodano 45 kierunków `PKU_ONLINE`,
  - `image-map.final.json` ma 139 / 139 mapowań zdjęć,
  - wszystkie mapowania zdjęć mają status `mapped`.
- Podpięto realne assety brandów:
  - `teb-kursy.svg`,
  - `teb-medyczne.svg`,
  - `teb-policealne.svg`.
- Rozszerzono registry partnerów i aliasów nazw w `partners.ts`.
- Dodano `socialCreativeCatalog.ts`, który buduje katalog social z danych ads-generatora.
- Panel testowy social korzysta z pełnej listy 139 kierunków.
- Zrealizowano Stage 3E — kalibracja wizualna elementów social:
  - powiększono `courseBadges`,
  - poprawiono estymację szerokości nazw kierunków, aby nie łamały się za wcześnie,
  - powiększono logo brandu w footerze,
  - powiększono partner card,
  - dodano skalowanie samego logo partnera,
  - dodano mocniejszą kompensację skali dla logo Cisco.

## Now

### 1. Stage 3F — ręczne kadrowanie zdjęcia

Cel: pozwolić ręcznie dopasować kompozycję zdjęcia tam, gdzie automatyczny focal point nie wystarcza.

Zakres:

- dodać do edycji kontrolki `imageFocalPoint.x` i `imageFocalPoint.y`,
- umożliwić przesuwanie zdjęcia:
  - sliderami,
  - docelowo przeciąganiem punktu kadrowania na podglądzie.
- dodać opcjonalną skalę zdjęcia `imageScale`,
- dodać reset do wartości bazowej z `image-map.final.json`,
- pokazać w debug overlay punkt focal point i obszar kadrowania,
- zapisywać ustawienia jako override draftu, bez modyfikowania danych źródłowych.

### 2. Stage 3G — eksport aktualnych ustawień bez backendu

Cel: umożliwić zapis i odtworzenie ręcznych zmian przed wdrożeniem backendu.

Zakres:

- eksport aktualnego draftu do pliku JSON,
- import / odtworzenie draftu z JSON,
- objąć eksportem:
  - `courseId`,
  - teksty tytułu i dopisku,
  - badge’e,
  - facts,
  - partnera,
  - miasto,
  - włączone / wyłączone komponenty,
  - format aktywnego podglądu,
  - `imageFocalPoint`,
  - `imageScale`.
- dodać opcjonalny auto-save w `localStorage`,
- dodać przycisk resetu draftu do danych katalogowych.

## Next

### 1. Stage 4A — katalog kierunków w gridzie

Cel: pokazać wszystkie kierunki jako minimalistyczny katalog grafik social.

Zakres:

- główny panel na całą szerokość strony,
- grid kart kierunków,
- podgląd każdej karty jako format square `1080×1080`,
- minimalistyczny wariant renderu do szybkiego skanowania,
- górny pasek filtrów:
  - wyszukiwarka po nazwie,
  - brand,
  - typ oferty,
  - online / stacjonarne,
  - partner,
  - status braków / fallbacków.
- akcje po najechaniu na kartę:
  - `Pobierz set`,
  - `Edytuj`.

### 2. Stage 4B — widok edycji pojedynczego kierunku

Cel: przejść z katalogu do pełnej edycji wybranego kierunku.

Zakres:

- po kliknięciu `Edytuj` otworzyć widok edycji kierunku,
- zachować jeden aktywny podgląd i przełącznik formatów,
- uporządkować UI panelu edycji:
  - treść,
  - badge’e,
  - facts,
  - zdjęcie / kadrowanie,
  - partner,
  - miasto,
  - eksport.
- dodać przycisk `Pobierz` także w widoku edycji,
- przygotować miejsce na walidację i ostrzeżenia jakościowe.

### 3. Stage 4C — eksport setu social z aktualnego draftu

Cel: wygenerować komplet grafik social z jednego draftu i aktualnych override’ów.

Zakres:

- render `1080×1080`,
- render `1080×1350`,
- render `1080×1920`,
- eksport PNG,
- ZIP setu,
- nazewnictwo dla online i stacjonarnych,
- raport eksportu z ostrzeżeniami.

### 4. Social Generator — walidator jakości

Cel: wykrywać problemy produkcyjne przed eksportem.

Zakres ostrzeżeń:

- tytuł osiągnął minimalny font,
- tytuł przekroczył max lines,
- facts nachodzą na title card,
- badges nie mieszczą się w dostępnej przestrzeni,
- footer koliduje z innymi elementami,
- brak zdjęcia,
- brak logo partnera,
- partner logo wychodzi poza slot albo safe zone,
- elementy story wchodzą w safe zone ryzyka,
- ryzyko zbyt małego tekstu po skalowaniu.

### 5. Social Generator — cleanup legacy rendererów

Cel: usunąć stare komponenty kampanijne, jeśli nie są już używane.

Do sprawdzenia/usunięcia:

- `renderSocialPrice.ts`,
- `renderSocialStartDate.ts`,
- `renderSocialOfferMode.ts`,
- `renderSocialBenefit.ts`, jeśli został zastąpiony przez `courseFacts` / `courseBadges`,
- `socialLayouts.ts`, jeśli stary statyczny layout nie jest już importowany,
- stare typy komponentów kampanijnych w `social.types.ts`.

### 6. Google Ads — eksport PNG

Cel: przygotować eksport gotowych grafik z SVG do PNG.

Do sprawdzenia:

- `@resvg/resvg-js`,
- `sharp`,
- obsługa fontów w eksporcie,
- obsługa obrazów lokalnych,
- nazewnictwo plików eksportowych.

### 7. Google Ads — batch export

Cel: wygenerować zestawy grafik dla wielu kierunków i miast.

Zakres:

- wybór kampanii,
- wybór brandu,
- wybór miasta,
- wybór listy kierunków,
- generowanie 3 formatów Google Ads,
- raport błędów i ostrzeżeń.

### 8. Clean Google asset mode

Cel: przygotować alternatywny tryb eksportu bez tekstu, CTA i logo dla assetowego modelu Google Ads / Performance Max.

Zakres:

- samo zdjęcie,
- opcjonalny subtelny brand frame,
- bez tekstów na grafice,
- zgodność z rekomendacjami assetowymi Google Ads.
