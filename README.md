# TEB Creative Stack Generator

Lekki generator kreacji reklamowych dla TEB Edukacja, oparty o dane, komponenty, szablony SVG i reguły walidacji.

## Cel projektu

Pierwszym zastosowaniem jest generowanie grafik Google Ads dla kierunków TEB Edukacja w 3 formatach. Projekt ma być jednak przygotowany szerzej jako fundament pod późniejsze generowanie grafik stackowych, m.in. pod social media.

## Zakres MVP

- 3 formaty Google Ads.
- 3 zestawy kolorystyczne brandów:
  - TEB Kursy
  - TEB Szkoły Medyczne
  - TEB Szkoły Policealne
- Wspólny logotyp TEB Edukacja.
- Zmienne elementy: zdjęcie, nazwa kierunku, nazwa miasta, CTA.
- Źródłowe zdjęcia kierunków w formacie 1080×720.
- Eksport docelowo: PNG oraz paczka ZIP.

## Docelowy pipeline

```txt
Dane wejściowe
→ normalizacja
→ mapowanie assetów
→ wybór brandu i formatu
→ reguły typograficzne
→ szablon SVG
→ render PNG
→ walidacja
→ eksport
```

## Planowany stack

- Vue 3
- TypeScript
- Vite
- SVG templates / SVG renderer
- Sharp / resvg dla eksportu PNG
- JSON / XLSX jako źródło danych
- ZIP export

## Struktura dokumentacji

```txt
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
BACKLOG.md
```

## Jak korzystać z dokumentacji

Na początku sesji pracy:

1. Sprawdź `BACKLOG.md`.
2. Sprawdź ostatni wpis w `docs/08_changelog.md`.
3. Wybierz jedno zadanie na sesję.

Na końcu sesji pracy:

1. Dopisz krótki wpis do changeloga.
2. Zaktualizuj backlog.
3. Dodaj decyzję do `docs/decisions/`, jeśli zmienił się kierunek projektu.

# Aktualizacje do istniejących dokumentów

## README.md — dopisz / zaktualizuj sekcję „Status projektu”

```md
## Status projektu

Projekt znajduje się na etapie technicznego MVP dla Google Ads.

Obecnie działa:

- lokalny projekt Vue 3 + TypeScript + Vite,
- moduł `ads-generator`,
- dane kierunków, miast, brandów i zdjęć,
- resolver danych,
- playground do testowania wybranego kierunku i miasta,
- podgląd SVG w 3 formatach Google Ads,
- prawdziwe logo TEB Edukacja SVG,
- text fitting v0.1,
- walidator jakości kreacji,
- widok Quality Overview dla całej bazy kierunków.

Jeszcze nie działa:

- eksport PNG,
- eksport ZIP,
- batch generation,
- finalna kalibracja layoutów,
- moduł social media.
```

## README.md — dopisz sekcję „Architektura warstw”

````md
## Architektura warstw

Projekt rozdziela dwie warstwy:

```txt
App UI
panel, lista, filtry, playground, Quality Overview

Creative Output
SVG, layouty reklam, brand tokens, zdjęcia, eksport
````

Style aplikacji nie powinny sterować wyglądem finalnych grafik.

Layouty reklam są definiowane w TypeScript, przede wszystkim w:

```txt
src/modules/ads-generator/renderer/googleAdsLayouts.ts
```

Figma Dev Mode może służyć jako źródło wartości wizualnych, ale nie jest silnikiem produkcyjnym generatora.

````

---

## docs/04_generator-architecture.md — dopisz sekcję „Aktualny pipeline”

```md
## Aktualny pipeline

Obecny przepływ danych wygląda tak:

```txt
courseId + cityId
↓
resolveCreativeInput()
↓
ResolvedCreativeInput
↓
validateGoogleAdsCreative()
↓
renderAdSvg()
↓
podgląd SVG w 3 formatach Google Ads
````

Kluczowe pliki:

```txt
src/modules/ads-generator/utils/creativeResolver.ts
src/modules/ads-generator/validators/validateGoogleAdsCreative.ts
src/modules/ads-generator/renderer/renderAdSvg.ts
src/modules/ads-generator/renderer/googleAdsLayouts.ts
src/modules/ads-generator/renderer/textFit.ts
```

Aktualnie renderer generuje podgląd SVG. Eksport PNG nie został jeszcze wdrożony.

````

## docs/04_generator-architecture.md — dopisz sekcję „Warstwy odpowiedzialności”

```md
## Warstwy odpowiedzialności

### Data layer

Źródła danych generatora:

```txt
courses.normalized.json
cities.normalized.json
brands.json
image-map.final.json
campaigns.json
````

### Resolver layer

Łączy dane kierunku, miasta, brandu, zdjęcia i kampanii w jeden obiekt:

```txt
ResolvedCreativeInput
```

### Validation layer

Sprawdza, czy kreacja jest bezpieczna produkcyjnie:

```txt
OK
WARNING
ERROR
```

### Renderer layer

Generuje SVG na podstawie danych i layout configu.

### App UI layer

Udostępnia playground i Quality Overview. Nie powinna decydować o finalnym wyglądzie reklam.

````

---

## docs/05_validation-rules.md — dopisz sekcję „Aktualne reguły walidacji”

```md
## Aktualne reguły walidacji

Walidator `validateGoogleAdsCreative()` sprawdza:

- status zdjęcia,
- flagi przeglądu kierunku,
- flagi przeglądu miasta,
- poprawność brandu,
- dopasowanie tytułu do karty tytułowej,
- dopasowanie dopisku do karty tytułowej,
- dopasowanie miasta do pigułki w action row,
- minimalne rozmiary fontów.

Statusy:

```txt
OK — kreacja nie ma wykrytych problemów
WARNING — kreacja może wymagać przeglądu
ERROR — kreacja nie powinna być eksportowana bez poprawki
````

Walidacja jest obecnie oparta na estymacji szerokości tekstu. Po podpięciu fontu Roc Grotesk i kalibracji layoutów reguły powinny zostać doprecyzowane.

````

---

## docs/07_roadmap.md — podmień najbliższe etapy

```md
## Roadmap

### Etap 1 — Refactor struktury

- Globalne style UI.
- Rozbicie renderera SVG na mniejsze pliki.
- Utrzymanie obecnego działania aplikacji.
- Build kontrolny.

### Etap 2 — Kalibracja layoutów Google Ads

- Dopracowanie 1200×1200.
- Dopracowanie 1200×628.
- Dopracowanie 960×1200.
- Przeniesienie wartości z Figma Dev Mode do `googleAdsLayouts.ts`.

### Etap 3 — Typografia

- Podpięcie fontu Roc Grotesk.
- Text fitting v0.2.
- Warianty dla długich nazw.
- Lepsza obsługa długich miast.

### Etap 4 — Eksport

- Eksport pojedynczego SVG/PNG.
- Eksport 3 formatów dla jednej kreacji.
- Eksport ZIP.
- Raport eksportu.

### Etap 5 — Produkcja masowa

- Wybór wielu kierunków.
- Wybór wielu miast.
- Eksport tylko kreacji OK / OK + WARNING.
- Raport błędów.

### Etap 6 — Social media

- Format social media.
- Wykorzystanie pól startu, przewag, partnerów i certyfikatów.
- Osobne layouty social.
````
