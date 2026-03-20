# Drimian Web 2.0

## What This Is

Website for Drimian, a management and technology consulting firm based in Santa Cruz, Bolivia (part of Grupo Foianini). The site is built around an interactive diagnostic tool ("Diagnostico de Prosperidad") that lets business owners assess 10 mechanisms that produce prosperity, then see a radar of 7 prosperity indicators and their top 2-3 leverage points. The site also features thought leadership content (principles from the Guia Drimian) and anonymized case studies with real metrics. Not a brochure — a credibility and lead generation engine that demonstrates methodology through experience.

## Core Value

The interactive diagnostic must work flawlessly: 10 fullscreen questions with micro-revelations, a 7-axis radar chart with weighted scoring, and personalized leverage points — all culminating in a WhatsApp CTA with pre-built context. This is the 80% of the site's value.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with hybrid dark/light theme (hero + diagnostic in dark, rest in light)
- [ ] Fullscreen immersive diagnostic experience (10 questions, one at a time)
- [ ] Micro-revelations after each answer (3-4 second display)
- [ ] Two-layer scoring algorithm (mechanisms → 7 prosperity indicators)
- [ ] Radar chart (heptagon) with 7 prosperity indicators normalized to 0-100%
- [ ] Leverage points algorithm (top 2-3 weakest mechanisms by weighted impact)
- [ ] Dynamic narrative results by profile (4 profiles x indicator combinations)
- [ ] WhatsApp CTA with pre-built message including profile, score, and leverage points
- [ ] Optional email capture for detailed analysis (low friction, post-result)
- [ ] Hero section (full viewport, provocative headline, CTA to diagnostic)
- [ ] "What is Drimian" section (4 lines, sectors, "We Dream With Intelligence")
- [ ] "Skin in the game" model section (performance-based bonus structure)
- [ ] Rotating principle section (monthly rotation from Guia Drimian)
- [ ] Final CTA section with WhatsApp + contact info
- [ ] Floating WhatsApp button (persistent)
- [ ] /principios page — 10 principles from the Guia Drimian as short articles
- [ ] /resultados page — anonymized case studies with real metrics (4 cases from reference repo)
- [ ] Mobile-first responsive design (375px first, scale up)
- [ ] Page weight < 1MB, optimized for Bolivia's variable internet speeds
- [ ] Deployment on Cloudflare Pages or Netlify
- [ ] Modern frontend framework (not vanilla HTML)
- [ ] Progress bar for diagnostic (subtle, top, "1/10, 2/10...")

### Out of Scope

- Blog — unless committed to 1 post/month minimum (jefe's explicit guidance)
- Services page with list/prices — positions as commodity (benchmarking finding)
- Client testimonials — generates suspicion in Bolivia market
- Slider/carousel — slow loading, nobody sees slide 3
- Stock photos — only logo, isotipo, and real illustrations
- Client logos — in Bolivia, clients don't want to be seen using consultants
- Contact form as primary conversion — WhatsApp is primary in Bolivia
- Backend/database — all client-side computation for diagnostic
- User accounts/login — no user management needed
- CMS — content managed via code, updated via deploys

## Context

### Business Context
Drimian is a consulting firm within Grupo Foianini (4 companies: Clinica Foianini, Vitalia Salud, Raizant, Hotel Ibis). Drimian's intellectual asset is the "Guia Drimian" — a systematic methodology for organizational prosperity based on 10 mechanisms and 7 prosperity indicators. No competitor in Bolivia or the region has anything equivalent.

### Reference Repository
The boss provided `github.com/VITALIASALUD/drimian-web` as reference. It's a vanilla HTML/CSS/JS implementation with the full diagnostic logic, scoring algorithm, and content. The content and diagnostic logic are validated — the architecture needs modernization.

### Brand Identity
- **Colors**: Navy `#131a37` (logo), Blue `#0143a0` (accent), Gray `#878787` (text), Orange `#FF6600` (CTAs)
- **Logo**: Abstract star/portal icon + "drimian" wordmark + "Dream with Intelligence" tagline
- **Font (logo)**: Nexa
- **Available assets**: Drimian-1.png (full logo), Drimian-2.png (icon only), brand manual PDF

### Design Direction
- **Hybrid theme**: Dark immersive (navy #131a37) for hero + diagnostic sections. Light clean (white/off-white) for informational sections
- **Clean + sophisticated** — not a dark heavy site, not a generic corporate blue
- **Whitespace as design element** — McKinsey/BCG level of breathing room
- **Typography**: Serif with personality for headlines + clean sans-serif for body
- **Animations**: Only fade-in on scroll, nothing blocking. Diagnostic transitions should be smooth but not slow
- **Max text width**: 680px for optimal readability
- **Spacing**: 80-120px desktop, 48-64px mobile between sections
- **Base text**: 18px desktop, 16px mobile

### Target Audience
Business owners in Bolivia (and broader Latin America) who:
- Are experiencing recurring organizational problems
- Suspect they need to change how they operate, not just work harder
- Make decisions based on intuition but want a framework
- Use WhatsApp as primary communication channel
- Browse primarily on mobile

### Diagnostic Algorithm (from specification)
- 10 questions, each scored a)=1, b)=2, c)=3, d)=4
- Total score (10-40) determines profile: Ausentes (10-17), Parciales (18-25), Construccion (26-33), Solidos (34-40)
- Each mechanism maps to 2-3 of 7 prosperity indicators with weights (1.0/0.6/0.3)
- Indicator score = weighted average, normalized to 0-100%: ((avg - 1) / 3) x 100
- Leverage points = mechanisms with score 1-2, ranked by total weight across all indicators
- Dynamic narrative selected by: profile range + 2 weakest indicators

### Content Available (from reference repo docs)
- 10 questions with 4 options each + micro-revelations (complete)
- Scoring matrix with weights (complete)
- 4 profile narratives with indicator-specific variants (complete)
- 4 anonymized case studies with metrics (complete)
- 3 principle examples for rotating section (complete)
- Section copy for "What is Drimian", "Model", CTA (complete)

## Constraints

- **Deployment**: Cloudflare Pages or Netlify (static hosting, free tier)
- **Performance**: < 1MB total page weight (Bolivia internet speeds)
- **Mobile**: Must be mobile-first (majority of Bolivian web traffic)
- **No backend**: All diagnostic computation client-side
- **Brand**: Must use official brand colors and logo assets
- **Content**: All copy from the specification docs — no invented content
- **Bolivia context**: WhatsApp as primary CTA, no heavy imagery, fast loading

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid dark/light theme | Dark for immersion in diagnostic, light for readability in content | -- Pending |
| Fullscreen immersive diagnostic | Each question fills viewport — no distractions, app-like feel | -- Pending |
| Modern frontend framework (TBD) | Vanilla HTML feels like a report, need component architecture + routing | -- Pending |
| WhatsApp as primary CTA | Bolivia market reality — forms have low conversion | -- Pending |
| No backend/CMS | Static site keeps it fast, cheap, simple to deploy | -- Pending |
| Include /principios + /resultados in v1 | Full scope — thought leadership + case studies differentiate | -- Pending |
| Orange (#FF6600) for CTAs only | Clean design, orange pops for action items, blue for everything else | -- Pending |

---
*Last updated: 2026-03-20 after initialization*
