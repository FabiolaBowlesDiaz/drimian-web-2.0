# Phase 4: Content Pages - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Two static content pages: /principios (10 principles from Guía Drimian) and /resultados (4 anonymized case studies). Both share base layout with nav and footer. No new interactive features.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion (Full)
User deferred all layout decisions to Claude. Use existing design system (Section, Card, Button, Nav, Footer components) and make pages consistent with homepage look & feel.

Guidance:
- /principios: 10 principles already exist in src/data/principles.ts (title + body). Display as readable short articles.
- /resultados: 4 case studies from reference repo (Documento Maestro). Display with industry tags, real metrics, and context.
- Both pages share Base.astro layout (Nav + Footer + WhatsAppFloat)
- Light theme for content pages (consistent with homepage content sections)
- Mobile-first, same typography and spacing as homepage
- All Spanish text with proper accents

</decisions>

<specifics>
## Specific Ideas

- No specific layout requirements — open to standard approaches consistent with existing design system
- The "Principios" link in Nav already points to /principios
- Content for case studies comes from _reference_repo/WEB DRIMIAN - Documento Maestro.md (Section 4 area — 4 cases: clinic, insurance, construction, hotel)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Section.astro**: theme="light" and theme="light-alt" for content sections
- **Card.astro**: subtle border, theme-adaptive — ideal for case studies or principle cards
- **Base.astro**: layout with font preloading, meta tags slot
- **Nav.astro**: already has "Principios" link (currently #principios, needs update to /principios)
- **Footer.astro**: full footer with WhatsApp + contact
- **WhatsAppFloat.astro**: persistent floating button
- **src/data/principles.ts**: 10 principles with id, month, title, body — direct data source

### Established Patterns
- Astro file-based routing: src/pages/principios.astro → /principios
- data-theme sections for visual rhythm
- Tailwind CSS v4 with @theme tokens

### Integration Points
- Nav.astro: update "Principios" href from "#principios" to "/principios"
- Nav.astro: may need "Resultados" link added
- src/pages/: new .astro files for each page

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-content-pages*
*Context gathered: 2026-03-22*
