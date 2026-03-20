# Phase 1: Foundation + Design System - Research

**Researched:** 2026-03-20
**Domain:** Astro 5 project scaffold, Tailwind CSS v4 theming, typography system, responsive layout, hybrid dark/light architecture
**Confidence:** HIGH

## Summary

This phase establishes the entire technical foundation: Astro 5 project with Preact islands, Tailwind CSS v4 with CSS-first configuration, brand typography, color system, responsive layout components, and a hybrid dark/light section architecture. Every subsequent phase builds on these decisions.

The stack is well-documented and stable. Astro 5 + Tailwind CSS v4 via `@tailwindcss/vite` is the officially recommended integration path. The main research challenges were: (1) selecting a serif headline font that supports the user's required 600-700 weight, (2) defining the hybrid dark/light section pattern without a global toggle, and (3) establishing the scroll-triggered nav pattern.

**Primary recommendation:** Use Playfair Display (600-700 weight) + Inter for typography. Define dark/light sections via data attributes on section wrappers with CSS custom properties. Use IntersectionObserver sentinel pattern for scroll-triggered nav.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Headlines: Serif font, elegant yet simple, harmonious with Drimian logo (geometric, modern blue). Direction: "elegante pero sencillo, que toda la pagina tenga armonia"
- Body font: Same direction -- elegant, simple, harmonious
- Headline weight: Bold/semibold (600-700). Strong, confident, impactful -- Bain/BCG feel
- Headline scale: Dramatic -- hero 72px+ on desktop, 38px on mobile
- Letter spacing: tight (-0.02em) for headers
- Hero has NO nav bar -- only logo centered. Clean, immersive first impression
- Nav appears on scroll down (slides in from top), hidden when user is at the top
- Nav links: Logo (left) + "Principios" link + "Empezar diagnostico" CTA button (orange)
- Mobile: hamburger menu (standard)
- Dark to light: Hard cut -- clean, no gradient, no angled divider. Minimal
- Light sections alternate: white (#FFFFFF) and gray (#F5F5F5) for visual rhythm
- Diagnostic overlay: Full overlay -- takes complete control of viewport, dark navy background
- Overall personality: Confident + minimal. Lots of whitespace. Few elements, each with weight
- Animations: Almost none. Fade-in on scroll only. No elaborate hover effects
- Cards: Subtle border (1px light gray), no shadow. Clean, defined edges
- Buttons: Primary filled orange (#FF6600) white text. Secondary outlined or text with arrow
- No decorative elements, no illustrations beyond the isotipo
- Brand colors: navy #131a37, blue #0143a0, gray #878787, orange #FF6600
- Orange is ONLY for CTAs and action items -- not decoration

### Claude's Discretion
- Specific serif headline font selection (direction: elegant + simple + harmonious with Drimian logo)
- Specific body font selection (direction: elegant + simple + harmony across page)
- Nav background color/behavior on scroll (adapt to section context)
- Loading skeleton design
- Exact border-radius values (lean towards subtle, not too rounded)
- CSS variable naming convention

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUN-01 | Site uses Astro 5 + Preact + Tailwind CSS 4 as tech stack | Verified install commands, config patterns, Vite plugin integration |
| FOUN-02 | Mobile-first responsive (375px baseline) | Tailwind v4 mobile-first breakpoints, reference repo patterns |
| FOUN-03 | Hybrid dark/light theme architecture | Data-attribute section theming with CSS custom properties |
| FOUN-04 | Brand typography system (serif headlines + sans-serif body) | Playfair Display 600-700 + Inter, self-hosted WOFF2, preload strategy |
| FOUN-05 | Brand color system (navy, blue, gray, orange) | @theme directive with --color-* namespace in Tailwind v4 |
| FOUN-06 | Base layout components (header, footer, section containers, max-width 680px) | Astro component patterns, section wrapper architecture |
| FOUN-07 | Spacing system (80-120px desktop, 48-64px mobile) | @theme --spacing-* custom tokens, responsive section padding |
| FOUN-08 | Total page weight < 1MB (target < 350KB) | Font subsetting, self-hosting, Astro zero-JS, purged Tailwind |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Ships zero JS by default. Islands architecture. Cloudflare acquired Astro Jan 2026. |
| @astrojs/preact | latest | Preact island integration | Enables `client:*` directives on Preact components. 3KB runtime. |
| Preact | 10.x | Interactive components (future phases) | Same JSX API as React at 3KB vs 40KB. |
| Tailwind CSS | 4.x | Utility-first CSS | CSS-first config via @theme. Rust engine (5x faster). Auto content detection. |
| @tailwindcss/vite | latest | Vite plugin for Tailwind v4 | Official integration path for Astro 5. Replaces deprecated @astrojs/tailwind. |
| TypeScript | 5.x | Type safety | Astro first-class support. Types scoring algorithm in Phase 3. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sharp | latest | Image optimization | Used by Astro's `<Image>` component for WebP/AVIF conversion |
| @astrojs/check | latest | Type checking .astro files | Dev dependency, catches template errors at build |
| Prettier + prettier-plugin-astro | latest | Code formatting | Consistent formatting across .astro, .tsx, .css |

### Fonts (Self-Hosted WOFF2)

| Font | Weight(s) | Role | File Size (est.) |
|------|-----------|------|-----------------|
| Playfair Display | 600, 700 | Headlines | ~25KB (Latin subset, 2 weights) |
| Inter | 400, 500, 600 | Body text, UI | ~30KB (Latin subset, variable or 3 weights) |

**Total font budget: ~55KB** (well within 60KB target from STACK.md)

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playfair Display | DM Serif Display | DM Serif Display only has weight 400. User requires 600-700. Would need faux-bold which looks poor. |
| Playfair Display | Instrument Serif | Only weight 400. Condensed face -- looks modern but cannot achieve the bold/semibold the user wants. |
| Playfair Display | Fraunces | Variable font with 9 weights. More "quirky" personality -- less BCG/Bain feel, more startup. |
| Playfair Display | Lora | 4 weights including 700. More bookish/literary, less commanding for large headlines. |
| Inter | DM Sans | Similar quality. Inter has wider adoption, variable font option, slightly better screen rendering. |

**Installation:**
```bash
# Initialize project
pnpm create astro@latest drimian-web -- --template minimal --typescript strict

# Add Preact integration
pnpm astro add preact

# Install Tailwind v4 (NOT @astrojs/tailwind -- that's deprecated for v4)
pnpm add tailwindcss @tailwindcss/vite

# Dev tools
pnpm add -D prettier prettier-plugin-astro @astrojs/check typescript
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  components/           # Shared .astro components (zero JS)
    Nav.astro           # Scroll-triggered navigation
    Footer.astro        # Site footer
    Section.astro       # Section wrapper with dark/light theming
    Button.astro        # Primary/secondary button component
    Card.astro          # Card with subtle border
  islands/              # Interactive Preact components (hydrated)
    (empty for Phase 1 -- used in Phase 3)
  layouts/
    Base.astro          # HTML head, font preloads, ViewTransitions, global CSS import
  pages/
    index.astro         # Homepage (Phase 2 content)
  styles/
    global.css          # @import "tailwindcss", @theme, @font-face, section theming
public/
  fonts/                # Self-hosted WOFF2 subsets
    playfair-display-600.woff2
    playfair-display-700.woff2
    inter-latin-var.woff2   # or individual weights
  images/
    logo-white.png      # From reference repo
    isotipo.svg         # Brand mark (if available)
```

### Pattern 1: Astro Config with Tailwind v4 Vite Plugin

**What:** Project configuration using the official Tailwind v4 integration via Vite plugin.
**When to use:** Project setup (once).

```typescript
// astro.config.mjs
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://drimian.com',
  integrations: [
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Pattern 2: Tailwind v4 CSS-First Theme Configuration

**What:** Brand design tokens defined in CSS using @theme directive (NO tailwind.config.js).
**When to use:** global.css -- the single source of truth for the design system.

```css
/* src/styles/global.css */
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

/* ===== BRAND DESIGN TOKENS ===== */
@theme {
  /* Colors */
  --color-navy: #131a37;
  --color-blue: #0143a0;
  --color-gray: #878787;
  --color-orange: #FF6600;
  --color-orange-hover: #ff8533;

  /* Dark theme colors */
  --color-bg-dark: #0a0a14;
  --color-bg-section: #0f0f1e;
  --color-bg-card: #16162a;
  --color-border-dark: #2a2a40;
  --color-text-primary: #f0f0f5;
  --color-text-secondary: #9999aa;
  --color-text-muted: #666680;

  /* Light theme colors */
  --color-bg-white: #FFFFFF;
  --color-bg-light: #F5F5F5;
  --color-text-dark: #1a1a1a;
  --color-text-body: #4a4a4a;
  --color-border-light: #e5e5e5;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font sizes -- dramatic scale */
  --text-hero: 4.5rem;     /* 72px */
  --text-h1: 3.5rem;       /* 56px */
  --text-h2: 2.5rem;       /* 40px */
  --text-h3: 1.5rem;       /* 24px */
  --text-body: 1.0625rem;  /* 17px */
  --text-small: 0.875rem;  /* 14px */

  /* Spacing -- section gaps */
  --spacing-section-desktop: 6rem;    /* 96px (within 80-120px range) */
  --spacing-section-mobile: 3.5rem;   /* 56px (within 48-64px range) */

  /* Border radius -- subtle, not too rounded */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Transitions */
  --animate-fade-in: fade-in 0.4s ease;

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/* ===== FONT FACES ===== */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin-var.woff2') format('woff2');
  font-weight: 400 600;
  font-style: normal;
  font-display: swap;
}

/* ===== BASE STYLES ===== */
@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: var(--font-body);
    line-height: 1.7;
  }

  h1, h2, h3 {
    font-family: var(--font-heading);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
}
```

### Pattern 3: Hybrid Dark/Light Section Architecture

**What:** Section-based theming using data attributes. No global toggle -- each section declares its own theme.
**When to use:** Every section wrapper component.

```css
/* In global.css -- section theme definitions */
@layer base {
  /* Dark sections (hero, diagnostic) */
  [data-theme="dark"] {
    --section-bg: var(--color-bg-dark);
    --section-text: var(--color-text-primary);
    --section-text-secondary: var(--color-text-secondary);
    --section-border: var(--color-border-dark);
    --section-card-bg: var(--color-bg-card);
  }

  /* Light sections - white variant */
  [data-theme="light"] {
    --section-bg: var(--color-bg-white);
    --section-text: var(--color-text-dark);
    --section-text-secondary: var(--color-text-body);
    --section-border: var(--color-border-light);
    --section-card-bg: var(--color-bg-white);
  }

  /* Light sections - gray variant (alternating) */
  [data-theme="light-alt"] {
    --section-bg: var(--color-bg-light);
    --section-text: var(--color-text-dark);
    --section-text-secondary: var(--color-text-body);
    --section-border: var(--color-border-light);
    --section-card-bg: var(--color-bg-white);
  }
}
```

```astro
<!-- src/components/Section.astro -->
---
interface Props {
  theme: 'dark' | 'light' | 'light-alt';
  id?: string;
  class?: string;
}
const { theme, id, class: className } = Astro.props;
---
<section
  data-theme={theme}
  id={id}
  class:list={[
    'px-6 md:px-12',
    'py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section-desktop)]',
    'bg-[var(--section-bg)] text-[var(--section-text)]',
    className
  ]}
>
  <div class="mx-auto max-w-[680px]">
    <slot />
  </div>
</section>
```

Usage in a page:
```astro
<!-- Hard cut between dark and light -- no transition, no gradient -->
<Section theme="dark" id="hero">...</Section>
<Section theme="light" id="what-is-drimian">...</Section>
<Section theme="light-alt" id="skin-in-game">...</Section>
<Section theme="light" id="principle">...</Section>
<Section theme="dark" id="footer-cta">...</Section>
```

### Pattern 4: Scroll-Triggered Navigation with IntersectionObserver

**What:** Nav hidden at top, slides in when user scrolls past hero. Uses a sentinel element at the bottom of the hero section.
**When to use:** Nav component.

```astro
<!-- src/components/Nav.astro -->
---
---
<nav
  id="main-nav"
  class="fixed top-0 left-0 right-0 z-50 -translate-y-full transition-transform duration-300"
  aria-label="Main navigation"
>
  <div class="flex items-center justify-between px-6 py-4 bg-navy/95 backdrop-blur-sm">
    <a href="/" class="flex items-center">
      <img src="/images/logo-white.png" alt="Drimian" class="h-8" />
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="/principios" class="text-text-primary text-sm font-medium hover:text-orange transition-colors">
        Principios
      </a>
      <a href="#diagnostic" class="inline-flex items-center gap-2 px-6 py-2.5 bg-orange text-white text-sm font-semibold rounded-md hover:bg-orange-hover transition-colors">
        Empezar diagnostico
      </a>
    </div>
    <!-- Mobile hamburger -->
    <button id="mobile-menu-btn" class="md:hidden text-text-primary" aria-label="Menu">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
</nav>

<!-- Sentinel: placed at bottom of hero. When it leaves viewport, nav appears. -->
<div id="nav-sentinel" class="h-0 w-0" aria-hidden="true"></div>
```

**JavaScript (inline script in Base.astro -- minimal, no framework needed):**
```html
<script>
  const nav = document.getElementById('main-nav');
  const sentinel = document.getElementById('nav-sentinel');

  if (nav && sentinel) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT visible (scrolled past hero), show nav
        if (!entry.isIntersecting) {
          nav.classList.remove('-translate-y-full');
        } else {
          nav.classList.add('-translate-y-full');
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
  }
</script>
```

This is ~15 lines of JS. No library needed. IntersectionObserver is supported in all modern browsers (97%+ global support).

### Pattern 5: Font Preloading in Base Layout

**What:** Critical font preloading to prevent layout shift (CLS).
**When to use:** Base.astro layout `<head>`.

```astro
<!-- src/layouts/Base.astro -->
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Dream with Intelligence - Consultoria estrategica basada en decisiones' } = Astro.props;
---
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | Drimian</title>
  <meta name="description" content={description} />

  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/playfair-display-700.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Global CSS (includes Tailwind + @theme + @font-face) -->
  <style is:global>
    @import '../styles/global.css';
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

### Anti-Patterns to Avoid

- **Creating tailwind.config.js:** Tailwind v4 uses CSS-first @theme. No JS config file. Most tutorials online are v3 -- ignore them.
- **Using @astrojs/tailwind integration:** Deprecated for v4. Use @tailwindcss/vite in vite.plugins instead.
- **Loading fonts from Google Fonts CDN:** Adds DNS lookup + render-blocking request. Self-host WOFF2 subsets instead.
- **Using `client:load` on any Phase 1 component:** Phase 1 is all static. Zero JS islands. The nav uses an inline `<script>` tag, not a Preact island.
- **Using `dark:` Tailwind variant for section theming:** `dark:` is for system/user preference toggle. This project uses section-based theming via data attributes.
- **Faux-bolding a 400-weight serif font:** Never apply `font-weight: 700` to a font that only has weight 400. The browser synthesizes a poor imitation. Use a font that ships the weight you need.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS utility system | Custom utility classes | Tailwind CSS v4 @theme | Purging, responsive prefixes, design system constraints |
| Font optimization | Manual subsetting pipeline | google-webfonts-helper + manual download | Subset to Latin, get WOFF2, done in 5 minutes |
| Image optimization | Manual compression | Astro `<Image>` + sharp | Automatic WebP/AVIF, responsive sizes, lazy loading |
| Scroll detection for nav | Custom scroll event listener | IntersectionObserver | Scroll events fire 60x/sec, IO is async and performant |
| Mobile menu state | Custom state management | Inline `<script>` with toggle | 5 lines of JS, no framework needed |

**Key insight:** Phase 1 should produce ZERO JavaScript bundles. Everything is static HTML + CSS. The only JS is the inline nav script (~15 lines) which Astro inlines into the HTML.

## Common Pitfalls

### Pitfall 1: Tailwind v3 Config Pattern

**What goes wrong:** Developer follows v3 tutorials and creates `tailwind.config.js`. Tailwind v4 ignores it -- styles don't apply.
**Why it happens:** 95% of Tailwind content online is v3. Search results, Stack Overflow, blog posts all show the old pattern.
**How to avoid:** No `tailwind.config.js` in the project. All config in `global.css` via `@theme { }`. If this file exists, delete it.
**Warning signs:** Tailwind classes not applying. A `tailwind.config.js` file exists in root.

### Pitfall 2: Using Deprecated @astrojs/tailwind

**What goes wrong:** Running `astro add tailwind` installs @astrojs/tailwind which was designed for Tailwind v3.
**Why it happens:** The Astro docs may still reference it. Old habit.
**How to avoid:** Install `tailwindcss` and `@tailwindcss/vite` directly. Add vite plugin to `astro.config.mjs`. Do NOT use `astro add tailwind` unless it has been updated for v4 (verify).
**Warning signs:** `@astrojs/tailwind` in package.json alongside Tailwind v4.

### Pitfall 3: Font Weight Mismatch

**What goes wrong:** Headlines render in browser-synthesized bold (faux-bold) instead of the actual 600/700 weight of Playfair Display.
**Why it happens:** @font-face declaration doesn't include the 600/700 weight files. Or the wrong weight is specified in CSS.
**How to avoid:** Separate @font-face declarations for weight 600 and 700. Verify with DevTools > Computed > font-weight that the correct font file is loaded.
**Warning signs:** Headlines look "smeared" or thicker than expected. DevTools shows synthesized bold.

### Pitfall 4: Layout Shift from Font Loading (CLS)

**What goes wrong:** Text renders in fallback font (Georgia/sans-serif), then jumps when Playfair Display/Inter loads.
**Why it happens:** WOFF2 files not preloaded. Browser shows fallback first.
**How to avoid:** (1) Preload the 700-weight headline font and Inter via `<link rel="preload">`. (2) Use `font-display: swap` (acceptable for this use case). (3) Set `size-adjust` on fallback to match metrics.
**Warning signs:** Visible text reflow on initial page load. Lighthouse CLS > 0.1.

### Pitfall 5: Section Theme Bleeding

**What goes wrong:** Dark section CSS variables "leak" into the next light section, or vice versa.
**Why it happens:** CSS custom properties inherit. If a parent sets --section-bg, all children inherit it.
**How to avoid:** Each `<Section>` component must set its data-theme attribute. The CSS custom properties are scoped to `[data-theme="X"]` selectors which apply to that element and its descendants, overriding the parent.
**Warning signs:** A light section appears with dark text colors, or a dark section has white background.

### Pitfall 6: Tailwind CSS Import Method

**What goes wrong:** Using `<style>` tag in .astro files without properly importing global.css, causing @theme tokens to not be available.
**Why it happens:** Astro scopes `<style>` tags by default. Tailwind utilities need to be globally available.
**How to avoid:** Import global.css in Base.astro layout using `<style is:global>@import '../styles/global.css';</style>` or import it in the frontmatter. All pages use the Base layout.
**Warning signs:** Tailwind classes not working in some components. Custom color classes like `bg-navy` not recognized.

## Code Examples

### Button Component

```astro
<!-- src/components/Button.astro -->
---
interface Props {
  variant?: 'primary' | 'secondary';
  href?: string;
  class?: string;
}
const { variant = 'primary', href, class: className } = Astro.props;

const baseClasses = 'inline-flex items-center gap-2 font-semibold text-base transition-all duration-300 cursor-pointer rounded-md';

const variantClasses = {
  primary: 'px-8 py-4 bg-orange text-white hover:bg-orange-hover hover:-translate-y-0.5',
  secondary: 'px-8 py-4 border border-[var(--section-border)] text-[var(--section-text)] hover:border-[var(--section-text-secondary)]',
};
---
{href ? (
  <a href={href} class:list={[baseClasses, variantClasses[variant], className]}>
    <slot />
  </a>
) : (
  <button class:list={[baseClasses, variantClasses[variant], className]}>
    <slot />
  </button>
)}
```

### Card Component

```astro
<!-- src/components/Card.astro -->
---
interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---
<div class:list={[
  'p-6 md:p-7',
  'border border-[var(--section-border)]',
  'rounded-lg',
  'bg-[var(--section-card-bg)]',
  className
]}>
  <slot />
</div>
```

### Responsive Typography Scale

```css
/* Mobile-first typography (in global.css @layer base) */
@layer base {
  h1 {
    font-size: 2.375rem;   /* 38px mobile */
    font-weight: 700;
  }
  h2 {
    font-size: 1.75rem;    /* 28px mobile */
    font-weight: 700;
  }
  h3 {
    font-size: 1.25rem;    /* 20px mobile */
    font-weight: 600;
  }
}

/* Desktop overrides */
@media (min-width: 768px) {
  h1 { font-size: var(--text-h1); }    /* 56px */
  h2 { font-size: var(--text-h2); }    /* 40px */
  h3 { font-size: var(--text-h3); }    /* 24px */
}

/* Hero headline -- special case, even larger */
.text-hero {
  font-size: 2.375rem;    /* 38px mobile */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .text-hero {
    font-size: var(--text-hero);  /* 72px desktop */
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | CSS @theme directive | Tailwind v4, Jan 2025 | No JS config. All theming in CSS. Auto content detection. |
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Astro 5.2, early 2025 | Direct Vite plugin. Simpler, fewer moving parts. |
| scroll event listeners | IntersectionObserver | Widely supported 2020+ | Async, performant, no jank. 97%+ browser support. |
| Google Fonts CDN | Self-hosted WOFF2 subsets | Best practice since 2022 | No external DNS, no render blocking, GDPR compliant. |
| font-display: optional | font-display: swap + preload | Current best practice | Swap ensures text is always visible. Preload minimizes FOIT. |
| Tailwind dark: variant for theming | data-attribute scoped theming | CSS custom properties | Section-based themes on same page without JS toggle. |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Do not use with Tailwind v4. Use `@tailwindcss/vite` instead.
- `tailwind.config.js`: Replaced by `@theme` in CSS. V4 still supports JS config for migration but CSS-first is the standard.
- Content array in Tailwind config: V4 auto-detects. No `content: ['./src/**/*.{astro,tsx}']` needed.

## Font Selection Rationale

### Headline: Playfair Display (600-700 weight)

**Why this font:**
1. **Supports required weights:** Available in 400-900. The user explicitly requires 600-700 weight. DM Serif Display and Instrument Serif only offer 400 -- they cannot deliver the bold/semibold the user wants without faux-bolding.
2. **High contrast:** Dramatic thick/thin strokes command attention at 72px+. Consistent with BCG/Bain consulting aesthetic.
3. **Geometric harmony:** The font's proportions and axis of contrast complement the Drimian logo's geometric character.
4. **Proven at scale:** Widely used in editorial and luxury brand contexts. Well-hinted for screen rendering.
5. **Latin subset available:** Spanish characters (accents, n with tilde) included in Latin subset. ~12-15KB per weight in WOFF2.

**Confidence: HIGH** -- Weight availability is a hard constraint. Playfair Display is the only elegant serif on Google Fonts with 600-700 weights and the right personality.

### Body: Inter

**Why this font:**
1. **Designed for screens:** Created by Rasmus Andersson specifically for UI/screen legibility.
2. **Variable font option:** Single ~30KB file covers weights 400-600 for body text needs.
3. **Pairs beautifully with Playfair Display:** The contrast between Playfair's high-contrast serifs and Inter's clean geometry creates visual hierarchy naturally.
4. **Reference repo precedent:** The existing Drimian site already uses Inter for body text. Continuity.
5. **Large x-height:** Excellent readability at body text sizes (17px target).

**Confidence: HIGH** -- Inter is the industry-standard screen font. The reference repo already uses it.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None yet -- Phase 1 is static HTML/CSS, no logic to test |
| Config file | None -- see Wave 0 |
| Quick run command | `pnpm astro check` (type checking) |
| Full suite command | `pnpm build` (build succeeds = valid Astro) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | Astro 5 + Preact + Tailwind v4 installed | smoke | `pnpm build` exits 0 | N/A Wave 0 |
| FOUN-02 | Responsive at 375px | manual-only | Visual inspection at 375px viewport | N/A |
| FOUN-03 | Dark/light sections render correctly | manual-only | Visual inspection of section backgrounds/text colors | N/A |
| FOUN-04 | Fonts load correctly | manual-only | DevTools > Network > filter woff2, verify files load | N/A |
| FOUN-05 | Brand colors applied | smoke | `pnpm build` + grep CSS output for hex values | N/A |
| FOUN-06 | Layout components render | smoke | `pnpm build` exits 0, pages generate in dist/ | N/A |
| FOUN-07 | Section spacing correct | manual-only | Visual inspection, DevTools computed styles | N/A |
| FOUN-08 | Page weight < 1MB | smoke | `ls -la dist/` + sum file sizes, or Lighthouse audit | N/A |

**Justification for manual-only:** Phase 1 is a design system -- CSS rendering, visual layout, font loading, and responsive behavior are inherently visual. Automated visual regression testing (Playwright screenshots) would add significant complexity for 8 requirements. The build succeeding is the primary automated gate.

### Sampling Rate

- **Per task commit:** `pnpm astro check && pnpm build`
- **Per wave merge:** `pnpm build` + manual visual check at 375px and 1280px
- **Phase gate:** Build green + visual review of all sections at both breakpoints

### Wave 0 Gaps

- [ ] Project does not exist yet -- `pnpm create astro@latest` is the first task
- [ ] No test infrastructure needed for Phase 1 (design system is verified visually + build success)
- [ ] Playwright visual regression could be added in Phase 5 (SEO/deployment) for ongoing quality

## Open Questions

1. **Font files acquisition**
   - What we know: Playfair Display and Inter are on Google Fonts, free to self-host
   - What's unclear: Best tool for subsetting to Latin-only WOFF2 on Windows
   - Recommendation: Use google-webfonts-helper (https://gwfh.mranftl.com/) to download pre-subset WOFF2 files. Alternative: download from Google Fonts API directly and convert with fonttools.

2. **Nav background on scroll -- adapt to section underneath**
   - What we know: User wants nav to adapt (dark on dark, light on light, or glassmorphism)
   - What's unclear: Whether to use IntersectionObserver for section detection or a simpler fixed approach
   - Recommendation: Start with semi-transparent navy (`bg-navy/95 backdrop-blur-sm`) which works on both dark and light sections. Revisit in Phase 2 if it doesn't feel right. Adaptive nav-per-section adds significant complexity for marginal visual improvement.

3. **Astro CSS import method**
   - What we know: Global CSS can be imported via `<style is:global>` or via frontmatter `import`
   - What's unclear: Which method works best with Tailwind v4 @theme in Astro 5
   - Recommendation: Use frontmatter import `import '../styles/global.css'` in Base.astro. This is the pattern shown in the official Tailwind + Astro guide.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro) - Exact install steps, config, CSS import
- [Tailwind CSS v4 @theme documentation](https://tailwindcss.com/docs/theme) - Theme variable syntax, namespaces, @font-face integration
- [Astro Preact integration](https://docs.astro.build/en/guides/integrations-guide/preact/) - Setup, client directives, Astro 5 compatibility
- [Astro install and setup](https://docs.astro.build/en/install-and-setup/) - Create astro command, project scaffold
- Reference repo CSS (`_reference_repo/css/style.css`) - Existing brand colors, DM Serif Display + Inter pattern, component styles

### Secondary (MEDIUM confidence)
- [Playfair Display on Google Fonts](https://fonts.google.com/specimen/Playfair+Display) - Weight availability 400-900 confirmed
- [DM Serif Display on Google Fonts](https://fonts.google.com/specimen/DM+Serif+Display) - Weight 400 only, confirmed
- [Instrument Serif on Google Fonts](https://fonts.google.com/specimen/Instrument+Serif) - Weight 400 only, condensed display
- [Smashing Magazine - Dynamic Header with IntersectionObserver](https://www.smashingmagazine.com/2021/07/dynamic-header-intersection-observer/) - Sentinel pattern for scroll-triggered nav
- [Instrument Serif + Inter pairing](https://maxibestof.one/typefaces/instrument-serif/pairing/inter) - Font pairing validation

### Tertiary (LOW confidence)
- [Tailkits - Astro + Tailwind v4 setup guide](https://tailkits.com/blog/astro-tailwind-setup/) - Third-party guide, cross-verified with official docs
- [Medium - Theming in Tailwind CSS v4](https://medium.com/@sir.raminyavari/theming-in-tailwind-css-v4-support-multiple-color-schemes-and-dark-mode-ba97aead5c14) - Data-attribute theming pattern

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs. Install commands confirmed.
- Architecture: HIGH - Patterns based on official Tailwind v4 docs + Astro guides. Section theming is standard CSS.
- Typography: HIGH - Weight availability verified. Playfair Display is the clear choice given the 600-700 constraint.
- Pitfalls: HIGH - Based on verified Tailwind v3->v4 migration issues and font loading best practices.

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable stack, unlikely to change in 30 days)
