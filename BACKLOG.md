# Backlog — TEB Creative Stack Generator

## Done

* Rozbito renderer SVG na mniejsze moduły.
* Dodano wspólne helpery SVG w `svgUtils.ts`.
* Dodano globalną strukturę stylów aplikacji:

  * `src/styles/tokens.css`
  * `src/styles/base.css`
  * `src/styles/components.css`
  * `src/styles/fonts.css`
* Uporządkowano `googleAdsLayouts.ts` jako centralny config layoutów Google Ads.
* Przebudowano `CourseTitleCard` w kierunku logiki `hug content`.
* Dostosowano walidator do nowego modelu `titleCard` opartego o `minWidth`, `maxWidth`, `minHeight`, `maxHeight`.
* Dodano poprawki polskiego łamania tekstu, aby unikać wdów i bękartów na końcach linii.
* Wydzielono dolny pasek na:

  * `LocalCTA`
  * `BrandAnchor`
* Dodano resolver wariantów `LocalCTA`.
* Dodano wariant `stacked` dla długich miast.
* Dodano fallback do `stacked`, gdy miasto nie mieści się między CTA a logo.
* Ustabilizowano rozmiar CTA, miasta i logo.
* Usunięto dodatkową aplę pod logo SVG.
* Podmieniono zdjęcia kierunków na wersje HD `1920×1280`.
* Dodano fonty Roc Grotesk do projektu i SVG.

## Now

### 1. Finalna kalibracja typografii i layoutu

Cel: dopracować skalę typograficzną oraz odstępy w trzech formatach Google Ads.

Zakres:

* sprawdzić tytuły krótkie, średnie i bardzo długie,
* dopracować `title.fontSize`, `lineHeight`, `maxLines`,
* dopracować `subtitle.fontSize`,
* dopracować `LocalCTA` dla:

  * krótkich miast,
  * średnich miast,
  * długich miast,
* sprawdzić, czy `stacked` nie koliduje z title card i logo,
* ustalić finalne użycie:

  * `Roc Grotesk Bold`,
  * `Roc Grotesk Medium`,
  * opcjonalnie `Roc Grotesk Wide`.

### 2. Walidator czytelności

Cel: generator powinien informować, które kreacje są bezpieczne, a które wymagają ręcznej kontroli.

Planowane ostrzeżenia:

* tytuł osiągnął minimalny font,
* tytuł został przycięty,
* miasto zostało przycięte,
* użyto wariantu `stacked`,
* nazwa kierunku przekroczyła zalecaną liczbę linii,
* tekst po skalowaniu do 25% może być zbyt mały,
* zdjęcie używa fallbackowego cropu lub wymaga korekty focal point.

### 3. Podgląd skalowania

Cel: dodać w UI podgląd grafik w skalach:

* 100%,
* 50%,
* 25%.

Pozwoli to szybciej oceniać czytelność po skalowaniu Google Ads.

## Next

### 1. Eksport PNG

Cel: przygotować eksport gotowych grafik z SVG do PNG.

Preferowany kierunek:

* `SVG` jako format master,
* `PNG` jako format eksportowy,
* później eksport paczki ZIP.

Do sprawdzenia:

* `@resvg/resvg-js`,
* `sharp`,
* obsługa fontów w eksporcie,
* obsługa obrazów lokalnych,
* nazewnictwo plików eksportowych.

### 2. Batch export

Cel: wygenerować zestawy grafik dla wielu kierunków i miast.

Zakres:

* wybór kampanii,
* wybór brandu,
* wybór miasta,
* wybór listy kierunków,
* generowanie 3 formatów Google Ads,
* raport błędów i ostrzeżeń.

### 3. Clean Google asset mode

Cel: przygotować alternatywny tryb eksportu bez tekstu, CTA i logo dla assetowego modelu Google Ads / Performance Max.

Zakres:

* samo zdjęcie,
* opcjonalny subtelny brand frame,
* bez tekstów na grafice,
* zgodność z rekomendacjami assetowymi Google Ads.
