# Phase 2: Homepage - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete static homepage with hero, informational sections, floating WhatsApp button, and footer. Does NOT include the diagnostic tool (Phase 3) or content pages (Phase 4). The hero CTA scrolls to the next section; the diagnostic will be inserted between hero and "What is Drimian" in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- Headline: "¿Estás construyendo lo que va a hacer próspera a tu empresa?" — exact copy from spec, no changes
- Subtitle: "10 preguntas. 3 minutos. Descubrí si estás empujando más fuerte — o cambiando lo que importa." — exact copy
- Primary CTA: "Empezar el diagnóstico" (filled orange button) — scrolls to next section for now; Phase 3 connects it to diagnostic overlay
- Secondary CTA: "O seguí leyendo ↓" — subtle text + arrow, scrolls to content below hero
- Background: clean dark navy (#131a37), NO isotipo/watermark, NO decorative elements
- Logo: Drimian-1 (full logo: isotipo + "drimian" + "Dream with Intelligence") centered in hero
- Full viewport height (100vh)

### Section Order (without diagnostic)
1. HERO (dark) — full viewport
2. QUÉ ES DRIMIAN (light) — "We Dream With Intelligence", 4 lines, sectors
3. MODELO (light-alt / gray) — "Piel en el juego", performance-based bonus, auto-exit
4. PRINCIPIO ROTATIVO (light) — 1 principle from Guía Drimian, monthly rotation
5. CTA FINAL (dark) — "Empecemos a conversar" + WhatsApp + email + address
6. FOOTER

Phase 3 will insert the diagnostic between Hero and "Qué es Drimian".

### WhatsApp Configuration
- Phone number: +59176600056
- Pre-built message: Claude's discretion — natural, conversational tone matching Drimian's voice
- Floating button: persistent bottom-right, green WhatsApp icon, visible on all pages (already decided in Phase 1)
- CTA Final section: WhatsApp button + contacto@drimian.com + "Santa Cruz, Bolivia · Latinoamérica"

### Logo Integration
- Hero: Drimian-1 full logo (isotipo + wordmark + tagline), centered above headline
- Nav: Drimian-1 full logo (smaller), left-aligned
- Footer: Claude's discretion (likely smaller version or just wordmark)
- Color on dark backgrounds: Claude's discretion — choose between white version or blue #0143a0 based on best contrast/aesthetics
- Logo source files: `C:/Users/Lenovo/OneDrive - theblankinc.com/Grupo Foianini/Drimina-logos/Drimian-1.png` and `Drimian-2.png`
- Logo must be optimized (WebP or optimized PNG) and copied to `public/images/`

### Content (all from spec documents)
- "Qué es Drimian" section: exact copy from Documento Maestro Section 4
- "Modelo" section: exact copy from Section 5 (Piel en el juego)
- "Principio rotativo": use Example month 1 from Section 6 as initial principle
- CTA Final: exact copy from Section 7
- Sector tags: Salud, Construcción, Hotelería, Seguros + "Si tu industria no está en la lista, hablemos igual"

### Claude's Discretion
- WhatsApp pre-built message text (natural, conversational)
- Logo color treatment on dark backgrounds (white vs blue #0143a0)
- Footer logo variant and size
- Exact scroll behavior (smooth scroll, offset for nav height)
- How to display sector tags (inline text, pills/badges, etc.)
- Rotating principle implementation (static for now, rotation mechanism)

</decisions>

<specifics>
## Specific Ideas

- All copy comes directly from the spec documents — no invented content
- "Empecemos a conversar" is the closing tone — inviting, not selling
- The hero should feel like a question, not a pitch. The user is being invited to reflect, not buy.
- Sector tags should feel inclusive: "if your industry isn't listed, let's talk anyway"
- The rotating principle can be static for v1 (hardcoded month 1 example), with rotation mechanism added later

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Section.astro**: Already supports `theme="dark" | "light" | "light-alt"` and `wide` prop — use directly for all homepage sections
- **Button.astro**: Primary (filled orange) and secondary (outlined) variants — use for hero CTAs
- **Card.astro**: Subtle border, theme-adaptive — may use for sector tags or model section
- **Footer.astro**: Already exists with dark theme — extend with WhatsApp + contact info
- **Nav.astro**: Scroll-triggered, has logo placeholder (`/images/logo-white.png`) — needs actual logo file
- **Base.astro**: Layout with font preloading — all pages extend this

### Established Patterns
- `data-theme` attribute on Section components for dark/light switching
- Tailwind CSS v4 with `@theme` tokens in global.css
- Astro static components (no JS unless needed)

### Integration Points
- `src/pages/index.astro` — replace demo content with actual homepage sections
- `public/images/` — needs logo files (Drimian-1 optimized for web)
- Nav.astro — update logo path from placeholder to actual file
- Footer.astro — extend with WhatsApp link, email, address

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-homepage*
*Context gathered: 2026-03-20*
