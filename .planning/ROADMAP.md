# Roadmap: Drimian Web 2.0

## Overview

Drimian Web 2.0 delivers a consulting website centered on an interactive prosperity diagnostic tool. The site progresses from foundation (design system, theme architecture) through static homepage sections, then the core diagnostic experience (80% of the value), content pages for credibility, and finally deployment to production. Each phase delivers a coherent, testable capability -- the diagnostic phase is deliberately large because splitting the question flow, scoring engine, and results display across phases would create artificial boundaries in what is one unified user journey.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation + Design System** - Astro project scaffold, brand theme, layout components, hybrid dark/light architecture
- [x] **Phase 2: Homepage** - Hero, sections, floating WhatsApp, complete static homepage experience
- [x] **Phase 3: Diagnostic Tool** - 10-question immersive flow, scoring algorithm, radar chart, leverage points, results display, WhatsApp CTA
- [ ] **Phase 4: Content Pages** - /principios and /resultados pages with shared layout and navigation
- [ ] **Phase 5: Deployment + Launch** - SEO, sitemap, Cloudflare Pages, custom domain, view transitions, performance audit

## Phase Details

### Phase 1: Foundation + Design System
**Goal**: A developer opening the project sees a working Astro 5 site with brand colors, typography, responsive layout components, and the hybrid dark/light theme switching correctly between sections
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05, FOUN-06, FOUN-07, FOUN-08
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts a working Astro 5 + Preact + Tailwind CSS 4 site with no errors
  2. A test page renders correctly at 375px mobile and 1440px desktop with proper spacing and max-width constraints
  3. Dark-themed and light-themed sections are visually distinct on the same page, using the brand color palette (navy, blue, gray, orange)
  4. Page weight of the empty shell (layout + fonts + CSS) is under 100KB
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffold + design system tokens (Astro 5, Tailwind v4, fonts, colors, spacing)
- [x] 01-02-PLAN.md — Layout components + demo page (Section, Nav, Button, Card, Footer, visual checkpoint)

### Phase 2: Homepage
**Goal**: A visitor landing on drimian.com sees a complete, polished homepage with clear value proposition, model explanation, a rotating principle, and multiple pathways to start a conversation via WhatsApp
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06
**Success Criteria** (what must be TRUE):
  1. Hero section fills the viewport with a provocative headline and a CTA button that scrolls to / navigates to the diagnostic
  2. All five homepage sections render in order with correct dark/light theming per section and proper spacing
  3. Floating WhatsApp button is visible on scroll, stays bottom-right, and opens WhatsApp with the correct phone number
  4. Homepage is fully readable and navigable on a 375px mobile screen with no horizontal overflow
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Logo + principles data + Hero section + WhatsApp floating button
- [x] 02-02-PLAN.md — Content sections (Que es Drimian, Modelo, Principio Rotativo, CTA Final) + Nav/Footer update + page assembly

### Phase 3: Diagnostic Tool
**Goal**: A business owner completes a 10-question diagnostic in an immersive fullscreen experience, sees their prosperity profile with a radar chart and top leverage points, and taps a WhatsApp CTA with their results pre-loaded in the message
**Depends on**: Phase 2
**Requirements**: DIAG-01, DIAG-02, DIAG-03, DIAG-04, DIAG-05, DIAG-06, DIAG-07, SCOR-01, SCOR-02, SCOR-03, SCOR-04, SCOR-05, SCOR-06, SCOR-07, RESU-01, RESU-02, RESU-03, RESU-04, RESU-05, RESU-06, RESU-07
**Success Criteria** (what must be TRUE):
  1. User can answer 10 fullscreen questions one at a time, with visual feedback on selection, a progress bar, and a micro-revelation after each answer
  2. Browser back button navigates to the previous question, and refreshing the page restores diagnostic state from sessionStorage
  3. Scoring algorithm produces identical results to the reference implementation for all fixture test cases (profile classification, indicator scores, leverage points)
  4. Results page displays a profile badge, 7-axis radar chart (SVG heptagon), color-coded indicator bars, top 2-3 leverage points with explanations, and a dynamic narrative
  5. WhatsApp CTA opens WhatsApp with a pre-built message containing the user's profile name, score, and top leverage points
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Scoring engine: Vitest setup, TypeScript types, data files, scoring module with TDD (all SCOR requirements)
- [x] 03-02-PLAN.md — Diagnostic question flow: Preact island overlay, 10 questions, crossfade, micro-revelations, history API, sessionStorage (all DIAG requirements)
- [x] 03-03-PLAN.md — Results display: profile badge, narrative, radar chart SVG, indicator bars, leverage points, WhatsApp CTA, email capture (all RESU requirements)

### Phase 4: Content Pages
**Goal**: A visitor can navigate to /principios and /resultados to read Drimian's 10 prosperity principles and 4 anonymized case studies, reinforcing credibility and methodology
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. /principios page displays all 10 principles as readable short articles with consistent typography and spacing
  2. /resultados page displays 4 anonymized case studies with industry tags, real metrics, and contextual narratives
  3. Both pages share the base layout (header, footer, navigation) and the floating WhatsApp button from the homepage
**Plans**: 1 plan

Plans:
- [ ] 04-01-PLAN.md — /principios page (10 principles), /resultados page (4 case studies), Nav update with correct links

### Phase 5: Deployment + Launch
**Goal**: The site is live at drimian.com on Cloudflare Pages, discoverable by search engines, with smooth page transitions and fast load times even on Bolivia's variable internet
**Depends on**: Phase 3, Phase 4
**Requirements**: DEPL-01, DEPL-02, DEPL-03, DEPL-04, DEPL-05, DEPL-06
**Success Criteria** (what must be TRUE):
  1. Site is deployed to Cloudflare Pages with automatic deploys on git push, accessible at drimian.com
  2. All pages have correct meta tags, Open Graph tags, and the XML sitemap is auto-generated and accessible at /sitemap.xml
  3. View transitions animate smoothly between pages (homepage, diagnostic, principios, resultados)
  4. Full page load completes in under 3 seconds on a throttled 3G connection, with total page weight under 1MB
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
Note: Phase 4 depends only on Phase 1, so it could execute in parallel with Phases 2-3 if desired.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Design System | 2/2 | Complete    | 2026-03-20 |
| 2. Homepage | 2/2 | Complete    | 2026-03-22 |
| 3. Diagnostic Tool | 3/3 | Complete    | 2026-03-22 |
| 4. Content Pages | 0/1 | Not started | - |
| 5. Deployment + Launch | 0/TBD | Not started | - |
