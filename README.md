# TEB Creative Stack Generator

Lekki generator kreacji reklamowych dla TEB Edukacja, oparty o dane, komponenty, szablony SVG, design system i reguły walidacji.

Projekt rozwija się w dwóch równoległych kierunkach:

- `ads-generator` — moduł grafik Google Ads, który stanowi pierwszy działający fundament projektu.
- `social-generator` — moduł grafik social media, rozwijany jako bardziej responsywny system kompozycji oparty o dane kierunku, format, brand i design tokens.

## Cel projektu

Celem projektu jest stworzenie narzędzia do szybkiego, spójnego i skalowalnego generowania materiałów graficznych TEB dla wielu kierunków, miast, marek i formatów.

Pierwszym zastosowaniem był generator Google Ads. Aktualnie rozwijany jest moduł social media, który ma stać się podstawą do generowania zestawów grafik z jednego draftu kreacji.

## Status projektu

### Google Ads

Moduł Google Ads ma działające techniczne MVP.

Obecnie działa:

- lokalny projekt Vue 3 + TypeScript + Vite,
- moduł `ads-generator`,
- dane kierunków, miast, brandów i zdjęć,
- resolver danych,
- podgląd SVG w 3 formatach Google Ads,
- prawdziwe logo TEB Edukacja SVG,
- podpięte fonty Roc Grotesk,
- text fitting i logika łamania długich nazw,
- podstawowy walidator jakości kreacji,
- roboczy widok kontroli jakości.

Do dopracowania:

- finalna kalibracja layoutów,
- eksport PNG,
- eksport ZIP,
- batch generation,
- raport eksportu i walidacji.

### Social Generator

Moduł `social-generator` jest aktywnie rozwijany na gałęzi:

```txt
feature/social-generator
```

Zrealizowano:

- strukturę modułu `src/modules/social-generator/`,
- wspólną warstwę `src/modules/creative-stack/`,
- formaty social:
  - `1080×1080`,
  - `1080×1350`,
  - `1080×1920`,
- mockowe dane social i partnerów,
- helper `publicAssetPath.ts` obsługujący `BASE_URL`,
- podgląd jednego aktywnego formatu:
  - `SocialPreviewStage.vue`,
  - `SocialGeneratorSmokeTest.vue`,
- renderery SVG elementów social,
- debug overlay dla safe zone i slotów,
- osobny social design system:
  - `socialDesignTokens.ts`,
  - `createSocialDesignSystem.ts`,
- model danych:
  - `courseNameParts`,
  - `courseFacts`,
  - `courseBadges`,
- renderery:
  - `renderSocialCourseFacts.ts`,
  - `renderSocialCourseBadges.ts`,
- responsywny title flow:
  - auto-fit po skali tytułu,
  - maksymalnie 3 linie,
  - strukturalny podział nazwy na `main`, `subtitle`, `modeLabel`,
  - pełna szerokość netto dla title card,
  - dynamiczna wysokość title card zależna od treści.

Aktualny kierunek rozwoju:

```txt
jeden draft kreacji
+ jeden aktywny podgląd
+ responsywny layout flow
+ eksport paczki formatów
```

## Najważniejsza decyzja architektoniczna social-generatora

Social Generator nie powinien być zestawem ręcznie utrzymywanych layoutów dla każdego formatu. Projekt przyjmuje model:

```txt
format → brand → design system → layout flow → SVG renderer
```

Użytkownik pracuje na jednym aktywnym podglądzie i przełącza format, np. `1:1`, `4:5`, `9:16`. Dane kreacji pozostają wspólne. Eksport docelowo wygeneruje całą paczkę formatów z jednego draftu.

## Zakres Google Ads MVP

- 3 formaty Google Ads.
- 3 zestawy kolorystyczne brandów:
  - TEB Kursy,
  - TEB Szkoły Medyczne,
  - TEB Szkoły Policealne.
- Wspólny logotyp TEB Edukacja.
- Zmienne elementy: zdjęcie, nazwa kierunku, nazwa miasta, CTA.
- Źródłowe zdjęcia kierunków HD.
- Eksport docelowo: PNG oraz paczka ZIP.

## Zakres Social Generator MVP

- 3 formaty social:
  - square 1080×1080,
  - portrait/feed 1080×1350,
  - stories/reels 1080×1920.
- Jeden aktywny podgląd roboczy.
- Dane kierunku jako struktura informacyjna, nie sztywny układ kampanijny.
- Nazwa kierunku z podziałem:
  - `main`,
  - `subtitle`,
  - `modeLabel`.
- Informacje kierunku:
  - `courseFacts`,
  - `courseBadges`.
- Pominięcie ceny i rat na obecnym etapie social.
- Obsługa kierunków online.
- Logo partnera, jeśli kierunek ma partnera.
- Docelowo realne logo brandu w lewym dolnym rogu.
- Debug overlay dla safe zone, slotów i sekcji layoutu.

## Docelowy pipeline

```txt
Dane wejściowe
→ normalizacja
→ mapowanie assetów
→ wybór brandu i formatu
→ design system
→ responsive layout
→ SVG renderer
→ walidacja
→ render PNG
→ eksport
```

## Stack

- Vue 3
- TypeScript
- Vite
- SVG renderer
- JSON / XLSX jako źródła danych
- Sharp / resvg dla eksportu PNG — planowane
- ZIP export — planowane

## Architektura warstw

Projekt rozdziela dwie warstwy:

```txt
App UI
panel, lista, filtry, playground, quality overview, preview stage

Creative Output
SVG, layouty reklam, brand tokens, design system, zdjęcia, eksport
```

Style aplikacji nie powinny sterować wyglądem finalnych grafik.

Wygląd finalnych grafik powinien wynikać z:

```txt
brand tokens
+ design tokens
+ layout config
+ renderery SVG
```

## Główne katalogi

```txt
src/modules/creative-stack/
  design-system/
  svg-components/
  utils/

src/modules/ads-generator/
  data/
  renderer/
  types/
  validators/

src/modules/social-generator/
  components/
  data/
  design-system/
  renderer/
  types/
```

## Ważne pliki Social Generatora

```txt
src/modules/social-generator/design-system/socialDesignTokens.ts
src/modules/social-generator/design-system/createSocialDesignSystem.ts
src/modules/social-generator/renderer/layout/createSocialResponsiveLayout.ts
src/modules/social-generator/renderer/layout/socialTitleFit.ts
src/modules/social-generator/renderer/renderSocialSvg.ts
src/modules/social-generator/renderer/renderSocialCourseName.ts
src/modules/social-generator/renderer/renderSocialCourseFacts.ts
src/modules/social-generator/renderer/renderSocialCourseBadges.ts
src/modules/social-generator/types/social.types.ts
src/modules/social-generator/data/social-creatives.mock.ts
```

## Design system social

Social Generator korzysta z własnego design systemu opartego o skalę 4 px:

```txt
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128
```

Tokeny definiują:

- brandy,
- kolory,
- typografię,
- line height,
- spacing,
- radius,
- safe zones,
- formaty,
- title card,
- badge,
- logo box,
- partner box,
- info grid.

Zasada:

```txt
wartości liczbowe mogą istnieć w tokenach,
ale nie powinny być powielane bezpośrednio w rendererach.
```

## Komendy

Instalacja zależności:

```bash
npm install
```

Uruchomienie projektu lokalnie:

```bash
npm run dev
```

Build kontrolny:

```bash
npm run build
```

## Zasady pracy

Na początku sesji:

1. Sprawdź `BACKLOG.md`.
2. Sprawdź dokument projektowy modułu, nad którym pracujesz.
3. Wybierz jedno zadanie na sesję.

Na końcu sesji:

1. Uruchom `npm run build`.
2. Zaktualizuj backlog.
3. Dopisz zmianę do dokumentacji lub changeloga.
4. Zrób mały commit opisujący jeden logiczny krok.

## Struktura dokumentacji

```txt
README.md
BACKLOG.md
SOCIAL_GENERATOR_DESIGN.md
docs/
  00_project-overview.md
  01_product-brief.md
  02_data-model.md
  03_visual-system.md
  04_generator-architecture.md
  05_validation-rules.md
  06_export-rules.md
  07_roadmap.md
  08_changelog.md
  09_decisions.md
  decisions/
  templates/
```
