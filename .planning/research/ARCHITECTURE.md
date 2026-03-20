# Architecture Patterns

**Domain:** Interactive consulting website with diagnostic tool
**Researched:** 2026-03-20

## Recommended Architecture

**Pattern: Static Shell + Interactive Islands**

The site is 90% static content (HTML/CSS, zero JS) with one major interactive island (the diagnostic tool). Astro's islands architecture is purpose-built for this exact pattern.

```
+--------------------------------------------------+
|                  Astro Static Shell               |
|  (HTML + CSS, zero JavaScript, server-rendered)   |
|                                                   |
|  +------+ +----------+ +-----------+ +--------+  |
|  | Hero | | Sections | | Principios| |Resultad|  |
|  +------+ +----------+ +-----------+ +--------+  |
|                                                   |
|  +----------------------------------------------+ |
|  |        Preact Island: Diagnostic Tool        | |
|  |  (hydrated on interaction, client:visible)   | |
|  |                                              | |
|  |  Questions -> Scoring -> Radar -> WhatsApp   | |
|  +----------------------------------------------+ |
|                                                   |
|  +------------------+  +----------------------+   |
|  | WhatsApp Button  |  | Optional Email Form  |   |
|  | (Preact, tiny)   |  | (Preact, post-result)|   |
|  +------------------+  +----------------------+   |
+--------------------------------------------------+
```

### Component Boundaries

| Component | Responsibility | Technology | JS Shipped |
|-----------|---------------|------------|------------|
| Base Layout | HTML head, meta, fonts, ViewTransitions, theme structure | Astro (.astro) | 0 KB |
| Navigation | Site nav, mobile hamburger | Astro (.astro) + CSS :has() | 0 KB |
| Hero Section | Full viewport, headline, CTA button | Astro (.astro) | 0 KB |
| Info Sections | "What is Drimian", "Skin in the game", Principles, CTA | Astro (.astro) | 0 KB |
| Diagnostic Tool | 10 questions, transitions, micro-revelations, scoring, results | Preact island (.tsx) | ~20 KB |
| Radar Chart | 7-axis SVG heptagon with animated fill | Preact island (.tsx) or Astro component | ~3 KB |
| WhatsApp Button | Floating button with pre-built message | Astro (.astro) | 0 KB |
| Email Capture | Optional post-result form | Preact island (.tsx) | ~2 KB |
| Page: /principios | 10 principle articles | Astro (.astro) | 0 KB |
| Page: /resultados | 4 case studies | Astro (.astro) | 0 KB |

### Data Flow

```
1. User lands on homepage
   -> Astro serves pre-rendered HTML + CSS (zero JS)
   -> View Transitions component in <head> enables smooth navigation

2. User clicks "Start Diagnostic" CTA
   -> Diagnostic Preact island hydrates (client:visible or client:idle)
   -> Questions stored in src/data/questions.ts (typed array)

3. User answers question N
   -> State: answers[] array in Preact component state
   -> Micro-revelation displays for 3-4 seconds (CSS transition)
   -> Progress bar updates (N/10)
   -> Next question renders (CSS slide/fade transition)

4. After question 10, scoring runs
   -> src/data/scoring.ts: calculateProfile(answers) -> profile
   -> src/data/scoring.ts: calculateIndicators(answers) -> 7 scores
   -> src/data/scoring.ts: calculateLeveragePoints(answers) -> top 2-3

5. Results render
   -> RadarChart component receives 7 indicator scores
   -> SVG polygon drawn with CSS animation (grow from center)
   -> Profile narrative selected from src/data/profiles.ts
   -> Leverage points listed with explanations

6. WhatsApp CTA generates
   -> wa.me link with URL-encoded: profile name, total score,
      indicator scores, top leverage points
   -> User taps -> WhatsApp opens with pre-filled message
   -> Sales team has full context before first reply

7. Optional email capture
   -> Simple form, no backend
   -> Could use Cloudflare Workers form handler or mailto: link
   -> LOW priority -- WhatsApp is the primary conversion path
```

## Patterns to Follow

### Pattern 1: Section-Based Theme Switching (Hybrid Dark/Light)

**What:** CSS custom properties define two theme contexts. Sections declare which theme they use via a class or data attribute. No JS toggle.

**When:** Any section that needs the dark immersive feel (hero, diagnostic) vs light readable feel (content sections).

**Example:**
```css
/* global.css */
:root {
  --bg: #ffffff;
  --text: #878787;
  --accent: #0143a0;
}

[data-theme="dark"] {
  --bg: #131a37;
  --text: #f0f0f0;
  --accent: #0143a0;
}

[data-theme="dark"] .cta {
  --cta-bg: #FF6600;
}
```

```astro
<!-- Homepage sections -->
<section data-theme="dark" class="min-h-screen">
  <Hero />
</section>

<section data-theme="light">
  <WhatIsDrimian />
</section>

<section data-theme="dark">
  <DiagnosticIsland client:visible />
</section>
```

### Pattern 2: Typed Data Layer for Diagnostic Logic

**What:** All diagnostic content and scoring logic lives in strongly-typed TypeScript files in `src/data/`. No magic numbers, no inline content.

**When:** Any feature that uses diagnostic questions, scoring weights, profiles, or case study data.

**Example:**
```typescript
// src/data/types.ts
export interface Question {
  id: number;
  mechanism: string;
  text: string;
  options: { label: string; value: 1 | 2 | 3 | 4 }[];
  microRevelation: string;
}

export interface IndicatorWeight {
  indicator: ProsperityIndicator;
  weight: 1.0 | 0.6 | 0.3;
}

export type ProsperityIndicator =
  | 'diferenciacion'
  | 'margen'
  | 'clientesQueVuelven'
  | 'talentoQueQuiereEstar'
  | 'capacidadDeInvertir'
  | 'resiliencia'
  | 'opcionalidad';

export type Profile = 'ausentes' | 'parciales' | 'construccion' | 'solidos';
```

### Pattern 3: Progressive Enhancement for Diagnostic

**What:** The diagnostic entry point renders a static CTA that works without JS. When Preact hydrates, it replaces the CTA with the full interactive experience.

**When:** The diagnostic island, to ensure the page works even before JS loads.

### Pattern 4: SVG Radar Chart as Component

**What:** The radar chart is a single component that takes 7 normalized scores (0-100) and renders an SVG polygon. Server-renderable, optionally animated.

**When:** Results display after diagnostic completion.

The math: 7 axes at 360/7 = ~51.43 degrees apart. Each point placed at `polarToCartesian(i * 51.43, score/100 * maxRadius, center, center)`. Connect points to form filled polygon with SVG `<polygon>` element.

## Anti-Patterns to Avoid

### Anti-Pattern 1: SPA Router for Multi-Page Site

**What:** Using React Router, Preact Router, or similar client-side routing for page navigation.

**Why bad:** Loads the entire routing library + all page content into a single JS bundle. Defeats Astro's static generation. Breaks native browser navigation, back button, and link sharing.

**Instead:** Use Astro's file-based routing (`src/pages/`). Each page is a separate HTML file. View Transitions provide smooth navigation without client-side routing.

### Anti-Pattern 2: Global State Library for Diagnostic

**What:** Using Redux, Zustand, or similar for the diagnostic question state.

**Why bad:** The diagnostic state is local to one component, lives for ~3 minutes, and is discarded after WhatsApp CTA. A global state library adds bundle weight for no benefit.

**Instead:** Use Preact's `useState` or `useReducer` inside the Diagnostic component. State shape: `{ currentQuestion: number, answers: number[], showingRevelation: boolean }`.

### Anti-Pattern 3: Loading Full Charting Library

**What:** Importing Chart.js, D3, Recharts, or ApexCharts for the radar chart.

**Why bad:** 30-70KB of JS for one static visualization with 7 data points. The chart doesn't need tooltips, zoom, pan, or dynamic updates.

**Instead:** Custom SVG component. 7-point polygon is basic trigonometry. ~50 lines of code, ~3KB.

### Anti-Pattern 4: CSS-in-JS in Astro Components

**What:** Using styled-components, Emotion, or CSS modules inside .astro files.

**Why bad:** Astro has built-in scoped styles via `<style>` tags in .astro files. CSS-in-JS adds runtime overhead and fights Astro's zero-JS philosophy.

**Instead:** Use `<style>` in .astro components (auto-scoped) and Tailwind utility classes. For Preact islands, use Tailwind classes or inline styles.

### Anti-Pattern 5: Hydrating Everything

**What:** Adding `client:load` to every component "just in case."

**Why bad:** Defeats islands architecture. Ships JS for components that don't need it (nav, footer, content sections).

**Instead:** Only hydrate what genuinely needs client-side interactivity: the diagnostic tool, the animated radar chart, and optionally the email form. Use `client:visible` (loads when scrolled into view) instead of `client:load` (loads immediately).

## Scalability Considerations

| Concern | Current Scope | Future Growth | Approach |
|---------|---------------|---------------|----------|
| Pages | 3-4 pages | Maybe 10-15 with blog | Astro handles hundreds of pages. Add content collections if blog is added. |
| Diagnostic complexity | 10 questions, fixed algorithm | Possibly industry-specific variants | Type the data layer now. Swap question sets via props. |
| Traffic | Low (consulting site) | Moderate after marketing push | Static site on CDN scales infinitely. No server to scale. |
| i18n | Spanish only | Possibly English | Astro has built-in i18n routing. Structure supports future addition. |
| Analytics | Cloudflare built-in | Custom event tracking | Add Plausible (1KB script) or Cloudflare Zaraz if needed later. |

## Sources

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Astro Scoped Styles](https://docs.astro.build/en/guides/styling/)
- [SVG Radar Chart Pattern](https://www.paulie.dev/posts/2023/10/how-to-create-an-svg-radar-chart/)
- [Cloudflare Pages Static Deploy](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
