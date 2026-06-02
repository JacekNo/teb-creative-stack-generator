# 04 — Generator architecture

## Zasada architektoniczna

Generator nie powinien być zbiorem ręcznych wyjątków. Powinien działać jako pipeline:

```txt
Dane
→ walidacja
→ normalizacja
→ dobór szablonu
→ dobór wariantu layoutu
→ fitting tekstu
→ kadrowanie zdjęcia
→ render SVG
→ eksport PNG
→ raport walidacji
```

## Warstwy systemu

### 1. Data layer

Odpowiada za:
- wczytanie danych z JSON/XLSX,
- normalizację nazw,
- mapowanie brandów,
- mapowanie zdjęć,
- odmianę miast.

### 2. Template layer

Odpowiada za:
- formaty Google Ads,
- pozycje elementów,
- tokeny brandów,
- warianty layoutu.

### 3. Renderer layer

Odpowiada za:
- skład SVG,
- wstawianie tekstu,
- wstawianie zdjęcia,
- eksport PNG.

### 4. Validation layer

Odpowiada za:
- brakujące dane,
- zbyt długie teksty,
- brakujące zdjęcia,
- minimalne rozmiary fontów,
- problemy z miastami.

### 5. UI layer

Odpowiada za:
- wybór danych,
- podgląd 3 formatów,
- komunikaty walidatora,
- eksport.

## Planowana struktura modułu

```txt
src/
  modules/
    ads-generator/
      components/
      data/
      renderer/
      validators/
      types/
```

## Zasada separacji

Szablon nie powinien zawierać danych. Dane są dostarczane do szablonu przez renderer.
