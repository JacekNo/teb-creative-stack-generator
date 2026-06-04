# BACKLOG.md

## Now

### 1. Refactor app styles and SVG renderer structure

Cel: rozdzielić UI aplikacji od systemu generowania grafik SVG.

Zadania:

* Utworzyć globalne pliki CSS:

  * `src/styles/tokens.css`
  * `src/styles/base.css`
  * `src/styles/components.css`
* Przenieść powtarzalne style z komponentów Vue do globalnych klas UI.
* Zostawić style specyficzne dla komponentów tylko tam, gdzie faktycznie są potrzebne.
* Rozbić renderer SVG na mniejsze pliki:

  * `renderAdSvg.ts`
  * `renderPattern.ts`
  * `renderPhoto.ts`
  * `renderTitleCard.ts`
  * `renderActionRow.ts`
* Utrzymać layouty reklam w `googleAdsLayouts.ts`.
* Sprawdzić `npm run build`.

Proponowany commit:

```txt
Refactor app styles and SVG renderer structure
```

---

### 2. Layout calibration Google Ads v0.2

Cel: skalibrować proporcje 3 formatów Google Ads na podstawie podglądu i danych z Figmy.

Zadania:

* Dopracować format 1200×628, który obecnie wymaga największej korekty.
* Ustawić docelowe proporcje:

  * zdjęcia,
  * białej karty tytułu,
  * action row,
  * logo.
* Ustalić safe area dla każdego formatu.
* Przenieść wartości z Figma Dev Mode do `googleAdsLayouts.ts`.
* Przetestować layout na najtrudniejszych nazwach kierunków i miast.

---

### 3. Typography and text fitting v0.2

Cel: poprawić jakość składu tekstu.

Zadania:

* Podpiąć lokalny font Roc Grotesk.
* Ulepszyć text fitting dla tytułów i dopisków.
* Dodać warianty dla klas długości:

  * `short`
  * `medium`
  * `long`
  * `very-long`
* Poprawić obsługę długich miast w action row.
* Rozszerzyć walidator o ostrzeżenia dla minimalnych rozmiarów fontów.

---

## Next

### 4. Export PNG v0.1

Cel: wygenerować realne pliki graficzne z SVG.

Zadania:

* Wybrać metodę renderowania SVG do PNG.
* Przygotować eksport pojedynczej kreacji.
* Przygotować eksport 3 formatów dla jednego kierunku.
* Ustalić nazewnictwo plików eksportowych.
* Dodać raport eksportu.

---

### 5. Batch generation

Cel: przygotować generator do realnej pracy produkcyjnej.

Zadania:

* Dodać wybór wielu kierunków.
* Dodać wybór wielu miast.
* Dodać eksport paczki ZIP.
* Rozdzielić eksport:

  * tylko OK,
  * OK + WARNING,
  * wszystko oprócz ERROR.

---

## Later

### 6. Social media module

Cel: rozszerzyć Creative Stack Generator poza Google Ads.

Zadania:

* Dodać formaty social media.
* Wykorzystać pola:

  * `start_label`
  * `advantages`
  * `partners`
  * `certificates`
  * `claims`
  * `social_headline`
  * `social_subheadline`
* Przygotować osobne layouty social media.
* Rozważyć szablony postów, stories i karuzel.

---

## Done

* Utworzono repo `teb-creative-stack-generator`.
* Dodano projekt Vue 3 + TypeScript + Vite.
* Dodano strukturę modułu `ads-generator`.
* Uporządkowano bibliotekę zdjęć.
* Dodano dane kierunków, miast, brandów i mapę zdjęć.
* Dodano resolver danych.
* Dodano smoke test danych.
* Dodano podgląd SVG w 3 formatach Google Ads.
* Podpięto logo TEB Edukacja SVG.
* Dodano roboczy układ: zdjęcie + brandowe tło + karta tytułu + action row.
* Dodano text fitting v0.1.
* Dodano walidator jakości kreacji.
* Dodano Quality Overview dla całej bazy kierunków.
* Rozbito renderer SVG na mniejsze pliki odpowiedzialne za osobne części kreacji.
* Dodano wspólne helpery SVG w `svgUtils.ts`.
* Dodano globalną strukturę stylów UI aplikacji.
* Odchudzono style widoku `AdsGeneratorPlayground.vue`.
* Rozbito renderer SVG na mniejsze pliki.
* Dodano wspólne helpery SVG.
* Dodano globalną strukturę stylów UI.
* Uporządkowano `googleAdsLayouts.ts` jako jawny config layoutów.