# DEC-002 — Social-ready data model

## Status

accepted

## Data

2026-06-02

## Kontekst

Pierwszym use casem są grafiki Google Ads, ale projekt ma później obsłużyć social media. Social media będą wymagały dodatkowych pól: start, przewagi, partnerzy, certyfikaty, hasła kampanijne i dopiski.

## Decyzja

Model danych od początku zawiera pola przyszłościowe pod social media, nawet jeśli Google Ads MVP używa tylko części z nich.

## Alternatywy

- przygotować model tylko pod Google Ads,
- później dopisać pola social media bez planu,
- zrobić osobny model dla social media.

## Uzasadnienie

Wspólny model zmniejszy ryzyko przebudowy i pozwoli zachować spójność danych.

## Konsekwencje

Model będzie szerszy niż potrzeby MVP, ale pola przyszłościowe pozostaną opcjonalne.
