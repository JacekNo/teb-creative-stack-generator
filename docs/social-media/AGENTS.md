# AGENTS.md — teb-creative-stack-generator

## Project

`teb-creative-stack-generator` is a Vue 3 + TypeScript + Vite project for generating branded TEB creative assets.

The project contains two generator areas:

- `ads-generator` — Google Ads creative renderer.
- `social-generator` — social media creative renderer currently under active development.

Current working branch:

```txt
feature/social-generator
```

## Main goal

Build a structured creative generator for TEB social media assets.

The Social Generator should work as one creator with one active preview. The user switches preview format, but all creative data remains shared. Export should eventually generate a package of formats from the same draft.

Target social formats:

- `1080×1080` square,
- `1080×1350` portrait/feed,
- `1080×1920` stories.

## Current architecture direction

The Social Generator should be based on a design-system-first structure:

```txt
format → brand → design system → layout flow → SVG renderers
```

Avoid hardcoded values in renderers. Numeric values may exist in tokens, but renderers should consume semantic values from the design system.

Important files:

```txt
src/modules/social-generator/design-system/socialDesignTokens.ts
src/modules/social-generator/design-system/createSocialDesignSystem.ts
src/modules/social-generator/renderer/layout/createSocialResponsiveLayout.ts
src/modules/social-generator/renderer/layout/socialTitleFit.ts
src/modules/social-generator/renderer/renderSocialSvg.ts
src/modules/social-generator/renderer/renderSocialCourseName.ts
src/modules/social-generator/renderer/renderSocialCourseFacts.ts
src/modules/social-generator/renderer/renderSocialCourseBadges.ts
src/modules/social-generator/types/social.types.ts
src/modules/social-generator/data/social-creatives.mock.ts
```

## Design system rules

Use a spacing scale based on 4 px:

```txt
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128
```

The system should define typography, line heights, spacing, gaps, paddings, badge styles, title card styles, logo box styles, info grid styles and safe zones per format.

Do not hardcode layout values in SVG renderers unless they are local calculations based on design tokens.

## Social content model

The social renderer is moving away from legacy campaign fields:

```txt
benefit / price / startDate / offerMode
```

toward a product/course information model:

```txt
courseNameParts
courseFacts
courseBadges
deliveryMode / offerMode
brandLogo
partnerLogo
city
```

The source inspiration is the course header structure on teb.pl.

Examples of facts:

```txt
2 semestry / Czas trwania
188 godzin / 10 miesięcy kształcenia
Tryb weekendowy / Zajęcia online na żywo
```

Examples of badges:

```txt
Nie wymagamy matury!
Popularne
Szybki START
W SIERPNIU
ONLINE
```

Prices and installments should be skipped for now.

## Title rules

Course names must be responsive.

Use the title split model:

```txt
main
subtitle
modeLabel
```

Example:

```txt
main: Programowanie Python
subtitle: z Cisco Networking Academy
modeLabel: ONLINE
```

Rules:

- title card should use the full net width of the format,
- title should auto-fit through typography steps,
- max 3 lines for the main social title area,
- long names should reduce font size before overflowing,
- facts and badges must be placed below the dynamic title card.

## Layout rules

The layout should behave as a flow:

```txt
background
photo
partnerLogo
titleCard
courseFacts
courseBadges
footer
```

Avoid static vertical positioning where possible.

Footer should be anchored to the lower safe area.

Left footer:

```txt
brand logo
```

Right footer:

```txt
city or secondary label
```

## Visual requirements

Next visual improvements:

- use the background/pattern from the previous Google Ads module,
- replace text fallback `TEB Kursy` with real brand logos,
- add fallback or hiding behavior for missing partner logos,
- improve badge UI,
- support online courses properly,
- keep the design consistent with the TEB brand family.

## Commands

Before committing any change, run:

```bash
npm run build
```

If relevant, also run any available typecheck/lint/test commands defined in `package.json`.

## Git workflow

Use small commits with clear messages.

Suggested commit style:

```txt
Add social design system tokens
Render social course facts and badges
Refine social responsive title flow
Add social brand background and logos
Improve social badge system
Remove legacy social campaign renderers
```

## Definition of done

A task is done when:

- TypeScript build passes.
- The preview still renders for square, portrait and stories.
- No text overlaps facts, badges or footer.
- Long course names fit responsively.
- Components use tokens/design system values instead of local magic numbers.
- Visual changes are checked with debug overlay and then without debug overlay.
