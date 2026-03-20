# Domain Pitfalls

**Domain:** Interactive consulting website with diagnostic tool
**Researched:** 2026-03-20

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Hydrating the Entire Page Instead of Islands

**What goes wrong:** Developer adds `client:load` to every component or wraps the whole page in a Preact component, shipping 50-100KB of JS on pages that need zero interactivity.

**Why it happens:** Coming from React/Next.js habits where everything is a component. Not understanding that .astro files render to static HTML with zero JS.

**Consequences:** Page weight exceeds 1MB target. Slow loading on Bolivia's variable internet. Defeats the entire purpose of choosing Astro.

**Prevention:** Rule: Only files in `src/islands/` get `client:*` directives. Everything else is .astro (static). The diagnostic tool, radar chart animation, and email form are the ONLY islands.

**Detection:** Run `astro build` and check `dist/_astro/` folder. If JS files exceed 50KB total, something is wrong.

### Pitfall 2: WhatsApp Message URL Encoding Breaks on Mobile

**What goes wrong:** The pre-built WhatsApp message with diagnostic results contains special characters (accents in Spanish, percentage signs, line breaks) that break the `wa.me/` URL on certain Android browsers.

**Why it happens:** Naive string concatenation without proper URL encoding. Spanish characters like n with tilde, accented vowels, percentage signs in scores.

**Consequences:** WhatsApp opens but with garbled or empty message. The entire diagnostic-to-lead pipeline breaks at the last step.

**Prevention:**
- Use `encodeURIComponent()` for every dynamic value
- Use `%0A` for line breaks (not `\n`)
- Test on actual Android devices (not just desktop browser)
- Keep message under 1000 characters (WhatsApp URL limit)
- Use the `https://wa.me/591XXXXXXXX?text=` format (not `whatsapp://`)

**Detection:** Test the complete flow on 3+ devices: iPhone, Android Chrome, Android Samsung Browser.

### Pitfall 3: Diagnostic State Lost on Accidental Navigation

**What goes wrong:** User accidentally taps back button, swipes back (iOS), or taps a nav link while on question 7 of 10. All progress is lost. User abandons.

**Why it happens:** Diagnostic state lives in Preact component state (RAM only). No persistence. No navigation guard.

**Consequences:** User frustration. Abandonment. Lost lead.

**Prevention:**
- Store answers in `sessionStorage` as backup (restore on re-mount)
- Intercept browser back/navigation with `beforeunload` event during active diagnostic
- If diagnostic is on the homepage (scrolled section), consider making it a separate `/diagnostico` route to isolate navigation
- Show a "are you sure?" confirmation if user tries to leave mid-diagnostic

**Detection:** Test the diagnostic flow with browser back button, swipe gestures, and accidental nav clicks.

### Pitfall 4: Scoring Algorithm Diverges from Reference Implementation

**What goes wrong:** The new Preact implementation produces different scores than the reference vanilla JS implementation. Profile assignments differ. Leverage points differ.

**Why it happens:** Subtle differences in rounding, weight application order, or normalization formula. The reference repo has a specific algorithm that was validated with the boss.

**Consequences:** The diagnostic produces wrong results. The business methodology appears inconsistent. Trust is broken.

**Prevention:**
- Port the scoring algorithm as a pure TypeScript function with unit tests
- Create test fixtures: known input answers -> expected profile, indicators, leverage points
- Run the reference implementation and new implementation on the same 10+ test cases
- The formula is: `indicatorScore = ((weightedAvg - 1) / 3) * 100` -- verify this exactly

**Detection:** Automated tests that compare output for edge cases: all 1s, all 4s, mixed scores at profile boundaries (17/18, 25/26, 33/34).

## Moderate Pitfalls

### Pitfall 5: View Transitions Break Preact Island State

**What goes wrong:** When navigating from /principios back to the homepage with View Transitions, the diagnostic Preact island re-mounts and loses its state.

**Why it happens:** Astro View Transitions swap the page DOM. Islands are re-hydrated on navigation. This is expected behavior but catches developers off guard.

**Prevention:**
- Accept that diagnostic state resets on page navigation (this is fine -- the diagnostic is a single-session flow)
- If the diagnostic needs to persist across pages, use `sessionStorage` to backup/restore state
- Add `transition:persist` directive to the diagnostic island if it should survive page transitions

**Detection:** Navigate away from the diagnostic page and back during an active session.

### Pitfall 6: Font Loading Causes Layout Shift (CLS)

**What goes wrong:** Self-hosted fonts load after initial render, causing visible text reflow. Headline font (serif) swapping to body font (sans-serif) creates jarring layout shift.

**Why it happens:** WOFF2 files not preloaded. `font-display: swap` shows fallback font first, then swaps.

**Prevention:**
- Preload critical fonts with `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- Use `font-display: optional` instead of `swap` for non-critical fonts (shows fallback if font doesn't load in time, no shift)
- Set `size-adjust` on fallback font to match metrics of the web font
- Keep fonts to 2 maximum (headline + body)

**Detection:** Lighthouse CLS score. Chrome DevTools "Layout Shift" overlay.

### Pitfall 7: Tailwind v4 Configuration Confusion

**What goes wrong:** Developer follows Tailwind v3 tutorials/docs (which dominate search results) and creates a `tailwind.config.js` file. Tailwind v4 uses CSS-first configuration with `@theme` directives.

**Why it happens:** Tailwind v4 is relatively new (Jan 2025). Most blog posts, Stack Overflow answers, and tutorials reference v3 patterns.

**Prevention:**
- No `tailwind.config.js` file in the project
- Configure theme in `global.css` using `@theme { }` blocks
- Read Tailwind v4 docs specifically, not generic Tailwind guides
- Brand colors defined as: `@theme { --color-navy: #131a37; --color-blue: #0143a0; ... }`

**Detection:** If a `tailwind.config.js` file exists in the project, it's using the wrong pattern.

### Pitfall 8: Radar Chart Not Responsive on Small Screens

**What goes wrong:** The SVG radar chart looks great on desktop but labels overlap or become unreadable on 375px mobile screens. 7 axis labels competing for space around a small polygon.

**Why it happens:** SVG viewBox set for desktop dimensions. Labels positioned without considering mobile screen width.

**Prevention:**
- Use SVG `viewBox` for scalability (not fixed width/height)
- On mobile (<640px): increase chart padding, use abbreviated labels, or place labels below the chart instead of inline
- Test at 375px width specifically
- Consider: on mobile, show indicator scores as a vertical bar list instead of radar chart (simpler, more readable)

**Detection:** Test on 375px viewport. Check if all 7 labels are readable without overlap.

## Minor Pitfalls

### Pitfall 9: Micro-Revelation Timing Feels Wrong

**What goes wrong:** The 3-4 second micro-revelation display after each answer feels too long (user gets impatient) or too short (user can't read it).

**Prevention:** Make the timing configurable (not hardcoded). Start with 3 seconds. Add a "Continue" button that appears after 1.5 seconds so fast readers can skip ahead. Test with real users.

### Pitfall 10: OpenGraph Images Missing for Social Sharing

**What goes wrong:** When someone shares the diagnostic result or /principios page on WhatsApp/social media, no preview image appears. Just a text link.

**Prevention:** Generate OG images for each page. Astro has og:image support. At minimum: a branded 1200x630 image per page. For diagnostic results: consider a dynamic OG image (but this requires server-side generation -- deprioritize for v1).

### Pitfall 11: Cloudflare Pages Build Timeout

**What goes wrong:** The Astro build with image optimization (sharp) exceeds Cloudflare Pages' build timeout (20 minutes on free tier).

**Prevention:** Keep images optimized before commit (not just at build time). Use Astro's `<Image>` component with appropriate quality settings. Pre-optimize source images to reasonable dimensions before adding to `public/`.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project setup | Tailwind v3 config patterns | Use CSS-first @theme config only, no tailwind.config.js |
| Diagnostic implementation | Algorithm divergence from reference | Port with unit tests, compare outputs on same inputs |
| Diagnostic UX | State lost on navigation | sessionStorage backup, navigation guards |
| Radar chart | Not responsive on mobile | SVG viewBox, mobile-specific label layout |
| WhatsApp integration | URL encoding breaks | encodeURIComponent everything, test on real devices |
| Deployment | Build timeout | Pre-optimize images, keep build fast |
| View transitions | Island state reset | Accept or use transition:persist |
| Font loading | Layout shift | Preload critical fonts, size-adjust fallbacks |

## Sources

- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/) - transition:persist behavior
- [Tailwind CSS v4 Migration](https://tailwindcss.com/blog/tailwindcss-v4) - New configuration approach
- [WhatsApp Click to Chat](https://faq.whatsapp.com/5913398998672934) - URL format specification
- [Web.dev CLS Guide](https://web.dev/articles/cls) - Font loading best practices
- [Cloudflare Pages Build Limits](https://developers.cloudflare.com/pages/platform/limits/) - Build constraints
