# Social Generator — input data audit

## Current sources

Primary source data still lives in the Google Ads module:

- `src/modules/ads-generator/data/courses.normalized.json`
- `src/modules/ads-generator/data/image-map.final.json`
- `src/modules/ads-generator/data/brands.json`

Current social MVP data lives here:

- `src/modules/social-generator/data/socialCreativeCatalog.ts`
- `src/modules/social-generator/data/partners.ts`

## Course coverage

Source course catalog:

- total: 139 courses
- SP: 25
- PKU: 52
- KKZ: 17
- PKU_ONLINE: 45
- image mappings: 139 / 139
- social catalog records: 139 / 139

The next data task is QA and overrides for social-ready creative data:

- `courseNameParts.main`
- `courseNameParts.subtitle`
- `courseFacts`
- `courseBadges`
- `offerMode`
- optional `cityName`
- optional `partner`
- `imageFocalPoint`

## Online handling

Decision for the current stage:

- do not render `ONLINE` as `courseNameParts.modeLabel`
- represent online mode as the first `courseBadges` item
- use label `nauka online`
- use tone `online`

Example:

```ts
courseNameParts: {
  main: 'Programowanie Python',
  subtitle: 'z Cisco Networking Academy',
},
courseBadges: [
  { id: 'online', label: 'nauka online', tone: 'online' },
  { id: 'no-matura', label: 'Nie wymagamy matury!', tone: 'primary' },
]
```

## Brand logo assets

The design system expects brand logos in:

```txt
public/creative-stack/logos/
```

Expected files:

- `teb-edukacja.svg`
- `teb-kursy.svg`
- `teb-medyczne.svg`
- `teb-policealne.svg`

Currently present:

- `teb-edukacja.svg`
- `teb-kursy.svg`
- `teb-medyczne.svg`
- `teb-policealne.svg`

Important implementation note:

- `src/modules/creative-stack/utils/publicAssetExists.ts` uses a known-public-assets list.
- The known-public-assets list was refreshed after adding brand, partner and PKU online image assets.
- After adding more real asset files, refresh `KNOWN_PUBLIC_ASSET_PATHS`.

## Partner logo assets

Partner logos should live in:

```txt
public/creative-stack/logos/partners/
```

Expected partner logo files from the current source catalog:

- `3shape.svg`
- `altkom-akademia.svg`
- `bielenda-professional.svg`
- `canon.svg`
- `cisco.svg`
- `denon-dental.svg`
- `dietetykpro.svg`
- `ecolab.svg`
- `felg.svg`
- `gemini-polska.svg`
- `habys.svg`
- `inglot.svg`
- `insert.svg`
- `interton-gn.svg`
- `kamsoft.svg`
- `kryolan.svg`
- `oral-b.svg`
- `podopharm.svg`
- `progrupa.svg`
- `promedica-24.svg`
- `salesmanago.svg`
- `schwarzkopf-professional.svg`
- `semilac-professional.svg`
- `vita.svg`
- `webmetric.svg`
- `zabka.svg`

Current state:

- partner registry has expected keys, paths and name aliases in `src/modules/social-generator/data/partners.ts`
- most physical SVG assets are present in `public/creative-stack/logos/partners/`
- missing physical SVG files as of this audit:
  - `altkom-akademia.svg`
  - `felg.svg`
- missing partner assets render as controlled placeholders, not broken images

## Course list to convert

All 139 source courses are available through the social catalog. Prioritize manual QA in this order:

1. Current visual QA examples:
   - `pku-barber`
   - `pku-programowanie-python-z-cisco-networking-academy`
2. Brand coverage examples:
   - one `medyczne` course
   - one `policealne` course
   - one `kursy` course with partner
   - one online/KKZ course
3. Partner-heavy courses:
   - all courses with non-empty `partners`
4. Remaining catalog:
   - SP remaining
   - PKU remaining
   - KKZ remaining
   - PKU_ONLINE remaining

## Current data module

A resolver creates social records instead of hand-writing every course:

```txt
src/modules/social-generator/data/socialCreativeCatalog.ts
```

Inputs:

- normalized course row
- image map row
- partner registry aliases

Output:

- `SocialCreativeData`

Manual overrides should cover:

- title split
- subtitle wording
- badges
- focal point
- partner selection if multiple partners exist
