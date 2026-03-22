---
phase: 03-diagnostic-tool
plan: 01
subsystem: scoring
tags: [vitest, typescript, tdd, scoring-engine, diagnostic]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Astro project structure, TypeScript config, src/data/ pattern
provides:
  - Pure TypeScript scoring engine with zero DOM dependencies
  - Type contracts for diagnostic UI (Question, Profile, IndicatorScores, LeveragePoint, DiagnosticState, Action)
  - 10 questions with options, micro-revelations, mechanism names
  - 7 indicator scoring via weighted averages
  - Profile classification (4 ranges)
  - Dynamic narrative generation (4 branches x 4 paragraphs)
  - WhatsApp CTA URL builder
  - Vitest test infrastructure (33 passing tests)
affects: [03-02, 03-03]

# Tech tracking
tech-stack:
  added: [vitest 4.1.0]
  patterns: [TDD red-green, pure-function scoring module, typed data files in src/data/]

key-files:
  created:
    - src/data/types.ts
    - src/data/questions.ts
    - src/data/profiles.ts
    - src/data/scoring.ts
    - tests/scoring.test.ts
    - vitest.config.ts
    - .npmrc
  modified:
    - package.json

key-decisions:
  - "Fixed test fixture values to match actual algorithm (Mecanica doc had rounding errors in intermediate averages)"
  - "Used node-linker=hoisted in .npmrc to resolve Vitest 4.x + pnpm + OneDrive compatibility issue"
  - "Used Tailwind hex colors (#ef4444, #f97316, #3b82f6, #22c55e) instead of CSS variables for getBarColor"

patterns-established:
  - "TDD pattern: tests in tests/*.test.ts, run via pnpm test"
  - "Data file pattern: typed exports in src/data/ (types.ts, questions.ts, profiles.ts, scoring.ts)"
  - "Pure function pattern: scoring module imports zero DOM APIs, all functions take data in and return data out"

requirements-completed: [SCOR-01, SCOR-02, SCOR-03, SCOR-04, SCOR-05, SCOR-06, SCOR-07]

# Metrics
duration: 11min
completed: 2026-03-22
---

# Phase 3 Plan 1: Scoring Engine Summary

**Pure TypeScript scoring engine with 7-indicator weighted averages, 4-profile narrative generation, and 33 Vitest tests -- zero DOM dependencies**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-22T18:32:38Z
- **Completed:** 2026-03-22T18:44:14Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Complete scoring engine ported from reference diagnostic.js to typed TypeScript
- All 10 questions with 4 options each, micro-revelations, and mechanism names
- 7-indicator weighted scoring with normalization to 0-100 scale
- Dynamic narrative generation with all 4 profile class branches (absent, partial, building, solid)
- 33 unit tests passing via Vitest TDD workflow
- WhatsApp CTA URL builder with pre-formatted diagnostic context

## Task Commits

Each task was committed atomically:

1. **Task 0: Install Vitest and create type contracts** - `fe5d7f5` (chore)
2. **Task 1: Write scoring tests from fixture data (RED phase)** - `87c08eb` (test)
3. **Task 2: Implement scoring module and data files (GREEN phase)** - `512de62` (feat)

_TDD workflow: Task 1 = RED (tests fail), Task 2 = GREEN (tests pass)_

## Files Created/Modified
- `vitest.config.ts` - Vitest config using Astro's getViteConfig
- `.npmrc` - pnpm node-linker=hoisted for OneDrive compatibility
- `src/data/types.ts` - TypeScript interfaces (Question, Profile, IndicatorScores, LeveragePoint, DiagnosticState, Action)
- `src/data/questions.ts` - 10 questions, INDICATOR_WEIGHTS matrix, PALANCA_DESCRIPTIONS, Q_TO_INDICATORS
- `src/data/profiles.ts` - PROFILE_DESCRIPTIONS, WEAKNESS_PHRASES, STRENGTH_PHRASES, MECH_PHRASES
- `src/data/scoring.ts` - calculateTotal, getProfile, calculateIndicatorScores, getTopPalancas, getNarrative, buildWhatsAppURL, getBarColor
- `tests/scoring.test.ts` - 33 test cases covering all scoring functions
- `package.json` - Added vitest dev dependency and test script

## Decisions Made
- **Fixture values corrected:** The Mecanica Diagnostico Capa 2 document shows rounded intermediate averages that produce slightly different final scores than the actual algorithm. Tests use the algorithm's exact output (e.g., Diferenciacion=19 not 21, Margen=16 not 19). The reference JS code produces the same values as our implementation.
- **node-linker=hoisted:** Required because Vitest 4.x peer dependencies (@vitest/utils etc.) are not resolved correctly with pnpm's default symlink strategy on OneDrive-synced directories.
- **Hex colors for getBarColor:** Used Tailwind-equivalent hex values instead of CSS custom properties, making the function pure and testable without a DOM context.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] OneDrive + pnpm symlink compatibility**
- **Found during:** Task 0 (Vitest install)
- **Issue:** pnpm's default symlink strategy creates cloud-only placeholders on OneDrive, breaking module resolution
- **Fix:** Added .npmrc with node-linker=hoisted, reinstalled dependencies
- **Files modified:** .npmrc
- **Verification:** pnpm test runs successfully
- **Committed in:** fe5d7f5 (Task 0 commit)

**2. [Rule 1 - Bug] Corrected fixture test expectations**
- **Found during:** Task 2 (GREEN phase)
- **Issue:** Plan specified indicator scores from Mecanica doc which had rounding errors in intermediate averages (e.g., doc shows avg=1.64 for Diferenciacion but actual calculation is 4.4/2.8=1.5714)
- **Fix:** Computed exact values using the reference algorithm and updated test expectations
- **Files modified:** tests/scoring.test.ts
- **Verification:** All 33 tests pass, values match reference JS implementation exactly
- **Committed in:** 512de62 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
- OneDrive file sync interfered with pnpm install (UNKNOWN errors on package.json reads). Resolved by using node-linker=hoisted and CI=true environment variable.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Scoring engine is ready for the Preact diagnostic island (03-02-PLAN)
- All types exported for UI state management
- All scoring functions pure and importable without DOM
- Test infrastructure established for future test additions

---
*Phase: 03-diagnostic-tool*
*Completed: 2026-03-22*
