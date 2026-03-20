# Feature Landscape

**Domain:** Interactive consulting website with diagnostic tool
**Researched:** 2026-03-20

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mobile-responsive design | 70%+ of Bolivian web traffic is mobile | Low | Tailwind mobile-first handles this. 375px baseline. |
| Fast page load (<3s on 3G) | Bolivia has variable internet speeds. Slow = bounce. | Low | Astro static + <350KB budget achieves this. |
| WhatsApp CTA (floating + contextual) | Primary communication channel in Bolivia. Forms convert poorly. | Low | `wa.me/` link with pre-built message. No API needed. |
| Clear value proposition above fold | Consulting sites must answer "why you?" in 5 seconds | Low | Hero section with provocative headline + CTA. |
| SEO basics (meta, OG, sitemap) | Google is how Bolivian business owners find consultants | Low | Astro generates this. @astrojs/sitemap auto-generates XML. |
| Multi-page navigation | /principios and /resultados need distinct URLs for sharing/SEO | Low | Astro file-based routing. Each page = an .astro file. |
| Contact information | Credibility signal. Visitors need to know how to reach the firm. | Low | Footer with WhatsApp, email, Santa Cruz address. |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive prosperity diagnostic | THE core differentiator. No competitor has an interactive assessment tool. Demonstrates methodology through experience rather than claims. | High | 10 fullscreen questions, scoring algorithm, radar chart, leverage points. This is 80% of the site's value. |
| Micro-revelations between questions | Transforms a boring survey into an insight experience. Each answer triggers a 3-4 second insight that makes the user think "they understand my problem." | Medium | Timed display after each answer. Content already written. |
| 7-axis radar chart (heptagon) | Visual proof of diagnostic depth. A radar chart communicates "systematic analysis" better than a score number. | Medium | Custom SVG. 7 prosperity indicators normalized 0-100%. |
| Personalized leverage points | Goes beyond "here's your score" to "here's what to fix first." Actionable output increases WhatsApp conversion. | Medium | Algorithm: mechanisms scored 1-2, ranked by total weight across indicators. Top 2-3 become recommendations. |
| Profile-based narrative | Four distinct profiles (Ausentes/Parciales/Construccion/Solidos) with indicator-specific variants. Feels personal, not generic. | Medium | Dynamic text selection based on profile range + 2 weakest indicators. |
| WhatsApp CTA with pre-built context | The diagnostic result flows into the WhatsApp message. Sales team receives: profile, score, leverage points -- conversation starts warm. | Low | URL-encode diagnostic results into wa.me link parameters. |
| Hybrid dark/light theme | Dark immersive diagnostic sections create "app-like" focus. Light content sections feel professional and readable. | Medium | CSS custom properties toggled by section, not user preference. |
| Anonymized case studies with metrics | Real numbers (anonymized) build credibility without naming clients (Bolivia market sensitivity). | Low | Static content pages. 4 cases already written. |
| Thought leadership (10 principles) | Positions Drimian as having a framework, not just opinions. SEO content for organic discovery. | Low | Static content. Already written in Guia Drimian. |
| View transitions between pages | App-like feel without SPA complexity. Pages morph smoothly instead of hard-loading. | Low | Astro View Transitions -- 2 lines of code. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Blog | Unless committed to 1 post/month minimum. Stale blog = worse than no blog. (Jefe's explicit guidance.) | Rotating principle section (monthly) from Guia Drimian content. |
| Services page with prices | Positions as commodity. Competitors can undercut. (Benchmarking finding.) | Diagnostic demonstrates methodology. "Skin in the game" section shows performance-based model. |
| Client testimonials | Generates suspicion in Bolivia market. Perceived as fake or paid. | Anonymized case studies with real metrics instead. |
| Client logos | In Bolivia, clients don't want to be seen using consultants. | Case studies without identifying information. |
| Slider/carousel | Slow loading, nobody sees slide 3. Poor mobile UX. | Static hero with single strong headline. |
| Stock photos | Generic, undermines credibility. | Only logo, isotipo, and real illustrations. |
| Contact form as primary CTA | Low conversion in Bolivia. People prefer WhatsApp. | WhatsApp button as primary. Optional email capture post-diagnostic only. |
| Backend/database | Adds complexity, hosting cost, maintenance. Not needed. | All diagnostic computation client-side in Preact island. |
| User accounts/login | No user management needed. Diagnostic is anonymous. | Results are ephemeral. WhatsApp captures the lead. |
| CMS | Content changes are infrequent. Code-managed is simpler. | Update content in TypeScript data files, deploy via git push. |
| Dark mode toggle | This is not a dark-mode-preference site. The hybrid theme is by section (dark=immersive, light=content), not user choice. | CSS sections with explicit theme classes. |

## Feature Dependencies

```
Hero Section (homepage) -----> Diagnostic Entry Point
                                    |
                                    v
Diagnostic Questions (10) -----> Scoring Algorithm
                                    |
                                    v
                          Radar Chart + Leverage Points
                                    |
                                    v
                          Profile Narrative + WhatsApp CTA
                                    |
                                    v
                          Optional Email Capture

/principios page -----> No dependencies (static content)
/resultados page -----> No dependencies (static content)

View Transitions -----> Requires all pages to share a Layout
Hybrid Theme -----> Requires section-level CSS architecture
```

## MVP Recommendation

**Phase 1 -- Prioritize (the diagnostic IS the product):**
1. Homepage hero + diagnostic entry point
2. Full diagnostic experience (10 questions + micro-revelations)
3. Scoring algorithm + radar chart + leverage points
4. WhatsApp CTA with pre-built context
5. Mobile-responsive, fast loading

**Phase 2 -- Complete the site:**
6. /principios page (10 principles)
7. /resultados page (case studies)
8. View transitions between pages
9. SEO optimization (meta, OG, sitemap)
10. Optional email capture post-diagnostic

**Defer:**
- Blog: Until there is a content commitment
- Analytics beyond Cloudflare built-in: Until there is traffic to analyze
- i18n (English version): Until there is international demand

## Sources

- PROJECT.md requirements analysis
- [Astro Islands for Interactive Components](https://docs.astro.build/en/concepts/islands/)
- Bolivia market context from project specification
