# TEB Creative Stack Generator — dokument projektowy

## 1. Cel projektu

**TEB Creative Stack Generator** to lokalne narzędzie do generowania grafik reklamowych dla TEB Edukacja na podstawie danych, zdjęć, brandów i szablonów SVG.

Pierwszym use casem projektu jest generowanie grafik kierunków w trzech formatach Google Ads:

* 1200×1200
* 1200×628
* 960×1200

Projekt ma być rozwijany jako baza pod szerszy system generowania kreacji stackowych, w przyszłości również dla social media, kampanii sezonowych, grafik lokalnych i innych formatów marketingowych.

---

## 2. Problem, który rozwiązujemy

Ręczne przygotowywanie wielu wariantów grafik reklamowych jest czasochłonne, podatne na błędy i trudne do skalowania.

Największe problemy:

* różna długość nazw kierunków,
* różna długość nazw miast,
* konieczność utrzymania spójności brandowej,
* potrzeba generowania wielu formatów z tych samych danych,
* ręczne przypisywanie zdjęć do kierunków,
* brak szybkiej kontroli jakości przed eksportem.

Generator ma uporządkować ten proces i zamienić go w powtarzalny pipeline:

```txt
dane → resolver → layout SVG → walidacja → podgląd → eksport
```

---

## 3. Zakres MVP

Zakres obecnego MVP obejmuje:

* lokalne repo `teb-creative-stack-generator`,
* frontend Vue 3 + TypeScript + Vite,
* strukturę modułu `ads-generator`,
* dane kierunków, miast, brandów i zdjęć,
* czystą bibliotekę zdjęć produkcyjnych,
* resolver danych,
* playground do testowania wybranego kierunku i miasta,
* podgląd SVG w 3 formatach Google Ads,
* prawdziwe logo SVG TEB Edukacja,
* roboczy layout SVG,
* text fitting v0.1,
* walidator jakości kreacji,
* widok Quality Overview dla całej bazy kierunków.

Poza zakresem obecnego MVP:

* eksport PNG/JPG,
* eksport ZIP,
* backend,
* panel administracyjny,
* pełna edycja layoutu z UI,
* automatyczna publikacja reklam,
* finalne social media templates.

---

## 4. Główne założenia projektowe

### 4.1. Oddzielamy UI narzędzia od grafiki wynikowej

Projekt ma dwie osobne warstwy:

```txt
App UI
panel, lista, filtry, walidacja, playground

Creative Output
SVG, layouty, zdjęcia, brand tokens, eksport
```

UI aplikacji może być robocze i rozwijane iteracyjnie. Grafika wynikowa musi mieć osobny system layoutu, niezależny od CSS aplikacji.

---

### 4.2. Layouty grafik są konfigurowane w TypeScript, nie w CSS

Generowane SVG powinny korzystać z danych liczbowych:

```ts
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

Dlatego kluczowe ustawienia layoutu znajdują się w:

```txt
src/modules/ads-generator/renderer/googleAdsLayouts.ts
```

CSS aplikacji nie powinien sterować finalnym wyglądem grafik eksportowych.

---

### 4.3. Figma jest źródłem prawdy wizualnej, ale nie silnikiem produkcyjnym

Wartości z Figma Dev Mode mogą służyć do kalibracji:

* pozycji,
* wymiarów,
* paddingów,
* promieni,
* font size,
* line height,
* gapów,
* wielkości logo,
* proporcji zdjęcia.

Nie przekładamy jednak CSS z Figmy 1:1 do aplikacji. Przenosimy wartości do `googleAdsLayouts.ts` i rendererów SVG.

---

## 5. Dane projektu

### 5.1. Źródła danych

Dane wejściowe pochodziły z:

* oferty kierunków 2026,
* matrycy adresów / miast,
* pliku z kolorami brandów,
* folderów zdjęć podzielonych na:

  * `kursy`,
  * `medyczne`,
  * `policealne`.

PKU Online zostało pominięte.

PKU i KKZ korzystają z tego samego zestawu kolorystycznego: **TEB Kursy**.

---

### 5.2. Brand tokens

Brandowe zestawy kolorystyczne:

```txt
TEB Kursy
primary: #994365
soft:    #F5EDF0

TEB Szkoły Medyczne
primary: #009489
soft:    #E6F5F4

TEB Szkoły Policealne
primary: #E27D00
soft:    #FDF2E6
```

Logo jest wspólne:

```txt
TEB Edukacja
```

---

### 5.3. Zdjęcia

Zdjęcia zostały oczyszczone i skopiowane do produkcyjnej biblioteki:

```txt
public/creative-stack/images/
  kursy/
  medyczne/
  policealne/
```

Obecny stan:

```txt
94 kierunki
94 docelowe pliki zdjęć
87 unikalnych zdjęć źródłowych
7 zdjęć wykorzystanych dla więcej niż jednego kierunku
```

Stare foldery źródłowe traktujemy jako archiwum robocze. Do projektu wykorzystujemy tylko czystą bibliotekę produkcyjną.

---

## 6. Aktualna struktura projektu

```txt
teb-creative-stack-generator/
  public/
    creative-stack/
      images/
        kursy/
        medyczne/
        policealne/
      logos/
        teb-edukacja.svg
      templates/

  src/
    modules/
      ads-generator/
        components/
          AdsFormatPreview.vue
          AdsGeneratorPlayground.vue
          AdsQualityOverview.vue

        data/
          courses.normalized.json
          cities.normalized.json
          brands.json
          image-map.final.json
          campaigns.json

        renderer/
          googleAdsFormats.ts
          googleAdsLayouts.ts
          renderAdSvg.ts
          textFit.ts

        types/
          ads.types.ts

        utils/
          creativeResolver.ts

        validators/
          validateGoogleAdsCreative.ts

  docs/
    decisions/
    templates/

  BACKLOG.md
  README.md
```

---

## 7. Aktualny pipeline działania

Obecnie aplikacja działa według schematu:

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
podgląd 3 formatów Google Ads
```

Resolver łączy:

* kierunek,
* miasto,
* brand,
* zdjęcie,
* logo,
* CTA,
* kolory,
* dane walidacyjne.

---

## 8. Obecne widoki aplikacji

### 8.1. Playground

Widok do testowania pojedynczego kierunku i miasta.

Funkcje:

* wybór brandu,
* wyszukiwanie kierunku,
* wybór kierunku,
* wybór miasta,
* szybkie przypadki testowe,
* podgląd 3 formatów.

---

### 8.2. Quality Overview

Widok diagnostyczny całej bazy kierunków.

Funkcje:

* lista wszystkich kierunków,
* status OK / WARNING / ERROR,
* filtrowanie po brandzie,
* filtrowanie po statusie,
* wyszukiwarka,
* wybór miasta testowego,
* podgląd wybranego kierunku,
* lista komunikatów walidacyjnych.

---

## 9. Walidacja

Obecny walidator sprawdza:

* czy zdjęcie ma status `mapped`,
* czy kierunek ma flagi przeglądu,
* czy miasto ma flagi przeglądu,
* czy brand został poprawnie rozpoznany,
* czy tytuł mieści się w layoutach,
* czy dopisek mieści się w layoutach,
* czy miasto mieści się w pigułce,
* czy tekst nie schodzi do zbyt małego fontu.

Statusy:

```txt
OK
WARNING
ERROR
```

Walidator nie jest jeszcze finalnym systemem jakości, ale daje podstawę do pracy produkcyjnej.

---

## 10. Obecne ograniczenia

Na obecnym etapie projekt ma kilka świadomych ograniczeń:

* layout nie jest jeszcze pixel perfect,
* landscape wymaga dalszej kalibracji,
* logo wymaga późniejszego dopracowania pozycji i wielkości,
* pattern jest roboczy,
* text fitting jest oparty na estymacji szerokości znaków,
* nie ma jeszcze eksportu PNG,
* nie ma jeszcze eksportu ZIP,
* nie ma jeszcze podpiętego lokalnego fontu Roc Grotesk,
* nie ma jeszcze wariantów layoutu dla ekstremalnie długich nazw,
* nie ma jeszcze panelu ręcznych wyjątków.

---

## 11. Najbliższy plan działań

### Etap 1 — porządkowanie struktury kodu

Cel: oddzielić UI aplikacji od rendererów SVG.

Zadania:

* utworzyć globalne style aplikacji:

  * `src/styles/tokens.css`,
  * `src/styles/base.css`,
  * `src/styles/components.css`,
* odchudzić style w komponentach Vue,
* rozbić renderer SVG na mniejsze pliki:

  * `renderPattern.ts`,
  * `renderPhoto.ts`,
  * `renderTitleCard.ts`,
  * `renderActionRow.ts`,
  * `renderAdSvg.ts`,
* utrzymać layouty reklam w `googleAdsLayouts.ts`.

Efekt: łatwiejsza praca nad UI i osobno nad grafiką wynikową.

---

### Etap 2 — kalibracja layoutów Google Ads

Cel: doprowadzić 3 formaty do stabilnej konstrukcji wizualnej.

Zadania:

* poprawić proporcje formatu 1200×628,
* dopracować pozycję zdjęcia,
* dopracować kartę tytułu,
* dopracować action row:

  * CTA,
  * miasto,
  * logo,
* ustalić docelowe marginesy i safe area,
* wykorzystać wartości z Figma Dev Mode,
* przetestować layout na najtrudniejszych kierunkach.

Efekt: stabilny layout roboczy gotowy pod eksport.

---

### Etap 3 — typografia i text fitting v0.2

Cel: poprawić jakość składu tekstu.

Zadania:

* podpiąć font Roc Grotesk,
* poprawić estymację szerokości tekstu,
* dodać warianty tytułów:

  * short,
  * medium,
  * long,
  * very-long,
* lepiej obsłużyć `courseTitle` i `courseSubtitle`,
* dodać statusy ostrzegawcze dla minimalnych rozmiarów fontu,
* przetestować najdłuższe nazwy kierunków i miast.

Efekt: długie nazwy nie rozwalają layoutu i są czytelne.

---

### Etap 4 — eksport grafik

Cel: wygenerować prawdziwe pliki wyjściowe.

Zadania:

* wybrać silnik eksportu SVG → PNG,
* przygotować eksport pojedynczej kreacji,
* przygotować eksport 3 formatów dla jednego kierunku,
* przygotować eksport paczki ZIP,
* ustalić nazewnictwo plików,
* dodać kontrolę, czy eksportować tylko OK, czy też WARNING.

Przykładowy schemat nazewnictwa:

```txt
brand_miasto_kierunek_format.png
```

lub:

```txt
kursy_pila_pku-barber_1200x1200.png
```

Efekt: generator produkuje realne grafiki do kampanii.

---

### Etap 5 — workflow produkcyjny

Cel: zamienić narzędzie w praktyczny proces pracy.

Zadania:

* dodać wybór wielu kierunków,
* dodać wybór wielu miast,
* dodać tryb masowego generowania,
* dodać raport eksportu,
* dodać listę plików wygenerowanych,
* rozdzielić kreacje:

  * gotowe,
  * wymagające przeglądu,
  * błędne.

Efekt: narzędzie można wykorzystać w realnej produkcji grafik.

---

### Etap 6 — przygotowanie pod social media

Cel: rozszerzyć model bez przepisywania systemu.

Zadania:

* zachować obecny model danych jako bazę,
* wykorzystać pola:

  * start,
  * przewagi,
  * partnerzy,
  * certyfikaty,
  * claims,
  * social headline,
  * social subheadline,
* dodać formaty social media,
* stworzyć osobne layouty social,
* rozważyć karuzele i grafiki kampanijne.

Efekt: Google Ads staje się pierwszym modułem większego Creative Stack Generatora.

---

## 12. Priorytety na najbliższą sesję

Najbliższa sesja powinna skupić się na porządkowaniu projektu, a nie dodawaniu nowych funkcji.

Priorytet:

```txt
Refactor app styles and SVG renderer structure
```

Zakres:

1. Dodać globalne pliki CSS dla UI aplikacji.
2. Przenieść powtarzalne style z komponentów Vue.
3. Rozbić renderer SVG na mniejsze funkcje/pliki.
4. Zachować aktualne działanie aplikacji.
5. Uruchomić `npm run build`.
6. Zacommitować zmianę.

Proponowany commit:

```txt
Refactor app styles and SVG renderer structure
```

---

## 13. Zasady pracy projektowej

Po każdej większej sesji aktualizujemy:

* `BACKLOG.md`,
* `docs/08_changelog.md`,
* `docs/decisions/`, jeśli podjęto ważną decyzję.

Dokumentacja ma być lekka i praktyczna. Nie opisujemy wszystkiego, tylko decyzje, kierunek, ograniczenia i następne działania.

---

## 14. Aktualny status

Projekt znajduje się na etapie:

```txt
MVP techniczne / Google Ads preview + quality validation
```

Status:

```txt
Repo działa.
Dane są podpięte.
Zdjęcia są uporządkowane.
Resolver działa.
Podgląd SVG działa.
Walidacja działa.
Quality Overview działa.
Eksport PNG jeszcze nie istnieje.
Layout wymaga kalibracji.
```

Najbliższy kierunek:

```txt
porządek struktury → kalibracja layoutów → typografia → eksport
```
