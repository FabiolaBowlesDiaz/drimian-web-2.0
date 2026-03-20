# Technology Stack

**Project:** Drimian Web 2.0
**Researched:** 2026-03-20

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro | 5.x (stable) | Static site framework, routing, build | Ships zero JS by default. Islands architecture hydrates only interactive components. 95% less JS than Next.js for static sites. Native View Transitions for smooth page navigation. Cloudflare acquired Astro (Jan 2026) -- first-class deployment support. Content-driven sites are its primary use case. | HIGH |
| Preact | 10.x | Interactive island components (diagnostic, radar chart) | 3KB gzipped vs React's 40KB. Same JSX API as React. Purpose-built for Astro islands where bundle size matters. Bolivia's variable internet makes every KB count. | HIGH |

**Why Astro over alternatives:**
- **vs Next.js**: Next.js ships a React runtime (~80KB min) even for static pages. Overkill for a consulting site with one interactive feature. Next.js is for web apps, not content sites.
- **vs SvelteKit**: Excellent framework but smaller ecosystem. Astro lets you use Preact/React islands where needed while keeping everything else zero-JS. SvelteKit would require the Svelte runtime on every page.
- **vs Vanilla HTML**: No component reuse, no routing abstractions, no build optimization, no view transitions. The reference repo already hit these limitations.

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.x | Utility-first CSS | v4 uses Rust engine (5x faster builds). CSS-first config with @theme -- no tailwind.config.js needed. Built-in container queries. Automatic content detection. Mobile-first by default. One `@import "tailwindcss"` line to start. | HIGH |

**Why Tailwind over alternatives:**
- **vs CSS Modules**: Tailwind produces smaller CSS bundles via purging. Faster development with utility classes. Responsive design is trivial with breakpoint prefixes.
- **vs Styled Components / CSS-in-JS**: Adds JS runtime weight. Defeats the purpose of Astro's zero-JS approach.
- **vs Plain CSS**: No design system constraints. Easy to end up with inconsistent spacing, colors, breakpoints.

### Charting (Radar/Heptagon)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Custom SVG | N/A | 7-axis prosperity radar chart | A 7-point radar chart is basic trigonometry (~50 lines of code). No library needed. SVG renders crisply at any resolution, uses less memory on mobile than Canvas, and is accessible. Adding Chart.js (67KB full, ~30KB tree-shaken) for ONE chart type is wasteful. An Astro component can server-render the SVG with zero client JS for the static display, then hydrate only if animation is needed. | HIGH |

**Why custom SVG over Chart.js:**
- The radar chart has exactly 7 fixed axes with 0-100% values. This is a polygon with labeled vertices -- not a dynamic data visualization problem.
- Chart.js requires Canvas, which is blurry on retina without 2x scaling and uses more memory on low-end mobile devices.
- Paul Scanlon published a tutorial specifically on building SVG radar charts in Astro with Tailwind -- validated pattern.
- If the team later wants animation on the radar, a simple CSS transition or 10-line JS animation is sufficient.

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro View Transitions | Built-in | Page-to-page transitions | Native browser View Transitions API. Zero JS in supporting browsers (85%+ support in 2025). Smooth fade/morph between pages with 2 lines of code. Fallback for older browsers built in. | HIGH |
| CSS Animations + Transitions | N/A | Scroll fade-ins, diagnostic transitions, micro-interactions | The project spec says "only fade-in on scroll, nothing blocking." CSS `@keyframes` + `animation-timeline: view()` handles scroll-triggered fades natively. No animation library needed for this scope. | HIGH |

**Why no Motion/GSAP/Framer Motion:**
- Project explicitly limits animations to "fade-in on scroll" and "smooth but not slow" diagnostic transitions.
- CSS `animation-timeline: view()` (Scroll-driven Animations API) handles scroll-triggered fades with zero JS.
- Diagnostic question transitions are simple opacity/transform -- CSS transitions handle this perfectly.
- Adding Motion (~32KB) or GSAP (~25KB) for fade effects is a poor tradeoff when page weight target is <1MB.

### Deployment

| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| Cloudflare Pages | Static hosting | Free tier. Global CDN with edge locations in Latin America (Sao Paulo, Buenos Aires -- closest to Bolivia). Astro static output (`output: 'static'`) deploys directly -- no adapter needed. Git integration for auto-deploys. Cloudflare now owns Astro -- guaranteed first-class support. | HIGH |

**Why Cloudflare Pages over Netlify:**
- Cloudflare has edge nodes closer to Bolivia (Latin America PoPs).
- Cloudflare acquired Astro in January 2026 -- the frameworks are converging.
- Free tier is generous (unlimited bandwidth vs Netlify's 100GB).
- For a pure static site, no adapter is required -- just `output: 'static'` and deploy the `dist/` folder.

**Note:** The Cloudflare adapter is only needed for SSR/server routes. This project is fully static -- no adapter required.

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| @astrojs/preact | latest | Astro integration for Preact islands | Install once during project setup. Enables `client:*` directives on Preact components. | HIGH |
| @astrojs/sitemap | latest | SEO sitemap generation | Auto-generates sitemap.xml at build time for /principios, /resultados, etc. | HIGH |
| @astrojs/check | latest | Type checking for .astro files | Dev dependency. Catches template errors at build time. | MEDIUM |
| sharp | latest | Image optimization | Astro's built-in `<Image>` component uses sharp for automatic WebP/AVIF conversion and responsive sizing. Critical for <1MB page weight. | HIGH |
| typescript | 5.x | Type safety | Astro has first-class TypeScript support. Types the diagnostic scoring algorithm, question data, profile logic. | HIGH |

### Fonts

| Decision | Recommendation | Why | Confidence |
|----------|---------------|-----|------------|
| Font loading | Self-hosted subset WOFF2 | Google Fonts adds DNS lookup + render-blocking request. Self-hosting with `font-display: swap` eliminates external dependency. Subset to Latin characters only (Spanish) saves ~60% font file size. | HIGH |
| Headline font | Serif with personality (e.g., Playfair Display or similar) | Project spec: "Serif with personality for headlines." Subset to ~20KB WOFF2. | MEDIUM |
| Body font | Clean sans-serif (e.g., Inter or DM Sans) | Project spec: "clean sans-serif for body." Inter is variable-weight in a single ~30KB file. | MEDIUM |
| Logo font | Nexa (brand requirement) | Only needed for the logo -- use the logo image asset instead of loading the full font. | HIGH |

## Development Tools

| Tool | Purpose | Why |
|------|---------|-----|
| pnpm | Package manager | Faster installs, strict dependency resolution, smaller node_modules via symlinks |
| Prettier + prettier-plugin-astro | Code formatting | Consistent formatting across .astro, .tsx, .css files |
| ESLint | Linting | Catch errors early. Astro has official ESLint plugin. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 5 | Next.js 15 | Ships React runtime on every page. ~80KB minimum JS. Designed for web apps, not content sites. |
| Framework | Astro 5 | SvelteKit | Good framework but requires Svelte runtime everywhere. Smaller component ecosystem than React/Preact. |
| Framework | Astro 5 | Nuxt 4 | Vue ecosystem. Same runtime-on-every-page problem as Next.js. |
| Island runtime | Preact | React | 13x larger bundle (40KB vs 3KB). Identical API for this use case. |
| Island runtime | Preact | Svelte | Svelte compiles to smaller output per component, but Preact's JSX is more widely known and the diagnostic is the only interactive island. |
| Styling | Tailwind 4 | Vanilla CSS | No design system enforcement. Inconsistent spacing/colors across team members. |
| Styling | Tailwind 4 | Sass/SCSS | Adds build complexity. Tailwind's utility approach is faster for this type of design. |
| Charts | Custom SVG | Chart.js | 30-67KB for one radar chart. Canvas-based (blurry on retina, more memory on mobile). |
| Charts | Custom SVG | D3.js | 70KB+ even tree-shaken. Massive overkill for a static 7-axis polygon. |
| Charts | Custom SVG | react-svg-radar-chart | Adds a dependency for what is ~50 lines of trigonometry. Also hasn't been updated recently. |
| Animation | CSS native | Motion (Framer) | 32KB for fade effects. CSS handles everything in this project's animation spec. |
| Animation | CSS native | GSAP | 25KB. Licensing complexity for commercial use. Overkill for fade-in-on-scroll. |
| Hosting | Cloudflare Pages | Netlify | Fewer Latin America edge nodes. Lower free tier bandwidth. No Astro acquisition synergy. |
| Hosting | Cloudflare Pages | Vercel | Optimized for Next.js, not Astro. Edge network less relevant for static files. |

## Installation

```bash
# Initialize project
pnpm create astro@latest drimian-web -- --template minimal --typescript strict

# Core integration
pnpm astro add preact
pnpm astro add sitemap

# Styling
pnpm add tailwindcss @tailwindcss/vite

# Dev tools
pnpm add -D prettier prettier-plugin-astro @astrojs/check typescript
```

## Astro Configuration

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://drimian.com',
  integrations: [
    preact(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

## Project Structure

```
src/
  components/         # Shared .astro components (zero JS)
  islands/            # Interactive Preact components (hydrated)
    Diagnostic.tsx    # Fullscreen diagnostic experience
    RadarChart.tsx    # SVG radar (or .astro if no animation needed)
  layouts/
    Base.astro        # HTML head, ViewTransitions, font loading
    Dark.astro        # Dark theme wrapper (hero + diagnostic)
    Light.astro       # Light theme wrapper (content sections)
  pages/
    index.astro       # Homepage
    principios.astro  # 10 principles page
    resultados.astro  # Case studies page
  data/
    questions.ts      # 10 questions + options + micro-revelations
    scoring.ts        # Weight matrix, profile logic, indicator calc
    profiles.ts       # 4 profile narratives with variants
    cases.ts          # 4 anonymized case studies
  styles/
    global.css        # @import "tailwindcss", @theme, font-face
public/
  fonts/              # Self-hosted WOFF2 subsets
  images/             # Logo, isotipo, illustrations
```

## Performance Budget

| Asset | Target | Strategy |
|-------|--------|----------|
| HTML | <15KB | Astro generates minimal HTML |
| CSS | <20KB | Tailwind purges unused utilities |
| JS (homepage) | <5KB | Only WhatsApp button island (if interactive) |
| JS (diagnostic) | <50KB | Preact 3KB + diagnostic logic ~15KB + SVG radar ~5KB |
| Fonts | <60KB | 2 fonts, Latin subset, WOFF2 |
| Images | <200KB | WebP/AVIF via Astro Image, lazy loading |
| **Total** | **<350KB** | Well under 1MB target |

## Sources

- [Astro Official Site](https://astro.build/)
- [Astro 6 Beta Announcement](https://astro.build/blog/astro-6-beta/)
- [Astro Joins Cloudflare](https://blog.cloudflare.com/astro-joins-cloudflare/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Deploy Astro to Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Preact vs React Comparison](https://www.alphabold.com/preact-vs-react/)
- [Astro + Preact Performance](https://www.offerzen.com/blog/maximise-web-app-performance-with-astro-and-preact)
- [SVG Radar Chart in Astro](https://www.paulie.dev/posts/2023/10/how-to-create-an-svg-radar-chart/)
- [Chart.js Radar](https://www.chartjs.org/docs/latest/charts/radar.html)
- [Motion Library](https://motion.dev/)
