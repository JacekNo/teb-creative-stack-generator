# 05 — Validation rules

## Statusy walidacji

| Status | Znaczenie |
|---|---|
| OK | można eksportować |
| WARNING | można eksportować, ale zalecany przegląd |
| ERROR | nie eksportować bez poprawy |

## Reguły dla kierunku

- `course_title` jest wymagane.
- `brand` jest wymagany.
- `offer_type` jest wymagany.
- Bardzo długie nazwy powinny zostać podzielone na `course_title` i `course_subtitle`.
- Jeżeli tekst osiąga minimalny rozmiar fontu, walidator powinien zwrócić WARNING.
- Jeżeli tekst nie mieści się mimo wariantu kompaktowego, walidator powinien zwrócić ERROR.

## Reguły dla miasta

- Bierzemy tylko miasta z matrycy TEB.
- Miasto powinno mieć formę:
  - mianownik,
  - miejscownik,
  - gotowy display, np. „w Pile”.
- Długie miasta powinny być testowane osobno:
  - Piotrków Trybunalski,
  - Gorzów Wielkopolski,
  - Ostrów Wielkopolski,
  - Bielsko-Biała,
  - Jastrzębie-Zdrój,
  - Wodzisław Śląski.

## Reguły dla zdjęć

- Każdy kierunek powinien mieć przypisane zdjęcie.
- Źródło zdjęcia: 1080×720.
- Brak zdjęcia = ERROR dla eksportu produkcyjnego.
- Domyślny focal point: `0.5 / 0.5`.
- Zdjęcia problematyczne powinny mieć `image_status = needs-review`.

## Reguły dla brandu

- PKU i KKZ korzystają z brandu TEB Kursy.
- SP rozdzielamy na TEB Szkoły Policealne lub TEB Szkoły Medyczne zgodnie z danymi oferty.
- PKU Online pomijamy.

## Reguły dla social-ready fields

- Brak pól social media nie blokuje Google Ads MVP.
- Jeżeli social template wymaga `start_label`, `advantages` lub `partners`, brak tych danych powinien dawać WARNING albo ERROR zależnie od szablonu.
