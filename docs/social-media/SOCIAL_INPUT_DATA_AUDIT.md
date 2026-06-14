# Social Generator — input data audit

## Current sources

Primary source data still lives in the Google Ads module:

- `src/modules/ads-generator/data/courses.normalized.json`
- `src/modules/ads-generator/data/image-map.final.json`
- `src/modules/ads-generator/data/brands.json`

Current social MVP data lives here:

- `src/modules/social-generator/data/social-creatives.mock.ts`
- `src/modules/social-generator/data/partners.ts`

## Course coverage

Source course catalog:

- total: 94 courses
- SP: 25
- PKU: 52
- KKZ: 17
- image mappings: 94 / 94
- social-ready mock records: 2 / 94

The next data task is not image mapping. The missing layer is social-ready creative data:

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

Important implementation note:

- `src/modules/creative-stack/utils/publicAssetExists.ts` uses a known-public-assets list.
- After adding a real asset file, add its path to `KNOWN_PUBLIC_ASSET_PATHS`.
- Otherwise the renderer will keep using the fallback text logo.

## Partner logo assets

Partner logos should live in:

```txt
public/creative-stack/logos/partners/
```

Expected partner logo files from the current source catalog:

- `3shape.svg`
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

Current state:

- partner registry has expected keys and paths in `src/modules/social-generator/data/partners.ts`
- physical SVG assets are not present yet
- `publicAssetExists` must be updated after files are added

## Course list to convert

All 94 source courses should be converted to social-ready records. Prioritize in this order:

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

## Recommended next data module

Create a resolver instead of hand-writing all social records:

```txt
src/modules/social-generator/data/createSocialCreativeFromCourse.ts
```

Inputs:

- normalized course row
- image map row
- optional city
- optional manual overrides

Output:

- `SocialCreativeData`

Manual overrides should cover:

- title split
- subtitle wording
- badges
- focal point
- partner selection if multiple partners exist
