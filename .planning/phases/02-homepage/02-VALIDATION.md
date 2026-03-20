---
phase: 2
slug: homepage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro dev server + browser inspection |
| **Config file** | astro.config.mjs (exists from Phase 1) |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build` + visual at 375px and 1440px |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build` + visual check all sections at 375px and 1440px
- **Before `/gsd:verify-work`:** Build green + visual verification of all HOME requirements
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | HOME-01 | smoke+visual | `pnpm build` | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | HOME-02, HOME-03 | smoke+visual | `pnpm build` | N/A | ⬜ pending |
| 02-01-03 | 01 | 1 | HOME-04 | smoke | `pnpm build` | Wave 0: principles.ts | ⬜ pending |
| 02-01-04 | 01 | 1 | HOME-05, HOME-06 | smoke+visual | `pnpm build` + grep wa.me in dist/ | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/principles.ts` — principle data file for rotating section
- [ ] `src/assets/images/drimian-logo.png` — logo copied from OneDrive source
- [ ] Logo optimized via Astro `<Image />` component

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero fills viewport with dark theme | HOME-01 | CSS rendering is visual | Open localhost, verify 100dvh dark hero with headline |
| Sections alternate dark/light correctly | HOME-02, HOME-03 | Visual contrast | Scroll through page, verify theme per section |
| WhatsApp floating button visible | HOME-06 | Position/z-index is visual | Scroll page, verify button stays bottom-right |
| Mobile 375px no overflow | ALL | Responsive is visual | DevTools 375px, check all sections |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
