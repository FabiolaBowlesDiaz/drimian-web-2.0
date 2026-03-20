---
phase: 02-homepage
plan: 01
subsystem: ui
tags: [astro, image-optimization, whatsapp, hero, data-file]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Section.astro, Button.astro, global.css with design tokens
provides:
  - Hero.astro component (full-viewport dark hero with logo, headline, CTAs)
  - WhatsAppFloat.astro component (fixed green button with wa.me deep link)
  - drimian-logo.png in src/assets/images/ for Astro Image optimization
  - principles.ts data file with 10 principles and month rotation
  - scroll-padding-top in global.css for anchor offset
affects: [02-homepage, 03-diagnostic, 04-content]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro-image-import, data-driven-content, css-filter-logo-invert]

key-files:
  created:
    - src/assets/images/drimian-logo.png
    - src/data/principles.ts
    - src/components/Hero.astro
    - src/components/WhatsAppFloat.astro
  modified:
    - src/styles/global.css

key-decisions:
  - "Logo uses brightness-0 invert CSS filter on dark backgrounds (logo is dark navy on transparent)"
  - "Principles use build-time month selection via getCurrentPrinciple() -- rotation happens on redeploy"

patterns-established:
  - "Astro Image import from src/assets/ for automatic WebP conversion and cache-busting"
  - "Data files in src/data/ for content that drives component rendering"
  - "CSS filter for logo color adaptation across dark/light themes"

requirements-completed: [HOME-01, HOME-06]

# Metrics
duration: 8min
completed: 2026-03-20
---

# Phase 2 Plan 1: Hero + WhatsApp Foundation Summary

**Full-viewport dark Hero with Astro-optimized logo (inverted for dark bg), floating WhatsApp button with wa.me deep link, and 10-principle data file with month rotation**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-20T23:12:38Z
- **Completed:** 2026-03-20T23:21:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Hero section with exact spec copy: provocative headline, subtitle with em dash, orange CTA, subtle secondary CTA
- Logo optimized via Astro Image pipeline with brightness-0 invert filter for dark background visibility
- WhatsApp floating button with pre-built conversational message and correct wa.me/59176600056 link
- 10 Guia Drimian principles data file with typed interface and build-time month rotation
- Scroll-padding-top added to global.css for fixed nav anchor offset (5rem = 80px)

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy logo and create principles data file** - `49188b3` (feat)
2. **Task 2: Build Hero section and WhatsAppFloat components** - `c8140fa` (feat)

## Files Created/Modified
- `src/assets/images/drimian-logo.png` - Drimian full logo for Astro Image optimization
- `src/data/principles.ts` - 10 principles with Principle interface, array, and getCurrentPrinciple()
- `src/components/Hero.astro` - Full-viewport dark hero with logo, headline, subtitle, 2 CTAs
- `src/components/WhatsAppFloat.astro` - Fixed green WhatsApp button bottom-right with inline SVG
- `src/styles/global.css` - Added scroll-padding-top: 5rem for fixed nav anchor offset

## Decisions Made
- Logo uses CSS `brightness-0 invert` filter: inspected logo PNG and confirmed it has dark navy text/isotipo on transparent background, invisible on dark hero. Filter makes it white.
- WhatsApp pre-built message: "Hola, vi el diagnostico de Drimian y me gustaria conversar sobre mi empresa." -- natural, conversational, references the diagnostic experience.
- Used `min-h-[100dvh]` instead of `min-h-screen` for mobile browser chrome fix (dynamic viewport height).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero.astro and WhatsAppFloat.astro ready for Plan 02 to compose into index.astro
- Logo asset available for Nav.astro and Footer.astro integration
- Principles data ready for RotatingPrinciple.astro component
- Scroll padding ensures anchor links work correctly with fixed nav

## Self-Check: PASSED

All 6 files verified present. Both task commits (49188b3, c8140fa) verified in git log.

---
*Phase: 02-homepage*
*Completed: 2026-03-20*
