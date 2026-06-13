# DEC-004 — SVG jako kierunek renderowania

## Status

proposed

## Data

2026-06-02

## Kontekst

Generator musi składać grafiki z danych, zdjęć, tekstu i brand tokens, a następnie eksportować je do PNG.

## Decyzja

Preferowanym kierunkiem renderowania jest SVG jako warstwa pośrednia, a następnie eksport do PNG.

## Alternatywy

- HTML/CSS screenshot,
- Canvas,
- ręczny eksport z Figmy,
- bezpośrednie składanie bitmap.

## Uzasadnienie

SVG daje dobrą kontrolę nad layoutem, skalowaniem, tekstem i komponentami. Jest czytelny jako format pośredni i dobrze pasuje do projektowego myślenia o szablonach.

## Konsekwencje

Trzeba rozwiązać fitting tekstu, dostępność fontu Roc Grotesk i stabilne renderowanie do PNG.
