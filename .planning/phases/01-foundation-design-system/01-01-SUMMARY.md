---
phase: 01-foundation-design-system
plan: 01
subsystem: ui
tags: [astro, preact, tailwindcss-v4, design-system, typography, woff2]

# Dependency graph
requires: []
provides:
  - "Astro 6 project scaffold with Preact and Tailwind CSS v4"
  - "Brand design tokens (@theme): colors, typography, spacing, radius"
  - "Self-hosted WOFF2 fonts: Playfair Display 600/700 + Inter variable"
  - "Base.astro layout with font preloading and global CSS"
  - "Section theme architecture (dark/light/light-alt) via data attributes"
affects: [02-homepage-hero, 03-diagnostic, 04-content-pages, 05-deployment]

# Tech tracking
tech-stack:
  added: [astro@6.0.7, preact@10.29.0, @astrojs/preact@5.0.2, tailwindcss@4.2.2, @tailwindcss/vite@4.2.2, typescript@5.9.3, @astrojs/check@0.9.8]
  patterns: [css-first-tailwind-v4, data-attribute-section-theming, font-preload-strategy, mobile-first-typography]

key-files:
  created:
    - astro.config.mjs
    - src/styles/global.css
    - src/layouts/Base.astro
    - public/fonts/playfair-display-600.woff2
    - public/fonts/playfair-display-700.woff2
    - public/fonts/inter-latin-var.woff2
  modified:
    - package.json
    - tsconfig.json
    - src/pages/index.astro

key-decisions:
  - "Astro 6 (latest) instead of Astro 5 -- scaffolder generates v6 which is current stable"
  - "Tailwind CSS 4.2.2 with @tailwindcss/vite plugin -- CSS-first config, no tailwind.config.js"
  - "Font budget exceeded 60KB estimate (122KB actual) -- latin subsets larger than estimated, acceptable within page weight budget"
  - "Frontmatter CSS import pattern for global.css in Base.astro -- official Tailwind+Astro recommendation"

patterns-established:
  - "@theme block in global.css is single source of truth for all design tokens"
  - "Section theming via data-theme attribute (dark/light/light-alt) with --section-* CSS variables"
  - "Mobile-first responsive typography: base sizes in px, desktop overrides at 768px using @theme tokens"
  - "Font preloading: only 2 critical fonts preloaded (700 weight headline + body variable)"
  - "pnpm.onlyBuiltDependencies in package.json for non-interactive installs"

requirements-completed: [FOUN-01, FOUN-04, FOUN-05, FOUN-07, FOUN-08]

# Metrics
duration: 17min
completed: 2026-03-20
---

# Phase 1 Plan 1: Foundation Design System Summary

**Astro 6 + Tailwind CSS v4 project with complete brand design tokens (colors, typography, spacing), self-hosted Playfair Display + Inter WOFF2 fonts, and Base layout with preloading**

## Performance

- **Duration:** 17 min
- **Started:** 2026-03-20T15:53:37Z
- **Completed:** 2026-03-20T16:10:31Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments
- Astro 6 + Preact + Tailwind CSS v4 project scaffolded and building successfully with zero JS config
- Complete brand design system defined in CSS via @theme: 5 brand colors, 6 surface colors per theme, typography scale, spacing tokens, radius tokens, fade-in animation
- Self-hosted WOFF2 fonts: Playfair Display at weights 600 and 700, Inter variable 400-600
- Base layout with font preloading (2 critical fonts) and section theme architecture ready for use

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro project with Preact and Tailwind CSS v4** - `bddc7e3` (feat)
2. **Task 2: Download and install self-hosted WOFF2 fonts** - `d0e8a51` (feat)
3. **Task 3: Create design system tokens and Base layout with font preloading** - `e1d7924` (feat)

## Files Created/Modified
- `astro.config.mjs` - Astro 6 config with Preact integration and @tailwindcss/vite plugin
- `src/styles/global.css` - Complete design system: @theme tokens, @font-face, base styles, section themes
- `src/layouts/Base.astro` - HTML shell with font preloads, meta tags, global CSS import
- `src/pages/index.astro` - Typography test page with brand color utilities
- `public/fonts/playfair-display-600.woff2` - Headline font, semibold weight (38KB)
- `public/fonts/playfair-display-700.woff2` - Headline font, bold weight (38KB)
- `public/fonts/inter-latin-var.woff2` - Body font, variable 400-600 (48KB)
- `package.json` - Project manifest with all dependencies
- `tsconfig.json` - TypeScript strict config with Preact JSX
- `.gitignore` - Standard ignores for node_modules, dist, .astro

## Decisions Made
- **Astro 6 instead of 5:** The `create astro` scaffolder generates Astro 6.0.7 (current stable). The plan referenced "Astro 5" but the intent was latest stable. All patterns remain identical.
- **Font budget adjustment:** Latin WOFF2 subsets total 122KB vs the 60KB estimate in research. Google Fonts provides larger subsets than the research estimated. This is acceptable -- the page weight target is <350KB and 122KB for 3 font files is standard.
- **Frontmatter import for CSS:** Used `import '../styles/global.css'` in Base.astro frontmatter (official Tailwind+Astro pattern) rather than `<style is:global>@import</style>`.
- **pnpm build script approval:** Added `pnpm.onlyBuiltDependencies` to package.json for non-interactive builds (esbuild and sharp need native compilation).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Non-interactive Astro scaffolding workaround**
- **Found during:** Task 1 (Project scaffold)
- **Issue:** `pnpm create astro@latest .` refuses to scaffold in non-empty directory interactively
- **Fix:** Scaffolded into temp directory `_astro_temp/`, then copied files to project root
- **Files modified:** All scaffold files (package.json, astro.config.mjs, tsconfig.json, src/, public/)
- **Verification:** `pnpm build` exits 0
- **Committed in:** bddc7e3

**2. [Rule 3 - Blocking] pnpm not installed globally**
- **Found during:** Task 1 (Project scaffold)
- **Issue:** pnpm command not found in PATH
- **Fix:** Installed pnpm globally via `npm install -g pnpm`
- **Verification:** `pnpm --version` returns 10.32.1
- **Committed in:** N/A (environment setup)

**3. [Rule 3 - Blocking] pnpm build script approval**
- **Found during:** Task 1 (Dependency install)
- **Issue:** pnpm 10.x requires explicit approval for packages with build scripts (esbuild, sharp)
- **Fix:** Added `pnpm.onlyBuiltDependencies: ["esbuild", "sharp"]` to package.json
- **Verification:** `pnpm install` completes without interactive prompt
- **Committed in:** bddc7e3

---

**Total deviations:** 3 auto-fixed (all Rule 3 - blocking issues)
**Impact on plan:** All fixes were necessary to unblock execution in this environment. No scope creep.

## Issues Encountered
- `create astro` interactive prompt required temp-directory workaround on non-empty project directory
- Font sizes from Google Fonts larger than research estimates (122KB vs 60KB target) -- within acceptable range

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Design system tokens fully defined and ready for component creation
- Base layout ready to use as parent for all pages
- Section theme architecture (dark/light/light-alt) ready for Phase 2 homepage sections
- Plan 01-02 (layout components) can proceed immediately

---
*Phase: 01-foundation-design-system*
*Completed: 2026-03-20*
