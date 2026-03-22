# Requirements: Drimian Web 2.0

**Defined:** 2026-03-20
**Core Value:** The interactive diagnostic must work flawlessly -- 10 fullscreen questions with micro-revelations, 7-axis radar, personalized leverage points, all culminating in a WhatsApp CTA with pre-built context.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Design System

- [x] **FOUN-01**: Site uses Astro 5 + Preact + Tailwind CSS 4 as tech stack
- [x] **FOUN-02**: Site is mobile-first responsive (375px baseline, scales up to desktop)
- [x] **FOUN-03**: Hybrid dark/light theme architecture (dark for hero+diagnostic, light for content sections)
- [x] **FOUN-04**: Brand typography system (serif headlines + sans-serif body + Nexa for logo reference)
- [x] **FOUN-05**: Brand color system implemented (navy #131a37, blue #0143a0, gray #878787, orange #FF6600)
- [x] **FOUN-06**: Base layout components (header, footer, section containers, max-width 680px text)
- [x] **FOUN-07**: Spacing system (80-120px desktop, 48-64px mobile between sections)
- [x] **FOUN-08**: Total page weight < 1MB (target < 350KB)

### Homepage Sections

- [x] **HOME-01**: Hero section -- full viewport, provocative headline, CTA to diagnostic, subtle isotipo background
- [x] **HOME-02**: "What is Drimian" section -- 4 lines, sectors, "We Dream With Intelligence"
- [x] **HOME-03**: "Skin in the game" model section -- performance-based bonus, automatic exit clause
- [x] **HOME-04**: Rotating principle section -- 1 principle from Guia Drimian, monthly rotation, title + 3-4 lines
- [x] **HOME-05**: Final CTA section -- "Empecemos a conversar" + WhatsApp + email + address
- [x] **HOME-06**: Floating WhatsApp button -- persistent bottom-right, green icon, visible on all pages

### Diagnostic Experience

- [x] **DIAG-01**: 10 fullscreen immersive questions, one at a time, each fills viewport
- [x] **DIAG-02**: 4 selectable options per question with visual feedback on selection
- [x] **DIAG-03**: Progress bar (subtle, top position, "1/10, 2/10..." format)
- [x] **DIAG-04**: Micro-revelation appears after each answer (3-4 sec display, dismissible with tap)
- [x] **DIAG-05**: Smooth transitions between questions (not slow, not jarring)
- [x] **DIAG-06**: Browser back button navigates to previous question (history API integration)
- [x] **DIAG-07**: Diagnostic state persisted in sessionStorage (survives accidental refresh)

### Scoring & Results

- [x] **SCOR-01**: Scoring algorithm -- a)=1, b)=2, c)=3, d)=4 per question, total 10-40
- [x] **SCOR-02**: Profile classification -- Ausentes (10-17), Parciales (18-25), Construccion (26-33), Solidos (34-40)
- [x] **SCOR-03**: 7 prosperity indicators calculated as weighted averages (weights: 1.0/0.6/0.3)
- [x] **SCOR-04**: Indicator normalization to 0-100%: ((avg - 1) / 3) x 100
- [x] **SCOR-05**: Leverage points algorithm -- mechanisms scored 1-2, ranked by total weight across all indicators, top 2-3
- [x] **SCOR-06**: Scoring module extracted as pure TypeScript with zero DOM dependencies
- [x] **SCOR-07**: Unit tests validating scoring against reference implementation fixture data

### Results Display

- [ ] **RESU-01**: Profile badge with name, score (X/40), and 2-line description
- [ ] **RESU-02**: 7-axis radar chart (heptagon SVG) with indicators normalized 0-100%
- [ ] **RESU-03**: Color-coded indicator bars (red 0-25%, orange 26-50%, yellow 51-75%, green 76-100%)
- [ ] **RESU-04**: Top 2-3 leverage points with impacted indicators and explanatory text
- [ ] **RESU-05**: Dynamic narrative selected by profile range + 2 weakest indicators
- [ ] **RESU-06**: WhatsApp CTA with pre-built message including profile, score, and top leverage points
- [ ] **RESU-07**: Optional email capture (expandable, post-result, name + company + email)

### Content Pages

- [ ] **CONT-01**: /principios page -- 10 principles from Guia Drimian as short articles (title + 3-4 paragraphs)
- [ ] **CONT-02**: /resultados page -- 4 anonymized case studies with industry tag, metrics, and context
- [ ] **CONT-03**: Each content page shares base layout with consistent navigation

### SEO & Deployment

- [ ] **DEPL-01**: Meta tags and Open Graph tags on all pages (title, description, image)
- [ ] **DEPL-02**: Auto-generated XML sitemap
- [ ] **DEPL-03**: Deployed to Cloudflare Pages with git integration
- [ ] **DEPL-04**: Custom domain (drimian.com) configured
- [ ] **DEPL-05**: View transitions between pages (Astro View Transitions)
- [ ] **DEPL-06**: Page load < 3 seconds on 3G connection

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Expansion
- **CONT-04**: Blog section (only if 1 post/month commitment is made)
- **CONT-05**: Additional case studies as new clients complete engagements
- **CONT-06**: English version (i18n) if international demand appears

### Analytics & Optimization
- **ANLY-01**: Diagnostic completion funnel tracking (how many start vs finish)
- **ANLY-02**: A/B testing on diagnostic question order
- **ANLY-03**: Heatmap analysis on results page

### Advanced Features
- **ADVN-01**: Dynamic OG images showing personalized radar chart for social sharing
- **ADVN-02**: PDF export of diagnostic results
- **ADVN-03**: Diagnostic comparison (take it again, see how you improved)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog (without content commitment) | Stale blog is worse than no blog -- jefe's explicit guidance |
| Services page with prices | Positions as commodity, competitors can undercut |
| Client testimonials | Generates suspicion in Bolivia market |
| Client logos | In Bolivia, clients avoid being seen using consultants |
| Slider/carousel | Slow loading, poor mobile UX, nobody sees slide 3 |
| Stock photos | Generic, undermines credibility |
| Contact form as primary CTA | Low conversion in Bolivia -- WhatsApp is primary |
| Backend/database | All computation client-side, no server needed |
| User accounts/login | Diagnostic is anonymous, no user management |
| CMS | Content changes are infrequent, code-managed is simpler |
| Dark mode toggle | Theme is by section (design decision), not user preference |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1 | Complete |
| FOUN-02 | Phase 1 | Complete |
| FOUN-03 | Phase 1 | Complete |
| FOUN-04 | Phase 1 | Complete |
| FOUN-05 | Phase 1 | Complete |
| FOUN-06 | Phase 1 | Complete |
| FOUN-07 | Phase 1 | Complete |
| FOUN-08 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| HOME-05 | Phase 2 | Complete |
| HOME-06 | Phase 2 | Complete |
| DIAG-01 | Phase 3 | Complete |
| DIAG-02 | Phase 3 | Complete |
| DIAG-03 | Phase 3 | Complete |
| DIAG-04 | Phase 3 | Complete |
| DIAG-05 | Phase 3 | Complete |
| DIAG-06 | Phase 3 | Complete |
| DIAG-07 | Phase 3 | Complete |
| SCOR-01 | Phase 3 | Complete |
| SCOR-02 | Phase 3 | Complete |
| SCOR-03 | Phase 3 | Complete |
| SCOR-04 | Phase 3 | Complete |
| SCOR-05 | Phase 3 | Complete |
| SCOR-06 | Phase 3 | Complete |
| SCOR-07 | Phase 3 | Complete |
| RESU-01 | Phase 3 | Pending |
| RESU-02 | Phase 3 | Pending |
| RESU-03 | Phase 3 | Pending |
| RESU-04 | Phase 3 | Pending |
| RESU-05 | Phase 3 | Pending |
| RESU-06 | Phase 3 | Pending |
| RESU-07 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| DEPL-01 | Phase 5 | Pending |
| DEPL-02 | Phase 5 | Pending |
| DEPL-03 | Phase 5 | Pending |
| DEPL-04 | Phase 5 | Pending |
| DEPL-05 | Phase 5 | Pending |
| DEPL-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
