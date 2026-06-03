# 09 — Decisions

Ten dokument jest indeksem decyzji. Szczegółowe wpisy znajdują się w folderze `docs/decisions`.

## Lista decyzji

| ID | Tytuł | Status |
|---|---|---|
| DEC-001 | Data-first creative stack | accepted |
| DEC-002 | Social-ready data model | accepted |
| DEC-003 | PKU i KKZ jako TEB Kursy | accepted |
| DEC-004 | SVG jako kierunek renderowania | proposed |
| DEC-005 | Lekka dokumentacja projektowa | accepted |

# docs/08_changelog.md

## 2026-06-03

### Added

* Utworzono nowe repozytorium `teb-creative-stack-generator`.
* Uruchomiono projekt lokalny na bazie Vue 3, TypeScript i Vite.
* Dodano strukturę modułu `ads-generator`.
* Dodano produkcyjną bibliotekę zdjęć w `public/creative-stack/images`.
* Dodano dane generatora:

  * `courses.normalized.json`
  * `cities.normalized.json`
  * `brands.json`
  * `image-map.final.json`
  * `campaigns.json`
* Dodano resolver danych `resolveCreativeInput()`, który łączy kierunek, miasto, brand, zdjęcie, logo i CTA.
* Dodano playground do testowania pojedynczego kierunku i miasta.
* Dodano podgląd SVG dla 3 formatów Google Ads:

  * 1200×1200
  * 1200×628
  * 960×1200
* Podpięto prawdziwe logo TEB Edukacja SVG.
* Dodano roboczą strukturę layoutu SVG:

  * zdjęcie,
  * brandowe tło,
  * pattern,
  * biała karta tytułu,
  * action row: CTA / miasto / logo.
* Dodano text fitting v0.1 dla tytułów, dopisków i miasta.
* Dodano walidator jakości kreacji.
* Dodano widok Quality Overview do przeglądu całej bazy kierunków.

### Changed

* Przyjęto zasadę rozdzielenia UI aplikacji od grafiki wynikowej.
* Przyjęto, że layouty grafik są konfigurowane w TypeScript, głównie w `googleAdsLayouts.ts`.
* Przyjęto, że Figma Dev Mode będzie źródłem wartości wizualnych, ale nie silnikiem produkcyjnym.
* Zmieniono typ `brandKey` w `ResolvedCreativeInput` na `BrandKey`, aby umożliwić walidację wartości `unknown`.

### Current status

Projekt znajduje się na etapie technicznego MVP:

```txt
data foundation
+
SVG preview
+
text fitting v0.1
+
quality validation
```

Eksport PNG i ZIP nie są jeszcze wdrożone.

### Next

* Refactor globalnych stylów UI.
* Rozbicie renderera SVG na mniejsze pliki.
* Kalibracja layoutów Google Ads.
* Podpięcie fontu Roc Grotesk.
* Przygotowanie eksportu PNG.

---

# docs/decisions/DEC-003-separate-app-ui-and-creative-output.md

# DEC-003 — Oddzielenie UI aplikacji od grafiki wynikowej

## Data

2026-06-03

## Status

Accepted

## Kontekst

Generator ma dwa różne obszary:

```txt
1. UI aplikacji
   panel, lista, filtry, formularze, walidacja, Quality Overview

2. Grafika wynikowa
   SVG, layout reklam, zdjęcie, brand tokens, logo, CTA, eksport PNG
```

Na obecnym etapie UI aplikacji jest robocze, ale grafika wynikowa musi być rozwijana jako osobny system produkcyjny. Mieszanie stylów aplikacji z layoutem reklam utrudniłoby późniejszy eksport, walidację i rozwój modułów social media.

## Decyzja

Oddzielamy warstwę UI aplikacji od warstwy Creative Output.

UI aplikacji będzie korzystać z globalnych plików CSS:

```txt
src/styles/tokens.css
src/styles/base.css
src/styles/components.css
```

Grafika wynikowa będzie opisywana przez konfigurację TypeScript i renderery SVG:

```txt
src/modules/ads-generator/renderer/googleAdsLayouts.ts
src/modules/ads-generator/renderer/renderAdSvg.ts
src/modules/ads-generator/renderer/textFit.ts
```

CSS aplikacji nie powinien sterować finalnym wyglądem reklam.

## Uzasadnienie

SVG potrzebuje konkretnych wartości liczbowych:

```txt
x
y
width
height
radius
padding
fontSize
lineHeight
gap
```

Dlatego layout reklam jest łatwiejszy do walidacji, eksportu i kalibracji, gdy istnieje jako jawna konfiguracja TypeScript.

## Alternatywy

### CSS jako źródło layoutu reklam

Odrzucone, ponieważ eksport SVG/PNG i walidacja wymagałyby odtwarzania wartości z CSS.

### Figma jako silnik produkcyjny

Odrzucone, ponieważ Figma ma pozostać źródłem projektu wizualnego, ale generator musi działać lokalnie i automatycznie.

## Konsekwencje

* Layout reklam będzie rozwijany w `googleAdsLayouts.ts`.
* Figma Dev Mode będzie używana do przenoszenia wartości do layout configu.
* UI aplikacji może być rozwijane niezależnie od wyglądu grafik.
* Eksport PNG będzie łatwiejszy do wdrożenia, bo output nie będzie zależny od CSS aplikacji.
