# Phase 3: Diagnostic Tool - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Full interactive diagnostic experience: 10 fullscreen questions with micro-revelations, two-layer scoring algorithm (mechanisms → 7 prosperity indicators), radar chart visualization, leverage points, profile-based dynamic narrative, and WhatsApp CTA with pre-built results. This is the core feature — 80% of the site's value. Does NOT include /principios or /resultados pages (Phase 4) or deployment (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Question Flow UX
- Transition between questions: **Fade crossfade** — current question fades out, next fades in. Smooth, elegant, calm.
- Micro-revelations: **2 seconds minimum display + tap to continue** — appears after answer selection, stays at least 2 sec, user can tap/click to advance early. Balances absorption with pace.
- Navigation: **Back button visible in UI + browser back** — user can go back to previous questions and change answers. History API integration for browser back.
- Progress indicator: **Number only** — "3/10" displayed discretely. Ultra minimal, doesn't distract from the question.

### Results Presentation
- Reveal style: **Progressive** — first the profile badge + score, then radar animates, then leverage points, then WhatsApp CTA. Each block appears as user scrolls down.
- Radar chart: **Animated** — heptagon draws progressively when it enters viewport. Axes fill one by one. Dramatic reveal.
- Theme: **Dark (continuity)** — results stay in dark navy, same as diagnostic questions. Feels like one continuous experience.
- Content order: **Narrative first, then data** — profile badge → narrative (3-4 paragraphs) → radar chart → indicator bars → leverage points → WhatsApp CTA. User reads their "story" first, sees data as evidence.

### Diagnostic Entry/Exit
- Entry: **Overlay instant** — click "Empezar el diagnóstico" → dark overlay appears immediately covering entire page. Fade-in ~200ms. NOT a separate page/route.
- Exit mid-diagnostic: **X button, no confirmation** — visible X in corner closes overlay. Progress saved automatically in sessionStorage.
- Resume: **No resume, starts fresh** — each time user clicks "Empezar" it starts from question 1. Simple, no "continue where you left off" prompt.
- Post-results: **"Volver al inicio" button** — at the bottom of results, a button closes the overlay and returns to homepage. Clean exit.

### WhatsApp Results Message
- Content level: **Resumen** — profile name + score + top 2-3 leverage points. Concise but gives Drimian team enough context.
- Format:
  ```
  Hola! Hice el Diagnóstico de Prosperidad de Drimian.

  Perfil: [PERFIL] ([SCORE]/40)

  Mis palancas principales:
  1. [PALANCA 1]
  2. [PALANCA 2]

  Me gustaría conversar.
  ```

### Claude's Discretion
- Exact fade crossfade timing and easing curves
- X button position and styling (top-right corner assumed)
- Radar chart animation timing and easing
- Progressive reveal scroll trigger thresholds
- Indicator bars color coding (red/orange/yellow/green thresholds)
- Email capture form design (expandable, minimal)
- How the overlay interacts with the nav (nav should be hidden during diagnostic)

</decisions>

<specifics>
## Specific Ideas

- The diagnostic should feel like an "app within the page" — immersive, focused, no distractions
- Micro-revelations are "the real product of the web" (per spec) — they should feel like insights, not tooltips
- The animated radar is the "wow moment" — it should feel like the data is being calculated in real-time
- The narrative should read like someone who understands the user's business wrote it personally — not generic template text
- All 10 questions, 4 options each, micro-revelations, scoring weights, profile narratives, and leverage point text are pre-written in the reference repo docs

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Section.astro**: data-theme="dark" provides CSS variables — diagnostic overlay uses same color system
- **Button.astro**: Primary (orange) and secondary variants — use for answer options and CTAs
- **WhatsAppFloat.astro**: Already has wa.me URL format — results CTA follows same pattern but with dynamic message
- **Hero.astro**: "Empezar el diagnóstico" CTA needs to trigger overlay open
- **principles.ts**: TypeScript data file pattern — use same pattern for questions/scoring data

### Established Patterns
- Preact islands for interactivity — the diagnostic is THE Preact island of the entire site
- `data-theme="dark"` CSS variable scoping for dark sections
- Inline scripts for simple JS (Nav IntersectionObserver) — but diagnostic needs full Preact component
- Self-hosted WOFF2 fonts load in Base.astro — available inside Preact islands

### Integration Points
- Hero.astro CTA → triggers diagnostic overlay open
- Nav.astro → should be hidden/below when overlay is active (z-index management)
- WhatsAppFloat → should be hidden during diagnostic, visible on results
- sessionStorage for diagnostic state persistence (DIAG-07)
- Reference repo `_reference_repo/js/diagnostic.js` has the scoring algorithm to port to TypeScript

### Content Sources
- Questions + options + micro-revelations: `_reference_repo/WEB DRIMIAN - Documento Maestro.md` (Section 2)
- Scoring weights matrix: `_reference_repo/WEB DRIMIAN - Mecanica Diagnostico Capa 2.md`
- Profile narratives: `_reference_repo/WEB DRIMIAN - Documento Maestro.md` (Section 3)
- Reference scoring implementation: `_reference_repo/js/diagnostic.js`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-diagnostic-tool*
*Context gathered: 2026-03-22*
