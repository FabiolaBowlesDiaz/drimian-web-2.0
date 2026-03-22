---
phase: 3
slug: diagnostic-tool
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (Vite-native, needs install) |
| **Config file** | `vitest.config.ts` (Wave 0) |
| **Quick run command** | `pnpm vitest run tests/scoring.test.ts` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run tests/scoring.test.ts`
- **After every plan wave:** Run `pnpm vitest run` + visual check of diagnostic flow
- **Before `/gsd:verify-work`:** Full suite green + end-to-end manual walkthrough
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | SCOR-01..07 | unit | `pnpm vitest run tests/scoring.test.ts` | Wave 0 | ⬜ pending |
| 03-02-01 | 02 | 2 | DIAG-01..05 | manual+smoke | `pnpm build` | N/A | ⬜ pending |
| 03-02-02 | 02 | 2 | DIAG-06,07 | manual | Browser back + refresh test | N/A | ⬜ pending |
| 03-03-01 | 03 | 3 | RESU-01..03 | manual+smoke | `pnpm build` | N/A | ⬜ pending |
| 03-03-02 | 03 | 3 | RESU-04,05 | unit | `pnpm vitest run -t "palancas|narrative"` | Wave 0 | ⬜ pending |
| 03-03-03 | 03 | 3 | RESU-06 | unit | `pnpm vitest run -t "whatsapp"` | Wave 0 | ⬜ pending |
| 03-03-04 | 03 | 3 | RESU-07 | manual | Visual check email form | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add -D vitest` — install test framework
- [ ] `vitest.config.ts` — Vitest config with Astro's getViteConfig
- [ ] `package.json` — add `"test": "vitest run"` script
- [ ] `tests/scoring.test.ts` — test stubs for SCOR-01..07, RESU-04..06
- [ ] `src/data/scoring.ts` — pure TypeScript scoring module (zero DOM)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 10 fullscreen questions rendered | DIAG-01 | CSS layout is visual | Open diagnostic, verify each question fills viewport |
| Option selection feedback | DIAG-02 | Visual interaction | Click option, verify highlight/border change |
| Progress "N/10" display | DIAG-03 | Visual placement | Check corner shows "1/10" through "10/10" |
| Micro-revelation timing | DIAG-04 | Timing is perceptual | Select answer, verify revelation appears, wait 2s+ or tap |
| Crossfade transitions | DIAG-05 | Animation is visual | Navigate between questions, verify smooth fade |
| Browser back navigation | DIAG-06 | Browser interaction | Complete 3 questions, press browser back, verify Q2 shows |
| State survives refresh | DIAG-07 | Browser interaction | Mid-diagnostic, refresh page, verify state restored |
| Radar chart renders | RESU-02 | SVG rendering visual | Complete diagnostic, verify 7-axis heptagon |
| Color-coded bars | RESU-03 | Color is visual | Check bars show red/orange/yellow/green by percentage |
| Email capture form | RESU-07 | Form rendering visual | Verify expandable form below WhatsApp CTA |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 3s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
