# Phase 2: Homepage - Research

**Researched:** 2026-03-20
**Domain:** Static homepage assembly (Astro components, image optimization, WhatsApp integration, smooth scroll)
**Confidence:** HIGH

## Summary

Phase 2 assembles the homepage from existing Phase 1 components (Section, Nav, Footer, Button, Card) plus new section-specific content. The technical challenges are modest: logo image optimization, WhatsApp deep linking, a floating button, smooth scroll anchors, and a rotating principle data structure. All content comes from the Documento Maestro spec (sections 4-7).

The biggest architectural decision is where to place images. Astro only optimizes images stored in `src/assets/` -- files in `public/` are served unmodified. Since the logo PNG is already small (25KB, 1600x397px), it can go in `src/assets/images/` and be served via the `<Image />` component for automatic WebP conversion and cache-busting hashes.

**Primary recommendation:** Build each homepage section as a standalone Astro component, compose them in `index.astro`, use `src/assets/` for the logo (Astro Image optimization), CSS `scroll-padding-top` for anchor offset, and a simple `position: fixed` element for the WhatsApp floating button.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero headline: "Estas construyendo lo que va a hacer prospera a tu empresa?" -- exact copy from spec
- Hero subtitle: "10 preguntas. 3 minutos. Descubri si estas empujando mas fuerte -- o cambiando lo que importa." -- exact copy
- Primary CTA: "Empezar el diagnostico" (filled orange button) -- scrolls to next section for now
- Secondary CTA: "O segui leyendo (down arrow)" -- subtle text + arrow, scrolls to content below hero
- Background: clean dark navy (#131a37), NO isotipo/watermark, NO decorative elements
- Logo: Drimian-1 (full logo: isotipo + "drimian" + "Dream with Intelligence") centered in hero
- Full viewport height (100vh)
- Section order: Hero > Que es Drimian > Modelo > Principio Rotativo > CTA Final > Footer
- WhatsApp number: +59176600056
- Floating WhatsApp button: persistent bottom-right, green icon, visible on all pages
- All content from Documento Maestro sections 4-7 (no invented content)
- Sector tags: Salud, Construccion, Hoteleria, Seguros + "Si tu industria no esta en la lista, hablemos igual"

### Claude's Discretion
- WhatsApp pre-built message text (natural, conversational tone)
- Logo color treatment on dark backgrounds (white vs blue #0143a0)
- Footer logo variant and size
- Exact scroll behavior (smooth scroll, offset for nav height)
- How to display sector tags (inline text, pills/badges, etc.)
- Rotating principle implementation (static for now, rotation mechanism)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section -- full viewport, provocative headline, CTA to diagnostic, subtle isotipo background | Logo optimization, smooth scroll anchors, existing Section/Button components. Note: CONTEXT.md overrides "subtle isotipo background" -- hero is clean, no isotipo. |
| HOME-02 | "What is Drimian" section -- 4 lines, sectors, "We Dream With Intelligence" | Sector tag display patterns (pills/badges), existing Section component with `theme="light"` |
| HOME-03 | "Skin in the game" model section -- performance-based bonus, automatic exit clause | Content layout patterns, existing Section with `theme="light-alt"` |
| HOME-04 | Rotating principle section -- 1 principle from Guia Drimian, monthly rotation | Data file structure for principles, month-based selection logic |
| HOME-05 | Final CTA section -- "Empecemos a conversar" + WhatsApp + email + address | WhatsApp wa.me deep link format, contact info layout |
| HOME-06 | Floating WhatsApp button -- persistent bottom-right, green icon, visible on all pages | CSS position:fixed pattern, z-index layering, WhatsApp SVG icon |
</phase_requirements>

## Standard Stack

### Core (already installed from Phase 1)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 6.x | Static site framework | Already set up. Zero JS by default. `<Image />` component for optimization. |
| Tailwind CSS | 4.x | Styling | Already configured with `@theme` tokens in `global.css`. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sharp | (Astro built-in) | Image optimization | Used automatically by Astro's `<Image />` component for WebP conversion |

### No New Dependencies Needed
Phase 2 requires zero new npm packages. Everything is achievable with existing Astro components, CSS, and minimal inline `<script>` blocks.

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
src/
  assets/
    images/
      drimian-logo.png        # Copy of Drimian-1.png for Astro optimization
  components/
    Hero.astro                 # Hero section (100vh, logo, headline, CTAs)
    WhatIsDrimian.astro        # "Que es Drimian" section
    SkinInTheGame.astro        # "Piel en el juego" model section
    RotatingPrinciple.astro    # Monthly rotating principle
    CtaFinal.astro             # Final CTA with contact info
    WhatsAppFloat.astro        # Floating WhatsApp button (global)
    Footer.astro               # Extended footer (update existing)
    Nav.astro                  # Update logo path (existing)
  data/
    principles.ts              # Array of 10 principles for rotation
  pages/
    index.astro                # Compose all homepage sections
```

### Pattern 1: Section-per-Component
**What:** Each homepage section is its own `.astro` component that wraps the existing `Section.astro` layout component.
**When to use:** Always for homepage sections -- keeps `index.astro` clean and each section independently editable.
**Example:**
```astro
---
// src/components/Hero.astro
import Section from './Section.astro';
import Button from './Button.astro';
import { Image } from 'astro:assets';
import logo from '../assets/images/drimian-logo.png';
---
<Section theme="dark" id="hero" class="min-h-screen flex items-center">
  <div class="text-center">
    <Image src={logo} alt="Drimian" width={320} class="mx-auto mb-10" />
    <h1 class="text-hero mb-6">...</h1>
    <!-- CTAs -->
  </div>
</Section>
```

### Pattern 2: Data-Driven Rotating Content
**What:** Store principles in a TypeScript data file. Select the current month's principle at build time.
**When to use:** For the rotating principle section (HOME-04).
**Example:**
```typescript
// src/data/principles.ts
export interface Principle {
  id: number;
  title: string;
  body: string;   // 3-4 lines
  month: number;  // 1-12 (maps to principle index)
}

export const principles: Principle[] = [
  { id: 1, month: 1, title: "La unidad de analisis es la decision", body: "..." },
  // ... 10 principles
];

export function getCurrentPrinciple(): Principle {
  const month = new Date().getMonth(); // 0-11
  return principles[month % principles.length];
}
```

### Pattern 3: Composing index.astro
**What:** The homepage composes section components in order, with the nav-sentinel between hero and content.
**Example:**
```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import WhatIsDrimian from '../components/WhatIsDrimian.astro';
import SkinInTheGame from '../components/SkinInTheGame.astro';
import RotatingPrinciple from '../components/RotatingPrinciple.astro';
import CtaFinal from '../components/CtaFinal.astro';
import Footer from '../components/Footer.astro';
import WhatsAppFloat from '../components/WhatsAppFloat.astro';
---
<Base title="Drimian">
  <Nav />
  <Hero />
  <div id="nav-sentinel" class="h-0 w-0" aria-hidden="true"></div>
  <WhatIsDrimian />
  <SkinInTheGame />
  <RotatingPrinciple />
  <CtaFinal />
  <Footer />
  <WhatsAppFloat />
</Base>
```

### Anti-Patterns to Avoid
- **Putting images in `public/`:** Astro cannot optimize images in `public/`. They are served as-is with no WebP conversion, no cache-busting hash, no responsive sizes. Always use `src/assets/` with the `<Image />` component.
- **Using `<img>` tag directly for the logo:** Loses Astro's automatic WebP conversion and width/height attributes (CLS prevention). Use `import { Image } from 'astro:assets'` instead.
- **Hardcoding principle content in the component:** Makes rotation difficult. Separate data from presentation.
- **JavaScript for smooth scroll:** CSS `scroll-behavior: smooth` is already set in `global.css` (line 87). No JS needed for anchor scrolling.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Manual sharp/squoosh pipeline | `import { Image } from 'astro:assets'` | Astro handles WebP conversion, responsive srcset, width/height CLS prevention, cache-busting hashes automatically |
| Smooth scrolling | Custom JS scroll handler | CSS `scroll-behavior: smooth` (already in global.css) + `scroll-padding-top` for nav offset | Native CSS, zero JS, already configured |
| WhatsApp deep link | Custom URL builder | Simple `https://wa.me/59176600056?text=...` with `encodeURIComponent()` | Standard wa.me format, works on all devices |
| WhatsApp icon | Download icon file | Inline SVG in the component | Single color, small, no HTTP request, theme-adaptable |
| Section theming | Custom CSS per section | Existing `Section.astro` with `theme` prop | Already handles dark/light/light-alt with CSS variables |

## Common Pitfalls

### Pitfall 1: Scroll offset with fixed nav
**What goes wrong:** Clicking "O segui leyendo" scrolls to the section but the top content is hidden behind the fixed nav bar (64px height).
**Why it happens:** CSS `scroll-behavior: smooth` scrolls to the element's top, which is under the nav.
**How to avoid:** Add `scroll-padding-top: 4rem` (64px = nav height) to the `html` element in `global.css`. This offsets all anchor scroll targets.
**Warning signs:** Content cut off when clicking internal anchor links.

### Pitfall 2: Logo not visible on dark background
**What goes wrong:** The Drimian-1 logo has transparent background. If the logo text/elements are dark-colored, they disappear on the navy hero.
**Why it happens:** Logo was designed for light backgrounds.
**How to avoid:** Inspect the logo file. The Drimian-1.png is 1600x397 with RGBA (transparency). Need to verify if the logo elements are light (white/blue) or dark. If dark, need a white version or CSS `filter: brightness(0) invert(1)` as fallback.
**Warning signs:** Logo invisible or barely visible on hero dark background.

### Pitfall 3: WhatsApp button overlapping content on mobile
**What goes wrong:** The floating button covers important content or CTAs on small screens.
**Why it happens:** Fixed positioning with static bottom/right values doesn't account for varying content layouts.
**How to avoid:** Use `bottom: 1.5rem; right: 1.5rem` on mobile (smaller margin), ensure the button is 56px (not too large), and add `z-index: 40` (below the nav's z-50 but above all content).
**Warning signs:** Button covering text or other interactive elements on 375px viewport.

### Pitfall 4: 100vh on mobile browsers
**What goes wrong:** `min-h-screen` (100vh) doesn't account for mobile browser chrome (address bar, toolbar). Hero appears taller than the viewport.
**Why it happens:** Mobile browsers dynamically show/hide their UI, but CSS `100vh` uses the maximum viewport height.
**How to avoid:** Use `min-h-[100dvh]` (dynamic viewport height) instead of `min-h-screen`. Tailwind v4 supports `dvh` units. Falls back gracefully to `100vh` in older browsers.
**Warning signs:** Hero has visible scrollbar when it shouldn't, or content extends below fold on mobile.

### Pitfall 5: Astro Image import path issues
**What goes wrong:** Build fails with "Could not find image" or "Image not found" error.
**Why it happens:** Astro's `<Image />` requires ESM imports from `src/`, not string paths like `"/images/logo.png"`.
**How to avoid:** Always import images: `import logo from '../assets/images/drimian-logo.png';` then pass to `<Image src={logo} />`.
**Warning signs:** Build errors mentioning image resolution or file not found.

## Code Examples

### WhatsApp Deep Link (wa.me format)
```typescript
// WhatsApp number format: country code + number, no + or spaces
const WHATSAPP_NUMBER = '59176600056';

// Pre-filled message (Claude's discretion for exact text)
const message = 'Hola, me interesa conocer mas sobre como Drimian puede ayudar a mi empresa.';

// Full URL with encoded message
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
// Result: https://wa.me/59176600056?text=Hola%2C%20me%20interesa%20conocer%20mas%20sobre%20como%20Drimian%20puede%20ayudar%20a%20mi%20empresa.
```

### Floating WhatsApp Button Component
```astro
---
// src/components/WhatsAppFloat.astro
const number = '59176600056';
const message = 'Hola, me interesa conocer mas sobre como Drimian puede ayudar a mi empresa.';
const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
---
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contactanos por WhatsApp"
  class="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
>
  <svg viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
```

### Astro Image Import (for logo)
```astro
---
// Source: Astro docs - https://docs.astro.build/en/guides/images/
import { Image } from 'astro:assets';
import logo from '../assets/images/drimian-logo.png';
---
<!-- Astro auto-converts to WebP, adds width/height, generates cache-bust hash -->
<Image src={logo} alt="Drimian - Dream with Intelligence" width={320} />
```

### Scroll Padding for Nav Offset
```css
/* Add to global.css @layer base */
html {
  scroll-behavior: smooth;       /* already exists */
  scroll-padding-top: 5rem;      /* 80px offset for fixed nav (64px + 16px breathing room) */
}
```

### Sector Tags as Pills
```astro
---
const sectors = ['Salud', 'Construccion', 'Hoteleria', 'Seguros'];
---
<div class="flex flex-wrap gap-3 justify-center">
  {sectors.map(sector => (
    <span class="px-4 py-2 rounded-full border border-[var(--section-border)] text-sm font-medium text-[var(--section-text-secondary)]">
      {sector}
    </span>
  ))}
</div>
<p class="text-sm text-[var(--section-text-secondary)] mt-4 italic">
  Si tu industria no esta en la lista, hablemos igual.
</p>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `100vh` for full viewport | `100dvh` (dynamic viewport height) | CSS 2023, widely supported 2024+ | Fixes mobile browser chrome issue. Tailwind v4 supports `min-h-dvh` or `min-h-[100dvh]`. |
| JS smooth scroll libraries | CSS `scroll-behavior: smooth` + `scroll-padding-top` | CSS 2019, universal support 2023 | Zero JS needed for anchor scrolling. Already in project's global.css. |
| Manual image optimization | Astro `<Image />` component | Astro 3.0+ (2023) | Auto WebP, cache-busting, width/height for CLS, all at build time. |
| `<img>` with manual srcset | `import { Image } from 'astro:assets'` with ESM import | Astro 3.0+ | Must use ESM import from `src/assets/`. `public/` images get no optimization. |

## Open Questions

1. **Logo color on dark background**
   - What we know: Drimian-1.png is 1600x397px RGBA PNG, 25KB. It has transparency.
   - What's unclear: Whether the logo elements (text + isotipo) are light-colored (visible on dark) or need a white variant. The CONTEXT.md mentions "Drimian-logos" folder has only Drimian-1.png and Drimian-2.png plus a brand manual PDF.
   - Recommendation: During implementation, visually inspect the PNG. If elements are dark, apply CSS `filter: brightness(0) invert(1)` or create a white version. The brand manual PDF may have guidance on logo color usage.

2. **Exact content from Documento Maestro**
   - What we know: CONTEXT.md says all content comes from Documento Maestro sections 4-7.
   - What's unclear: The Documento Maestro file was not found in the project directory. Content may be in the reference repo (`github.com/VITALIASALUD/drimian-web`) or in another location.
   - Recommendation: Implementation task should source content from the reference repo or ask the user for the Documento Maestro location. Placeholder content can be used initially.

3. **Drimian-1 vs Drimian-2 usage**
   - What we know: Drimian-1.png = full logo (isotipo + "drimian" + "Dream with Intelligence"). Drimian-2.png = icon only. Both are 1600x397px, ~25KB.
   - What's unclear: Both files have identical dimensions, which is unusual for an "icon only" variant.
   - Recommendation: Inspect both during implementation. Use Drimian-1 for hero and nav as specified.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Astro dev server + browser inspection |
| Config file | astro.config.mjs (already exists) |
| Quick run command | `pnpm dev` (visual inspection) |
| Full suite command | `pnpm build` (build succeeds = no broken imports/images) |

### Phase Requirements --> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero renders: logo, headline, subtitle, 2 CTAs, 100dvh, dark theme | smoke | `pnpm build` (no build errors) + visual | N/A (visual) |
| HOME-02 | "What is Drimian" section: text, sector pills, light theme | smoke | `pnpm build` + visual | N/A (visual) |
| HOME-03 | "Skin in the game" section: model content, light-alt theme | smoke | `pnpm build` + visual | N/A (visual) |
| HOME-04 | Rotating principle: shows a principle, month-based selection | unit | `node -e "import('./src/data/principles.ts').then(...)"` | Wave 0: principles.ts |
| HOME-05 | CTA Final: WhatsApp link, email, address, dark theme | smoke | `pnpm build` + verify wa.me URL in HTML output | N/A (visual) |
| HOME-06 | Floating WhatsApp: visible, correct link, z-index below nav | smoke | `pnpm build` + visual | N/A (visual) |

### Sampling Rate
- **Per task commit:** `pnpm build` (must succeed)
- **Per wave merge:** `pnpm build` + visual check of all 6 sections at 375px and 1440px
- **Phase gate:** Full build green + visual verification of all HOME requirements

### Wave 0 Gaps
- [ ] `src/data/principles.ts` -- principle data file (needed for HOME-04)
- [ ] `src/assets/images/drimian-logo.png` -- logo file copied from OneDrive source
- [ ] `public/images/` directory may need creation for any non-optimized assets

## Sources

### Primary (HIGH confidence)
- Astro Image docs -- `src/assets/` vs `public/` optimization behavior, `<Image />` component API
- Astro project global.css (line 87) -- `scroll-behavior: smooth` already configured
- Existing components (Section.astro, Button.astro, Nav.astro, Footer.astro) -- verified API and props
- Logo file inspection via `file` command -- 1600x397px RGBA PNG, 25KB

### Secondary (MEDIUM confidence)
- [WhatsApp wa.me deep link format](https://developers.facebook.com/community/threads/957849225969148/) -- `https://wa.me/{number}?text={encoded_message}`
- [CSS scroll-padding-top for fixed header offset](https://spigotdesign.com/smooth-scroll-offset-anchor-links-with-css/) -- universal browser support
- [Astro Image optimization guide](https://docs.astro.build/en/guides/images/) -- ESM import required, public/ not optimized
- [CSS 100dvh for mobile viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport_units) -- supported in all modern browsers

### Tertiary (LOW confidence)
- WhatsApp floating button patterns from [various implementations](https://scriptfeeds.com/blog/wordpress/add-a-floating-whatsapp-button-without-plugin-in-website/) -- general consensus on position:fixed, #25D366, z-index 40-100

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all existing Phase 1 setup
- Architecture: HIGH -- straightforward Astro component composition, well-documented patterns
- Image optimization: HIGH -- Astro docs are clear on src/ vs public/ behavior
- WhatsApp integration: HIGH -- wa.me format is stable and well-documented
- Pitfalls: MEDIUM -- mobile 100dvh and logo visibility need runtime verification
- Content sourcing: LOW -- Documento Maestro location unknown, may need user input

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable domain, no fast-moving dependencies)
