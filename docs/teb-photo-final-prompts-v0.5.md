# TEB — finalne prompty zdjęć pod kierunki edukacyjne v0.5
Data: 2026-06-05

## Status dokumentu

Dokument **v0.5** aktualizuje `teb-photo-final-prompts-v0.4` po pilotażu generowania zdjęć. Wersja v0.4 pozostaje bazą 94 promptów przypisanych do `record_id`, a v0.5 dodaje warstwę techniczną i produkcyjną: format master 4:3, minimalne rozdzielczości, korekty kadrowania, reguły maseczek, ograniczenia tekstów w tle oraz checklistę akceptacji.

## Źródła

- `courses.normalized.json`
- `teb-photo-matrix-v0.2`
- `teb-photo-prompts-v0.3`
- `teb-photo-final-prompts-v0.4`
- pilotaż zdjęć: `sp-opiekun-medyczny`, `sp-asystentka-stomatologiczna-z-elementami-implantologii`, `pku-barber`, `pku-programowanie-python-z-cisco-networking-academy`, `pku-dogoterapeuta`

## Cel v0.5

Celem v0.5 jest doprecyzowanie, **jak generować i kwalifikować zdjęcia**, aby były spójne z marką TEB, naturalne, fotorealistyczne i technicznie gotowe do użycia w generatorze grafik oraz późniejszych cropach reklamowych.

## Podsumowanie bazy promptów

| Parametr | Wartość |
|---|---:|
| Liczba kierunków | 94 |
| Status `prompt-ready` | 93 |
| Status `prompt-ready-needs-brand-review` | 1 |

### Liczba kierunków według rodzin

| Rodzina | Liczba |
|---|---:|
| A01 | 7 |
| A02 | 10 |
| A03 | 19 |
| A04 | 13 |
| A05 | 12 |
| A06 | 9 |
| A07 | 8 |
| A08 | 9 |
| A09 | 3 |
| A10 | 4 |

### Liczba kierunków według marek

| Marka | Liczba |
|---|---:|
| kursy | 69 |
| medyczne | 15 |
| policealne | 9 |
| unknown | 1 |

## Zasady globalne po aktualizacji v0.5

1. **v0.4 pozostaje bazą promptów.**  
   v0.5 nie kasuje promptów kierunkowych, tylko dodaje nadrzędne reguły produkcyjne.

2. **Preferowany format generowania: master 4:3.**  
   Format 4:3 daje więcej przestrzeni góra/dół i ogranicza problem przypadkowo uciętych głów, co potwierdził test `pku-barber`.

3. **Minimalna rozdzielczość mastera: 1920×1440 px.**  
   Preferowane: 2560×1920 px lub więcej, jeśli workflow na to pozwala.

4. **Finalny eksport 16:9: minimum 1920×1080 px.**  
   16:9 traktujemy jako format eksportowy/crop reklamowy, nie jako podstawowy format generowania.

5. **Styl: mniej reklamowo, bardziej edukacyjno-dokumentalnie.**  
   Zdjęcie ma wyglądać jak naturalna scena z zajęć praktycznych, nie jak gotowa reklama placówki.

6. **Pełna głowa głównej postaci w kadrze.**  
   Jeśli instruktor jest widoczny, jego głowa również nie może być przypadkowo ucięta. Alternatywnie instruktor może być pokazany świadomie jako dłoń lub gest wskazujący.

7. **W scenach medycznych/stomatologicznych twarz widoczna domyślnie.**  
   Rękawiczki są akceptowalne. Maseczka może być odłożona jako rekwizyt, ale nie powinna zasłaniać twarzy, jeśli nie jest to konieczne merytorycznie.

8. **Zero czytelnych napisów również w tle.**  
   Zakaz obejmuje nie tylko teksty centralne, ale też plakaty, tablice, ekrany, książki, etykiety, opakowania, dashboardy i oznaczenia ścienne.

9. **Kolor submarki nadal jako akcent 5–15% kadru.**  
   Kolor ma wynikać naturalnie z rekwizytu, tkaniny, detalu tła lub wyposażenia.

10. **Zdjęcie musi być bezpieczne do cropów.**  
    Master 4:3 musi pozwalać na późniejsze cropy: 16:9, 1:1, 1.91:1 i 4:5 bez utraty głowy, dłoni ani kluczowych rekwizytów.

## Specyfikacja techniczna v0.5

| Typ | Proporcja | Minimalna rozdzielczość | Preferowana rozdzielczość | Rola |
|---|---:|---:|---:|---|
| Master źródłowy | 4:3 | **1920×1440 px** | 2560×1920 px | plik źródłowy / archiwalny / baza do cropów |
| Eksport główny | 16:9 | **1920×1080 px** | 2560×1440 px | generator grafik, layouty reklamowe |
| Crop square | 1:1 | 1080×1080 px | 1440×1440 px | social / Google Ads square |
| Crop landscape | 1.91:1 | 1200×628 px | 1920×1005 px | Google Ads landscape |
| Crop vertical | 4:5 | 1080×1350 px | 1600×2000 px | social / reklamy pionowe |

## Korekty produkcyjne v0.5

### LESS_ADVERTISING_MORE_EDUCATIONAL

**Reguła:** Mniej reklamowego uśmiechu i pozowania; więcej naturalnej sceny z zajęć praktycznych.

**Dotyczy:** wszystkie rodziny A01–A10

**Dopisek do promptu:**
> Styl mniej reklamowy, bardziej naturalna fotografia z zajęć praktycznych; subtelna mimika, bez przesadnego uśmiechu i bez sztucznego pozowania.

### MASTER_4_3_SAFE_CROP

**Reguła:** Generować master 4:3 z zapasem nad głową i pełnymi dłońmi/narzędziami w kadrze.

**Dotyczy:** wszystkie rodziny A01–A10

**Dopisek do promptu:**
> Kadr źródłowy 4:3, pełna głowa głównej postaci w kadrze, zapas nad głową, dłonie i narzędzia widoczne w całości, kompozycja bezpieczna do późniejszego cropu 16:9.

### NO_ACCIDENTAL_CROPPED_HEADS

**Reguła:** Zakaz przypadkowo uciętych głów głównych postaci i instruktorów.

**Dotyczy:** wszystkie sceny z ludźmi

**Dopisek do negative promptu:**
> cropped head, cut off head, accidentally cropped face, half-visible instructor face, too tight vertical framing

### VISIBLE_FACE_NO_MASK_BY_DEFAULT

**Reguła:** W scenach medycznych i stomatologicznych twarz bohatera powinna być widoczna. Maseczka raczej odłożona jako rekwizyt niż na twarzy.

**Dotyczy:** A01, A02, wybrane A03 medyczne

**Dopisek do promptu:**
> Twarz bohatera widoczna, bez maseczki na twarzy; maseczka może być odłożona na tacy jako neutralny element wyposażenia.

**Dopisek do negative promptu:**
> face mask covering face, covid-like look, pandemic atmosphere

### NO_BACKGROUND_TEXT

**Reguła:** Zakaz czytelnych napisów nie tylko w centrum, ale też na plakatach, etykietach, ekranach, tablicach i książkach.

**Dotyczy:** wszystkie rodziny, szczególnie A04, A05, A07, A08

**Dopisek do negative promptu:**
> readable wall posters, readable signs, typography in background, readable labels, readable screen text, readable book text, visible brand names

### ANIMAL_NATURAL_AND_CALM

**Reguła:** Zwierzęta mają wyglądać naturalnie, spokojnie i wiarygodnie; scena nie może zmieniać się w przesłodzony stock.

**Dotyczy:** A06

**Dopisek do promptu:**
> Zwierzę spokojne, naturalna anatomia, relacja terapeutyczna lub edukacyjna, nie słodki stockowy obrazek.

**Dopisek do negative promptu:**
> cute stock pet cliché, stressed animal, aggressive animal, distorted animal anatomy, unsafe handling, chaotic room

### IT_NO_CYBERPUNK_NO_READABLE_CODE

**Reguła:** Sceny IT mają pokazywać jasną naukę / pracę projektową, bez cyberpunku, hakera, ciemnego pokoju i czytelnego kodu.

**Dotyczy:** A04

**Dopisek do promptu:**
> Jasna sala komputerowa, naturalna nauka, ekrany z nieczytelnym / abstrakcyjnym kodem lub neutralnym interfejsem, bez logotypów partnerów.

**Dopisek do negative promptu:**
> cyberpunk, hacker room, dark basement, green Matrix code, readable code, Cisco logo, fake software logo



## Wyniki pilotażu

| Kierunek | Rodzina | Wynik | Korekta | Decyzja |
|---|---|---|---|---|
| `sp-opiekun-medyczny` | A01 | poprawny kompozycyjnie i dobrze osadzony, bez większych błędów | lekko zbyt reklamowy vibe; przesunąć styl w stronę naturalnej fotografii edukacyjno-dokumentalnej | kierunek użyteczny po korekcie stylu |
| `sp-asystentka-stomatologiczna-z-elementami-implantologii` | A02 | poprawna scena edukacyjna na modelu/fantomie | preferować brak maseczki na twarzy; maseczka jako rekwizyt; nie ucinać głowy instruktora | wymaga korekty promptu medyczno-stomatologicznego |
| `pku-barber` | A03 | czarny elegancki motyw, skupienie, klient pokazany korzystnie od tyłu/półprofilu, dobra komunikacja fryzury i zarostu | format 16:9 powodował zbyt ciasny kadr i przyciętą głowę | powtórzenie w 4:3 wypadło wyraźnie lepiej; A03 preferuje master 4:3 |
| `pku-programowanie-python-z-cisco-networking-academy` | A04 | poprawna jasna sala komputerowa, naturalna scena nauki, brak cyberpunku i przesady technologicznej | pilnować nieczytelnych ekranów, tablic i książek; bez logotypu Cisco | dobry kierunek dla rodziny A04 IT/digital |
| `pku-dogoterapeuta` | A06 | pozytywna scena: jasna sala terapeutyczno-edukacyjna, spokojna relacja człowiek–pies, pies wiarygodny | pilnować, by rekwizyty nie były zbyt dziecięce, a drugi człowiek w tle nie odciągał uwagi | dobry kierunek dla rodziny A06 zwierzęta / terapia ze zwierzętami |

## Checklista akceptacji zdjęcia

| Obszar | Pytanie kontrolne | Wymagane |
|---|---|---:|
| Realizm | Czy zdjęcie wygląda jak prawdziwa fotografia, nie render AI? | TAK |
| Kierunek | Czy odbiorca od razu rozumie obszar zawodowy bez czytania nazwy? | TAK |
| Kontekst edukacyjny | Czy scena pokazuje naukę kompetencji / zajęcia praktyczne, a nie samą usługę lub reklamę placówki? | TAK |
| Marka | Czy kolor submarki jest subtelnym akcentem 5–15% kadru? | TAK |
| Kompozycja | Czy master 4:3 ma zapas nad głową, pełne dłonie/narzędzia i bezpieczne pole do cropów? | TAK |
| Tekst | Czy nie ma czytelnych napisów, logo, etykiet, tablic, plakatów ani tekstu na ekranach? | TAK |
| Postacie | Czy głowy, dłonie, proporcje i mimika są naturalne? | TAK |
| Rekwizyty | Czy narzędzia mają sens i nie wyglądają jak losowe obiekty AI? | TAK |
| Technika | Czy master ma minimum 1920×1440 px, a eksport 16:9 minimum 1920×1080 px? | TAK |

## Negative prompt globalny — dopisek v0.5

Do globalnego negative promptu należy dopisać:

> cropped head, cut off head, accidentally cropped face, half-visible instructor face, too tight vertical framing, face mask covering face, covid-like look, pandemic atmosphere, readable wall posters, readable signs, typography in background, readable labels, readable screen text, readable book text, visible brand names, fake logos, over-staged advertising photo, exaggerated smile, cyberpunk, hacker room, dark basement, cute stock pet cliché, distorted animal anatomy

## Dopisek do promptów globalnych v0.5

Do każdego promptu kierunkowego należy stosować następującą warstwę produkcyjną:

> Kadr źródłowy 4:3, minimalnie 1920×1440 px, z wyraźnym zapasem nad głową i wokół sylwetki. Pełna głowa głównej postaci w kadrze, dłonie i kluczowe narzędzia widoczne w całości. Kompozycja bezpieczna do późniejszego cropu 16:9 oraz formatów 1:1, 1.91:1 i 4:5. Styl mniej reklamowy, bardziej naturalna fotografia z zajęć praktycznych; subtelna mimika, bez przesadnego uśmiechu i bez sztucznego pozowania. Bez czytelnych napisów, logo, etykiet, tekstów na ekranach, plakatach, tablicach i książkach.

## Kolejność dalszej produkcji

1. A03 — Beauty, wellbeing i usługi osobiste  
2. A04 — IT, digital, AI i technologie  
3. A06 — Zwierzęta, weterynaria i terapia ze zwierzętami  
4. A01/A02 — Medycyna, opieka, diagnostyka i stomatologia  
5. A05/A07/A08/A09/A10 — pozostałe rodziny

## Uwagi końcowe

- `sp-kosmetyka-estetyczna` nadal wymaga weryfikacji submarki (`unknown`).
- Master 4:3 jest od tej wersji rekomendowanym formatem generowania.
- Format 16:9 pozostaje najważniejszym formatem eksportowym do generatora i reklam, ale nie powinien ograniczać generowania źródłowego.

Aktualizacja v0.6 — korekty po testach rodziny A03
1. Kolor wynika z brand_key, nie z rodziny zdjęcia

Rodzina zdjęcia, np. A03 — Beauty, wellbeing i usługi osobiste, określa typ sceny, gest, środowisko i ryzyka wizualne, ale nie może automatycznie narzucać kolorystyki TEB Kursy. Kolor akcentu zawsze wynika z brand_key lub z jawnie określonego wyjątku produkcyjnego.

Przykład: sp-technik-masazysta-z-elementami-fizjoterapii należy do rodziny A03, ale ma brand_key: medyczne, dlatego powinien używać akcentów TEB Szkoły Medyczne #009489 i #B8DDD5, a nie burgundowo-różowych akcentów TEB Kursy.

2. Technik masażysta — spokojny kadr centryczny

Dla sp-technik-masazysta-z-elementami-fizjoterapii preferować spokojny, centryczny kadr skupiony na czynności masażu lub fizjoterapii. Unikać zbyt wielu osób w tle, nadmiaru elementów anatomicznych, przeładowanych półek i zbyt mocnych akcentów kolorystycznych. Scena powinna być medyczno-fizjoterapeutyczna, jasna i profesjonalna, bez przesadnego klimatu spa oraz bez nadmiernie intymnego kadru.

3. Podolog — wyjątek kolorystyczny

Dla sp-podolog dopuszcza się użycie neutralnej kolorystyki głównej marki TEB Edukacja #102D69 i #0F4496, mimo że formalnie kierunek należy do TEB Szkół Policealnych. Wynika to z medyczno-specjalistycznego charakteru wizualnego kierunku. Kolor niebieski powinien pojawiać się jako abstrakcyjny detal scenografii, wyposażenia, tkaniny lub organizera — bez logo, napisów i czytelnego brandingu w obrazie.

4. Podolog — frezarka i czynność zawodowa

Dla sp-podolog nie pokazywać aktywnego kontaktu frezarki ze stopą, jeśli narzędzie nie jest jednoznacznie pokazane przy płytce paznokcia w merytorycznie poprawny sposób. Preferować bezpieczniejsze sceny: ocenę stopy, konsultację, przygotowanie stanowiska, rękawiczki i okulary ochronne, narzędzia odłożone na tacy, kartę konsultacji bez czytelnego tekstu lub neutralną pracę diagnostyczną. Maseczka i okulary ochronne są dopuszczalne jako element profesjonalnego PPE, ale scena nie może wyglądać covidowo ani zabiegowo-agresywnie.