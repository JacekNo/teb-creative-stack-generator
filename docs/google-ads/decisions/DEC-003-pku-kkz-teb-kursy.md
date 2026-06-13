# DEC-003 — PKU i KKZ jako TEB Kursy

## Status

accepted

## Data

2026-06-02

## Kontekst

W ofercie występują typy PKU i KKZ. Wizualnie mają korzystać z tego samego zestawu kolorystycznego.

## Decyzja

PKU i KKZ są mapowane do brandu wizualnego `kursy`, czyli TEB Kursy.

## Alternatywy

- osobny brand dla PKU,
- osobny brand dla KKZ,
- mapowanie zależne od kierunku.

## Uzasadnienie

Upraszcza to system brand tokens i jest zgodne z założeniem projektu.

## Konsekwencje

W danych zachowujemy `offer_type`, ale renderer używa wspólnego brandu `kursy`.
