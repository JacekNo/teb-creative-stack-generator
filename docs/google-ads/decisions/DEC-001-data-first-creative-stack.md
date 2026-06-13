# DEC-001 — Data-first creative stack

## Status

accepted

## Data

2026-06-02

## Kontekst

Generator ma tworzyć wiele wariantów grafik na podstawie powtarzalnych danych: kierunek, miasto, brand, zdjęcie, CTA i format. Projekt ma później obsłużyć również social media, gdzie liczba zmiennych będzie większa.

## Decyzja

Podstawą projektu jest model danych i pipeline kreatywny:

```txt
Dane → normalizacja → komponenty → SVG → eksport
```

## Alternatywy

- ręczne przygotowywanie grafik w Figmie,
- generowanie każdej kreacji jako osobnego layoutu,
- szablon oparty wyłącznie o HTML/CSS screenshot.

## Uzasadnienie

Podejście data-first pozwala skalować projekt, utrzymać spójność i łatwiej dodawać kolejne formaty.

## Konsekwencje

Trzeba dobrze przygotować model danych, walidację i reguły typograficzne przed pełnym renderowaniem grafik.
