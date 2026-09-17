# ICGTMP Website - Cursor Handoff

This folder contains the current React/Vite implementation from the live AppDeploy build, plus the approved homepage reference image and logo asset.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Design source of truth

Use `docs/approved-homepage-reference.png` as the visual source of truth. The goal is a close, professional implementation of that approved layout rather than a reinterpretation.

## Key assets

- `public/resources/icgtmp-logo.png` - current ICGTMP logo image
- `docs/approved-homepage-reference.png` - approved homepage mockup

## Cursor priority tasks

1. Match the approved mockup much more closely at desktop and mobile sizes.
2. Replace the temporary Brand() graphic with the real logo asset in `public/resources/icgtmp-logo.png`.
3. Preserve the green/white/gold visual system.
4. Keep the header, photographic hero, four sector cards, impact-goals strip, Lagos East section, leadership/news/join grid, and footer aligned with the approved reference.
5. Replace leadership placeholders only when real photographs are supplied; do not invent them.
6. Keep the Join ICGTMP flow functional, but treat it as a prototype until a backend/database is added.
7. Review copy, spacing, typography, responsiveness, accessibility, and image loading before deployment.

## Current live reference

AppDeploy app id: `icgtmp-barqyn`

The handoff source snapshot corresponds to the corrected build prepared on September 8, 2026.
