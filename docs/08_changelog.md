# 08 — Changelog

## 2026-06-04 — kalibracja layoutu Google Ads i systemu typografii

### Zmiany techniczne

* Rozbito renderer SVG na mniejsze moduły odpowiedzialne za osobne części kreacji:

  * `renderPattern.ts`
  * `renderPhoto.ts`
  * `renderTitleCard.ts`
  * `renderActionRow.ts`
  * `renderLocalCta.ts`
  * `renderBrandAnchor.ts`
  * `renderSvgFonts.ts`
  * `svgUtils.ts`
* `renderAdSvg.ts` pełni teraz rolę orkiestratora całego SVG.
* `renderActionRow.ts` został uproszczony do składania dwóch komponentów:

  * `LocalCTA`
  * `BrandAnchor`
* Dodano resolver wariantów `LocalCTA`:

  * `button-plus-city`
  * `stacked`
  * przygotowany, ale jeszcze niewdrożony wariant `single-button`
* Dodano fallback: jeżeli miasto nie mieści się między CTA a logo, `LocalCTA` automatycznie przełącza się na wariant `stacked`, zamiast ucinać nazwę miasta wielokropkiem.
* Uporządkowano `googleAdsLayouts.ts` jako jawny config layoutów dla formatów:

  * `1200×1200`
  * `1200×628`
  * `960×1200`
* Zmieniono model `titleCard` na logikę typu `hug content`:

  * szerokość karty wynika z szerokości tekstu + paddingów,
  * wysokość karty wynika z liczby linii + paddingów,
  * `maxWidth` i `maxHeight` pełnią rolę limitów, a nie stałych wymiarów.
* Zaktualizowano walidator `validateGoogleAdsCreative.ts`, aby korzystał z `maxWidth` / `maxHeight` zamiast usuniętych pól `width` / `height`.
* Dodano reguły poprawiające polskie łamanie tekstu, aby unikać zostawiania krótkich wyrazów na końcu linii, np. `i`, `z`, `w`, `do`, `na`, `oraz`.

### Zmiany UI / layout

* Ustabilizowano położenie logotypu jako osobnego komponentu `BrandAnchor`.
* Usunięto dodatkowy niebieski prostokąt spod logo, ponieważ SVG logotypu zawiera własne tło.
* Ustalono stały rozmiar logo SVG: `230×119 px`.
* CTA i miasto zachowują stałe wysokości — długie nazwy miast nie spłaszczają przycisku.
* Wariant `stacked` podnosi grupę `LocalCTA` w górę, zachowując wyrównanie dolnej krawędzi z logo.
* Poprawiono skalę i czytelność `LocalCTA`.
* Skorygowano `CourseTitleCard` dla formatu horyzontalnego `1200×628`, aby lepiej obsługiwał długie nazwy kierunków.
* Dopuszczono większą pojemność tekstową dla landscape, w tym łamanie tytułu do większej liczby linii.
* Poprawiono zachowanie apli tytułu, aby nie zostawiała dużego pustego marginesu po prawej stronie.

### Assety i fonty

* Podmieniono bibliotekę zdjęć kierunków na wersje HD `1920×1280`.
* Dodano webfonty Roc Grotesk:

  * `Roc Grotesk Regular`
  * `Roc Grotesk Medium`
  * `Roc Grotesk Bold`
  * `Roc Grotesk Wide Medium`
  * `Roc Grotesk Wide Bold`
* Fonty zostały podpięte zarówno do aplikacji, jak i do generowanego SVG przez `renderSvgFonts.ts`.
* Ustalono, że bazowym fontem dla tytułów będzie `Roc Grotesk Bold`, a wariant `Wide` zostaje do dalszych testów, ponieważ mocno wpływa na szerokość tekstu.

### Status

* Build projektu przechodzi po zmianach.
* Generator renderuje trzy formaty Google Ads.
* Obecny etap layoutu i typografii jest gotowy do dalszej kalibracji oraz rozpoczęcia prac nad walidatorem czytelności i eksportem PNG.


## 2026-06-04

- Rozbito renderer SVG na mniejsze moduły odpowiedzialne za osobne części kreacji:
  - `renderPattern.ts`
  - `renderPhoto.ts`
  - `renderTitleCard.ts`
  - `renderActionRow.ts`
  - `svgUtils.ts`
- `renderAdSvg.ts` pełni teraz rolę orkiestratora całego SVG.
- Dodano globalną strukturę stylów aplikacji:
  - `src/styles/tokens.css`
  - `src/styles/base.css`
  - `src/styles/components.css`
- `src/style.css` pełni teraz rolę pliku wejściowego dla stylów.
- Odchudzono style widoku `AdsGeneratorPlayground.vue`.
- Uporządkowano `googleAdsLayouts.ts` jako jawny config layoutów dla formatów Google Ads.
- Build projektu przechodzi po refactorach.

## 2026-06-02

- Utworzono pakiet dokumentacji projektowej v0.1.
- Przyjęto podejście Creative Stack: dane → komponenty → SVG → eksport.
- Ustalono, że pierwszy use case to Google Ads.
- Ustalono, że projekt ma być przygotowany pod późniejsze social media.
- Uwzględniono pola przyszłościowe: start, przewagi, partnerzy, certyfikaty, dane kampanijne.
- Przyjęto, że PKU i KKZ korzystają z kolorystyki TEB Kursy.
- Przyjęto, że PKU Online jest poza zakresem.

## 2026-06-02

- Dodano pierwszy resolver danych dla kreacji.
- Dodano smoke test danych: kierunek + miasto + brand + zdjęcie.
- Dodano roboczy renderer SVG dla 3 formatów Google Ads.
- Potwierdzono działanie pipeline’u: dane → SVG preview.

