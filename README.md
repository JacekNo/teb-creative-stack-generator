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
