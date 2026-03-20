# Phase 1: Foundation + Design System - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro 5 project scaffold with brand theme (colors, typography, spacing), responsive layout components, and hybrid dark/light section architecture. Delivers a working development environment and design system — no content or features yet.

</domain>

<decisions>
## Implementation Decisions

### Typography
- Headlines: Claude's discretion — choose a serif font that is elegant yet simple, harmonious with the Drimian logo (geometric, modern blue). Direction: "elegante pero sencillo, que toda la pagina tenga armonia"
- Body font: Claude's discretion — same direction: elegant, simple, harmonious with headline font and logo
- Headline weight: Bold/semibold (600-700). Strong, confident, impactful — Bain/BCG feel
- Headline scale: Dramatic — hero 72px+ on desktop, 38px on mobile. Large enough to command attention
- Letter spacing: tight (-0.02em) for headers, consistent with the logo's geometric feel

### Navigation
- Hero has NO nav bar — only logo centered. Clean, immersive first impression
- Nav appears on scroll down (slides in from top), hidden when user is at the top
- Nav links: Logo (left) + "Principios" link + "Empezar diagnostico" CTA button (orange)
- Mobile: hamburger menu (standard)
- Nav background color: Claude's discretion — adapt to what looks best with the section underneath (dark nav on dark sections, light on light, or glassmorphism)

### Theme Transitions
- Dark to light: Hard cut — clean, no gradient, no angled divider. Minimal.
- Light sections alternate: white (#FFFFFF) and gray (#F5F5F5) for visual rhythm
- Diagnostic overlay: Full overlay — takes complete control of viewport, dark navy background, page disappears. Immersive "app within a page" experience.

### Layout & Visual Personality
- Overall personality: Confident + minimal. Lots of whitespace. Few elements, each with weight. "No necesitamos convencerte" energy
- Animations: Almost none. Fade-in on scroll only. No elaborate hover effects, no moving elements. Content speaks, not motion
- Cards: Subtle border (1px light gray), no shadow. Clean, defined edges
- Buttons: Two levels — Primary: filled orange (#FF6600) with white text. Secondary: outlined or text with arrow. Follows benchmarking's gradient-of-commitment pattern
- No decorative elements, no illustrations beyond the isotipo

### Claude's Discretion
- Specific serif headline font selection (direction: elegant + simple + harmonious with Drimian logo)
- Specific body font selection (direction: elegant + simple + harmony across page)
- Nav background color/behavior on scroll (adapt to section context)
- Loading skeleton design
- Exact border-radius values (lean towards subtle, not too rounded)
- CSS variable naming convention

</decisions>

<specifics>
## Specific Ideas

- "Que se vea clean y a la vez sofisticada" — the guiding aesthetic
- "Que toda la pagina tenga armonia" — typography must feel unified, not mismatched
- The Drimian logo is geometric (abstract star/portal shape) in deep navy with "Dream with Intelligence" tagline in gray — fonts should complement this geometric, modern feel
- Brand colors are blues + one orange accent. Orange is ONLY for CTAs and action items — not decoration
- The benchmarking doc notes BCG uses green lime as a bold differentiator; for Drimian, the blue-to-orange accent serves this role

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. Everything built from scratch.

### Established Patterns
- None yet — this phase ESTABLISHES the patterns all other phases will follow
- Reference repo (`_reference_repo/`) has CSS variables and color definitions that can inform the theme setup

### Integration Points
- This phase creates the layout components that Phase 2 (Homepage) will fill with content
- The hybrid dark/light theme architecture must support Phase 3's full-overlay diagnostic
- The spacing system and typography scale will be used by all subsequent phases

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-03-20*
