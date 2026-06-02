# 06 — Export rules

## Formaty Google Ads

Docelowe formaty MVP:

- 1200×1200
- 1200×628
- 960×1200

## Format pliku

Preferowany eksport produkcyjny:

- PNG
- paczka ZIP dla wielu grafik

Opcjonalnie później:

- JPG
- WebP

## Nazewnictwo plików

Roboczy schemat:

```txt
{brand}_{city_slug}_{course_slug}_{format}.png
```

Przykład:

```txt
policealne_piotrkow-trybunalski_technik-uslug-kosmetycznych_1200x1200.png
```

## Zasady

- Nazwy plików powinny być bez polskich znaków.
- Spacje zamieniamy na myślniki.
- Nie używamy wielkich liter.
- Wersje robocze mogą zawierać suffix `_preview`.
- Wersje zatwierdzone nie powinny zawierać dodatkowych opisów ręcznych.

## Eksport masowy

Eksport masowy powinien:
1. Pominąć rekordy z ERROR.
2. Wyświetlić raport ostrzeżeń.
3. Spakować gotowe grafiki do ZIP.
4. Dodać opcjonalny raport CSV/JSON z wynikami walidacji.
