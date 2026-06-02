# 02 — Data model

## Zasada

Dane mają być przygotowane pod skład graficzny, a nie tylko jako lista z Excela. Dlatego długie nazwy kierunków powinny być rozdzielane na logiczne pola, np. `course_title` i `course_subtitle`.

## Główne encje

- Course
- City
- Brand
- ImageAsset
- Campaign
- Template
- ExportFormat

## Course

| Pole | Typ | Wymagane dla Google Ads | Przyszłe użycie social media | Opis |
|---|---|---:|---:|---|
| id | string | tak | tak | stabilny identyfikator |
| offer_type | SP / PKU / KKZ | tak | tak | typ oferty |
| brand | kursy / medyczne / policealne | tak | tak | brand wizualny |
| course_name_raw | string | tak | tak | oryginalna nazwa z oferty |
| course_title | string | tak | tak | główna nazwa na grafice |
| course_subtitle | string | opcjonalnie | tak | dopisek, certyfikat, technologia |
| short_title | string | nie | opcjonalnie | skrócona nazwa do ciasnych formatów |
| social_title | string | nie | opcjonalnie | wariant social media |
| slug | string | tak | tak | identyfikator do plików |
| length_class | short / medium / long / very-long | tak | tak | klasyfikacja typograficzna |
| status | active / draft / needs-review / error | tak | tak | status danych |

## City

| Pole | Typ | Opis |
|---|---|---|
| city_nominative | string | miasto w mianowniku, np. Piła |
| city_locative | string | miasto w miejscowniku, np. Pile |
| city_display | string | gotowy napis, np. w Pile |
| city_slug | string | slug do nazw plików |
| needs_review | boolean | czy odmiana wymaga sprawdzenia |

## Brand

| Pole | Typ | Opis |
|---|---|---|
| id | string | kursy / medyczne / policealne |
| name | string | pełna nazwa brandu |
| primary | hex | kolor główny |
| soft | hex | kolor jasny / tło |
| text | hex | kolor tekstu, jeśli potrzebny |
| logo_variant | string | wariant logo |

## ImageAsset

| Pole | Typ | Opis |
|---|---|---|
| course_id | string | powiązanie z kierunkiem |
| image_file | string | nazwa pliku zdjęcia |
| focus_x | number | ognisko kadru 0–1 |
| focus_y | number | ognisko kadru 0–1 |
| image_status | mapped / missing / needs-review | status zdjęcia |

## Campaign

| Pole | Typ | Opis |
|---|---|---|
| id | string | identyfikator kampanii |
| campaign_name | string | nazwa kampanii |
| start_date | string | data startu, np. 2026-09-01 |
| start_label | string | napis marketingowy, np. Start we wrześniu |
| cta | string | CTA |
| headline | string | hasło kampanii |
| subheadline | string | dodatkowy tekst |
| legal_note | string | dopisek formalny |

## Social-ready fields

Pola przewidziane pod social media:

- start_label
- advantages
- partners
- certificates
- duration
- mode
- price_info
- social_headline
- social_subheadline
- legal_note

## Decyzja

Google Ads MVP używa tylko części pól, ale model danych od początku pozostaje gotowy pod social media.
