---
phase: 1
slug: foundation-design-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None -- Phase 1 is static HTML/CSS, no logic to test |
| **Config file** | None -- Wave 0 installs Astro |
| **Quick run command** | `pnpm astro check` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm astro check && pnpm build`
- **After every plan wave:** Run `pnpm build` + manual visual check at 375px and 1280px
- **Before `/gsd:verify-work`:** Build green + visual review of all sections at both breakpoints
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUN-01 | smoke | `pnpm build` exits 0 | N/A Wave 0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUN-05 | smoke | `pnpm build` + grep CSS for hex values | N/A Wave 0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUN-02 | manual-only | Visual at 375px viewport | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUN-03 | manual-only | Visual dark/light sections | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | FOUN-04 | manual-only | DevTools > Network > woff2 | N/A | ⬜ pending |
| 01-02-04 | 02 | 1 | FOUN-06 | smoke | `pnpm build` pages in dist/ | N/A | ⬜ pending |
| 01-02-05 | 02 | 1 | FOUN-07 | manual-only | DevTools computed styles | N/A | ⬜ pending |
| 01-02-06 | 02 | 1 | FOUN-08 | smoke | `ls -la dist/` sum < 100KB | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm create astro@latest` — project does not exist yet
- [ ] No test framework needed — design system verified visually + build success

*Playwright visual regression deferred to Phase 5.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout at 375px | FOUN-02 | CSS rendering is visual | Open DevTools, set viewport to 375px, check all sections |
| Dark/light section contrast | FOUN-03 | Color rendering is visual | Scroll through page, verify dark/light sections distinct |
| Font loading | FOUN-04 | Font rendering is visual | DevTools Network tab, filter woff2, verify files load |
| Section spacing | FOUN-07 | Spacing is visual | DevTools computed styles, verify 80-120px desktop, 48-64px mobile |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
