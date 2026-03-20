# Research Summary: Drimian Web 2.0

**Domain:** Interactive consulting website with embedded diagnostic tool
**Researched:** 2026-03-20
**Overall confidence:** HIGH

## Executive Summary

Drimian Web 2.0 is a well-scoped project in a well-understood domain. The site is 90% static content (consulting firm homepage, principles, case studies) with one high-value interactive feature (the prosperity diagnostic tool). This pattern -- static shell with isolated interactive components -- is precisely what Astro's islands architecture was designed for. The technology choices are clear, the architecture is straightforward, and the main risks are in UX details rather than technical feasibility.

The recommended stack is **Astro 5 + Preact + Tailwind CSS 4**, deployed as a fully static site to **Cloudflare Pages**. This combination ships zero JavaScript for content pages and ~25KB of JS only for the diagnostic island. Total page weight target is <350KB -- well under the 1MB constraint. Cloudflare's acquisition of Astro in January 2026 makes this pairing especially well-supported.

The diagnostic tool is the project's center of gravity. It accounts for 80% of the site's value and 80% of the implementation complexity. The scoring algorithm (10 questions, weighted mapping to 7 indicators, profile classification, leverage point ranking) is already validated in a reference vanilla JS implementation. The primary risk is diverging from the reference algorithm during the port to Preact, which is mitigated by unit tests with fixture data.

The Bolivia market context drives several key decisions: WhatsApp as primary CTA (not forms), mobile-first design (375px baseline), aggressive performance optimization (variable internet speeds), anonymized case studies (clients avoid being seen using consultants), and no testimonials (generates suspicion in the local market).

## Key Findings

**Stack:** Astro 5 (static) + Preact (3KB islands) + Tailwind CSS 4 + Custom SVG radar chart + Cloudflare Pages. Zero unnecessary dependencies.

**Architecture:** Static Shell + Interactive Islands. Only 3 components need JS: diagnostic tool, radar chart animation, optional email form. Everything else is pre-rendered HTML/CSS.

**Critical pitfall:** Scoring algorithm divergence from the reference implementation. Must port with unit tests and fixture-based validation.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation + Design System** - Project scaffolding, Astro config, Tailwind theme with brand colors, layout components, font loading, hybrid dark/light theme architecture.
   - Addresses: Mobile-responsive base, theme transitions, typography
   - Avoids: Tailwind v3/v4 confusion pitfall by setting up CSS-first config correctly from start

2. **Homepage Static Sections** - Hero, "What is Drimian", "Skin in the game", rotating principle, final CTA, floating WhatsApp button.
   - Addresses: Table stakes (value prop above fold, contact info, WhatsApp CTA)
   - Avoids: Scope creep into interactive features before static shell is solid

3. **Diagnostic Tool (Core)** - 10 fullscreen questions, micro-revelations, scoring algorithm, radar chart, leverage points, profile narrative, WhatsApp CTA with context.
   - Addresses: THE differentiator (80% of site value)
   - Avoids: Algorithm divergence (unit tests), state loss (sessionStorage backup), WhatsApp encoding (device testing)

4. **Content Pages + Polish** - /principios, /resultados, View Transitions, SEO (meta, OG, sitemap), optional email capture, performance audit.
   - Addresses: Thought leadership, credibility, discoverability
   - Avoids: Font CLS (preloading), radar chart mobile responsiveness (375px testing)

5. **Deployment + Launch** - Cloudflare Pages setup, git integration, domain config, final device testing.
   - Addresses: Going live
   - Avoids: Build timeout (pre-optimized images)

**Phase ordering rationale:**
- Foundation first because theme architecture (dark/light) affects every subsequent component
- Static sections before diagnostic because they establish layout patterns the diagnostic inherits
- Diagnostic is the largest single feature -- gets its own phase with focused attention
- Content pages are independent of diagnostic -- can be parallelized or done after
- Deployment last because static sites have trivial deployment -- no infrastructure to debug

**Research flags for phases:**
- Phase 3 (Diagnostic): Needs careful porting from reference repo. The scoring algorithm, question content, and profile narratives must match exactly. Consider a phase-specific research spike to extract and verify the reference implementation before building.
- Phase 1 (Foundation): Standard patterns, unlikely to need research. Tailwind v4 CSS-first config is the only thing that might trip up developers used to v3.
- Phase 4 (Content): Standard patterns, no research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Astro + Preact is a well-documented, production-proven pattern. Cloudflare acquisition adds stability. Tailwind v4 is mature (released Jan 2025). |
| Features | HIGH | Requirements are explicit in PROJECT.md. Content is pre-written. Algorithm is specified. Anti-features are clearly defined. |
| Architecture | HIGH | Islands architecture for static sites with isolated interactivity is Astro's primary use case. No novel patterns needed. |
| Pitfalls | MEDIUM | Most pitfalls are UX-related (responsive radar chart, WhatsApp encoding, diagnostic state). These are known problems with known solutions but require testing on real devices. |

## Gaps to Address

- **Font selection**: Specific serif headline font needs to be chosen during design phase. Playfair Display is a suggestion, not a confirmed choice.
- **Reference repo algorithm extraction**: The exact scoring weights, profile boundaries, and narrative variants need to be extracted from `github.com/VITALIASALUD/drimian-web` and verified before implementation.
- **Scroll-driven animations browser support**: `animation-timeline: view()` has ~75% browser support. Need to verify it works on the specific Android browsers common in Bolivia. Fallback: simple IntersectionObserver (~5 lines of JS).
- **Cloudflare Pages vs Workers**: For this purely static site, Pages is sufficient. But if future features require server-side logic (e.g., dynamic OG images for diagnostic results), migration to Workers would be needed. The Astro Cloudflare adapter has shifted focus to Workers.
