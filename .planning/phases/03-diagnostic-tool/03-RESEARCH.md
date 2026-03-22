# Phase 3: Diagnostic Tool - Research

**Researched:** 2026-03-22
**Domain:** Interactive Preact island in Astro -- fullscreen diagnostic overlay with scoring algorithm, SVG radar chart, and WhatsApp CTA
**Confidence:** HIGH

## Summary

Phase 3 is the core value of the entire site: a 10-question diagnostic tool that runs as a fullscreen overlay, calculates prosperity indicators via a two-layer scoring algorithm, renders an animated SVG radar chart, and generates a WhatsApp CTA with pre-built results. The reference implementation exists in vanilla JS (`_reference_repo/js/diagnostic.js`) and must be ported to typed TypeScript with unit tests.

The architecture is well-defined: one Preact island component mounted in `index.astro` that takes over the viewport as a fixed overlay when triggered from the Hero CTA. All scoring logic lives in pure TypeScript files with zero DOM dependencies (enabling unit testing). The radar chart is custom SVG (~50 lines of trigonometry), not a charting library. State management uses Preact's `useReducer` -- no external state library needed for a 3-minute user session.

**Primary recommendation:** Structure as three layers -- (1) pure TypeScript scoring module with unit tests, (2) typed data files for questions/profiles/narratives, (3) Preact island UI component that orchestrates the diagnostic flow as a fixed-position overlay.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Transition between questions: **Fade crossfade** -- current question fades out, next fades in
- Micro-revelations: **2 seconds minimum display + tap to continue**
- Navigation: **Back button visible in UI + browser back** (History API integration)
- Progress indicator: **Number only** -- "3/10" displayed discretely
- Results reveal: **Progressive** -- profile badge + score, then radar animates, then leverage points, then WhatsApp CTA (scroll-triggered)
- Radar chart: **Animated** -- heptagon draws progressively when entering viewport
- Theme: **Dark (continuity)** -- results stay in dark navy, same as diagnostic questions
- Content order: **Narrative first, then data** -- profile badge -> narrative -> radar chart -> indicator bars -> leverage points -> WhatsApp CTA
- Entry: **Overlay instant** -- click CTA -> dark overlay appears immediately (~200ms fade-in). NOT a separate page/route
- Exit mid-diagnostic: **X button, no confirmation** -- visible X in corner closes overlay
- Resume: **No resume, starts fresh** -- each time user clicks "Empezar" it starts from question 1
- Post-results: **"Volver al inicio" button** at bottom of results
- WhatsApp message format: profile name + score + top 2-3 leverage points (concise resumen)

### Claude's Discretion
- Exact fade crossfade timing and easing curves
- X button position and styling (top-right corner assumed)
- Radar chart animation timing and easing
- Progressive reveal scroll trigger thresholds
- Indicator bars color coding (red/orange/yellow/green thresholds)
- Email capture form design (expandable, minimal)
- How the overlay interacts with the nav (nav should be hidden during diagnostic)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DIAG-01 | 10 fullscreen immersive questions, one at a time | Preact island overlay pattern, fixed position viewport fill |
| DIAG-02 | 4 selectable options per question with visual feedback | Preact state management, CSS transition on selection |
| DIAG-03 | Progress bar ("1/10, 2/10..." format) | Simple computed value from state, "3/10" number-only per user decision |
| DIAG-04 | Micro-revelation after each answer (3-4 sec, dismissible) | Timer + tap handler in Preact, 2s min per user decision |
| DIAG-05 | Smooth transitions between questions | CSS opacity/transform transitions with crossfade pattern |
| DIAG-06 | Browser back button navigates to previous question | History API pushState/popstate integration |
| DIAG-07 | Diagnostic state persisted in sessionStorage | sessionStorage serialize/deserialize on state changes |
| SCOR-01 | Scoring: a)=1, b)=2, c)=3, d)=4 per question, total 10-40 | Direct port from reference diagnostic.js |
| SCOR-02 | Profile classification (4 ranges) | Direct port: Ausentes 10-17, Parciales 18-25, Construccion 26-33, Solidos 34-40 |
| SCOR-03 | 7 prosperity indicators as weighted averages (1.0/0.6/0.3) | INDICATOR_WEIGHTS matrix from reference, verified against Mecanica doc |
| SCOR-04 | Indicator normalization to 0-100% | Formula: ((avg - 1) / 3) * 100, Math.round |
| SCOR-05 | Leverage points: mechanisms scored 1-2, ranked by total weight | getTopPalancas algorithm from reference |
| SCOR-06 | Scoring module as pure TypeScript, zero DOM dependencies | Separate src/data/scoring.ts with exported functions |
| SCOR-07 | Unit tests validating scoring against reference fixtures | Vitest with fixture data from Mecanica doc example |
| RESU-01 | Profile badge with name, score, 2-line description | Preact component using profile classification data |
| RESU-02 | 7-axis radar chart (heptagon SVG) | Custom SVG with animated polygon, 7 axes at 51.43deg intervals |
| RESU-03 | Color-coded indicator bars | CSS transitions with thresholds: red 0-25%, orange 26-50%, yellow 51-75%, green 76-100% |
| RESU-04 | Top 2-3 leverage points with impacted indicators | Leverage point algorithm + PALANCA_DESCRIPTIONS data |
| RESU-05 | Dynamic narrative by profile + 2 weakest indicators | getNarrative function port with all narrative variants |
| RESU-06 | WhatsApp CTA with pre-built message | wa.me URL with encodeURIComponent message |
| RESU-07 | Optional email capture (expandable, post-result) | Simple Preact form, no backend, mailto: or Cloudflare Worker |

</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Preact | 10.29.x | Interactive island runtime | Already in package.json. 3KB gzipped. Same JSX API as React. |
| @astrojs/preact | 5.x | Astro integration for Preact islands | Already installed. Enables `client:` directives. |
| TypeScript | 5.9.x | Type safety for scoring algorithm + data | Already in devDependencies. |
| Tailwind CSS | 4.2.x | Styling for diagnostic UI | Already installed. Uses existing design tokens from global.css. |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | latest | Unit testing for scoring module | SCOR-07 requires unit tests. Vitest is Vite-native, works with Astro's getViteConfig(). |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useReducer | @preact/signals | Signals add ~1KB and are overkill for a single component's local state that lasts 3 minutes |
| Custom SVG radar | Chart.js | 30-67KB for one chart. Canvas-based (blurry on retina). Already decided against in STACK.md |
| Vitest | Jest | Jest requires more config with ESM/Astro. Vitest is Vite-native and integrates with getViteConfig() |

**Installation:**
```bash
pnpm add -D vitest
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  data/
    types.ts            # Shared TypeScript interfaces (Question, Indicator, Profile, etc.)
    questions.ts        # 10 questions + options + micro-revelations (content)
    scoring.ts          # Pure scoring functions: calculateIndicators, getProfile, getTopPalancas, getNarrative
    profiles.ts         # Profile descriptions, weakness/strength phrases, mechanism phrases
    principles.ts       # (existing)
  islands/
    Diagnostic.tsx      # Main Preact island: overlay + question flow + results display
  components/
    Hero.astro          # (existing) -- CTA triggers diagnostic overlay
    ... (existing)
  pages/
    index.astro         # (existing) -- imports Diagnostic island
tests/
  scoring.test.ts       # Unit tests for scoring module
vitest.config.ts        # Vitest configuration
```

### Pattern 1: Fixed Overlay Island (Diagnostic Entry)

**What:** The Diagnostic Preact island renders as a fixed-position overlay that covers the entire viewport. It is mounted in `index.astro` but initially hidden. The Hero CTA dispatches a custom event that the island listens for to show itself.

**When to use:** When an interactive Preact island needs to take over the full viewport from an Astro-rendered page.

**Example:**
```typescript
// src/islands/Diagnostic.tsx
import { useState, useEffect } from 'preact/hooks';

export default function Diagnostic() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for custom event from Hero CTA
    const handler = () => setIsOpen(true);
    document.addEventListener('open-diagnostic', handler);
    return () => document.removeEventListener('open-diagnostic', handler);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      class="fixed inset-0 z-50 bg-[var(--color-bg-dark)] overflow-y-auto"
      style={{ animation: 'fadeIn 200ms ease' }}
    >
      {/* Diagnostic content */}
    </div>
  );
}
```

```astro
<!-- In index.astro -->
<Diagnostic client:idle />

<!-- In Hero.astro, the CTA becomes: -->
<button onclick="document.dispatchEvent(new CustomEvent('open-diagnostic'))">
  Empezar el diagnostico
</button>
```

**Why `client:idle` not `client:load`:** The diagnostic is triggered by user click, not needed immediately. `client:idle` hydrates after initial page load completes, keeping the page fast while ensuring the component is ready before the user scrolls down and decides to click.

**Why NOT `client:only`:** We want the component in the DOM for SEO (even though it renders nothing until opened). `client:only` skips SSR entirely, which is fine but `client:idle` is sufficient and maintains the SSR pipeline.

### Pattern 2: State Machine with useReducer

**What:** The diagnostic has distinct phases (idle -> questioning -> revelation -> results). A reducer manages all state transitions cleanly.

**When to use:** When component state has multiple interrelated fields and clear transitions.

**Example:**
```typescript
type Phase = 'idle' | 'question' | 'revelation' | 'results';

interface DiagnosticState {
  phase: Phase;
  currentQuestion: number;
  answers: (number | null)[];
  showRevelation: boolean;
}

type Action =
  | { type: 'OPEN' }
  | { type: 'ANSWER'; questionIndex: number; value: 1 | 2 | 3 | 4 }
  | { type: 'DISMISS_REVELATION' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GO_BACK' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'CLOSE' }
  | { type: 'RESET' };

function diagnosticReducer(state: DiagnosticState, action: Action): DiagnosticState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, phase: 'question', currentQuestion: 0, answers: new Array(10).fill(null) };
    case 'ANSWER':
      const newAnswers = [...state.answers];
      newAnswers[action.questionIndex] = action.value;
      return { ...state, answers: newAnswers, phase: 'revelation' };
    case 'DISMISS_REVELATION':
      return state.currentQuestion < 9
        ? { ...state, phase: 'question', currentQuestion: state.currentQuestion + 1 }
        : { ...state, phase: 'results' };
    case 'GO_BACK':
      if (state.currentQuestion > 0) {
        return { ...state, phase: 'question', currentQuestion: state.currentQuestion - 1 };
      }
      return state;
    case 'CLOSE':
      return { ...state, phase: 'idle' };
    case 'RESET':
      return { ...state, phase: 'question', currentQuestion: 0, answers: new Array(10).fill(null) };
    default:
      return state;
  }
}
```

### Pattern 3: Pure Scoring Module (Zero DOM Dependencies)

**What:** All scoring logic is in `src/data/scoring.ts` as pure functions that take answers array and return computed values. No DOM, no Preact, no side effects.

**When to use:** Always for the scoring algorithm. Enables unit testing with Vitest without DOM setup.

**Example:**
```typescript
// src/data/scoring.ts
import type { IndicatorScores, Profile, LeveragePoint } from './types';
import { INDICATOR_WEIGHTS, INDICATOR_LABELS, PALANCA_DESCRIPTIONS } from './questions';

export function calculateTotal(answers: number[]): number {
  return answers.reduce((sum, a) => sum + a, 0);
}

export function getProfile(total: number): Profile {
  if (total <= 17) return { name: 'CIMIENTOS AUSENTES', class: 'absent', range: [10, 17] };
  if (total <= 25) return { name: 'CIMIENTOS PARCIALES', class: 'partial', range: [18, 25] };
  if (total <= 33) return { name: 'CIMIENTOS EN CONSTRUCCION', class: 'building', range: [26, 33] };
  return { name: 'CIMIENTOS SOLIDOS', class: 'solid', range: [34, 40] };
}

export function calculateIndicatorScores(answers: number[]): IndicatorScores {
  const scores: Record<string, number> = {};
  for (const indicator of INDICATOR_LABELS) {
    const weights = INDICATOR_WEIGHTS[indicator];
    let sumWeighted = 0;
    let sumWeights = 0;
    for (const { q, w } of weights) {
      sumWeighted += (answers[q] || 1) * w;
      sumWeights += w;
    }
    const avg = sumWeighted / sumWeights;
    scores[indicator] = Math.round(((avg - 1) / 3) * 100);
  }
  return scores as IndicatorScores;
}

export function getTopPalancas(answers: number[]): LeveragePoint[] {
  // Only questions where user scored 1-2 (weak mechanisms)
  const palancas: LeveragePoint[] = [];
  for (let i = 0; i < 10; i++) {
    if (answers[i] <= 2) {
      let totalWeight = 0;
      const indicators: string[] = [];
      // ... calculate from Q_TO_INDICATORS mapping
      palancas.push({ qIndex: i, score: answers[i], totalWeight, indicators, ...PALANCA_DESCRIPTIONS[i] });
    }
  }
  palancas.sort((a, b) => b.totalWeight - a.totalWeight);
  return palancas.slice(0, 3);
}
```

### Pattern 4: History API for Question Navigation

**What:** Each question push a history state entry. Browser back button triggers popstate, which dispatches GO_BACK action.

**Example:**
```typescript
// Inside Diagnostic component
useEffect(() => {
  const handlePopState = (e: PopStateEvent) => {
    if (e.state?.diagnosticQuestion !== undefined) {
      dispatch({ type: 'GO_BACK' });
    } else {
      // User backed out of diagnostic entirely
      dispatch({ type: 'CLOSE' });
    }
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);

// When advancing to next question:
function advanceQuestion() {
  history.pushState(
    { diagnosticQuestion: state.currentQuestion + 1 },
    '',
    window.location.pathname  // Don't change URL
  );
  dispatch({ type: 'NEXT_QUESTION' });
}
```

**Key detail:** `pushState` does NOT change the URL -- we pass the current pathname. The state object carries the question index. When user presses browser back, `popstate` fires with the previous state.

### Pattern 5: SVG Heptagon Radar Chart (Animated)

**What:** Custom SVG component that draws a 7-axis radar chart using basic trigonometry. Animation uses CSS transitions on SVG polygon points or requestAnimationFrame to interpolate from center to final positions.

**Math:**
- 7 axes at `360/7 = ~51.43 degrees` apart
- Starting angle: `-90 degrees` (top of circle = first axis)
- For each axis i: `angle = (2 * PI * i / 7) - PI/2`
- Point at: `x = cx + (score/100 * radius) * cos(angle)`, `y = cy + (score/100 * radius) * sin(angle)`

**Animation approach:** Render SVG polygon with `points` attribute. Animate by interpolating each point from center (cx, cy) to final position using requestAnimationFrame over ~1 second. Use IntersectionObserver to trigger animation when chart scrolls into view.

**Example (simplified):**
```typescript
function RadarChart({ scores, labels }: { scores: number[]; labels: string[] }) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const n = 7;

  const getPoint = (i: number, value: number) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const r = radius * (value / 100);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  };

  const dataPoints = scores.map((s, i) => getPoint(i, s)).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} class="w-full max-w-[400px] mx-auto">
      {/* Grid polygons at 25%, 50%, 75%, 100% */}
      {[25, 50, 75, 100].map(level => (
        <polygon
          points={Array.from({ length: n }, (_, i) => getPoint(i, level)).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          stroke-width="1"
        />
      ))}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i / n) - Math.PI / 2;
        return <line x1={cx} y1={cy} x2={cx + radius * Math.cos(angle)} y2={cy + radius * Math.sin(angle)} stroke="rgba(255,255,255,0.06)" />;
      })}
      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="rgba(255, 102, 0, 0.15)"
        stroke="rgba(255, 102, 0, 0.8)"
        stroke-width="2"
        class="radar-data"
      />
      {/* Labels positioned outside the chart */}
    </svg>
  );
}
```

### Pattern 6: sessionStorage Persistence

**What:** On every state change, serialize the diagnostic state to sessionStorage. On component mount, check for existing state and restore if found (though per user decision, we do NOT resume -- we start fresh every time). sessionStorage is used for DIAG-07 to survive accidental refresh only.

**Implementation:**
```typescript
// Save state on every change
useEffect(() => {
  if (state.phase !== 'idle') {
    sessionStorage.setItem('diagnostic-state', JSON.stringify(state));
  }
}, [state]);

// On mount, check if there's a state to restore (for accidental refresh)
useEffect(() => {
  const saved = sessionStorage.getItem('diagnostic-state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Restore only if diagnostic was in progress
      if (parsed.phase !== 'idle') {
        dispatch({ type: 'RESTORE', state: parsed });
      }
    } catch {}
  }
}, []);
```

**Note on user decision:** The user decided "No resume, starts fresh" for when the user clicks "Empezar" again. But DIAG-07 says "survives accidental refresh." Resolution: sessionStorage saves state. If user refreshes mid-diagnostic, restore where they were. If they close overlay and click "Empezar" again, clear sessionStorage and start fresh.

### Anti-Patterns to Avoid

- **Separate page/route for diagnostic:** User explicitly said "NOT a separate page/route." It is a fixed overlay on index.astro.
- **client:load for the island:** The diagnostic is not needed on initial render. Use `client:idle` to avoid blocking page load.
- **Canvas-based radar:** The reference uses Canvas. Port to SVG instead -- crisper on retina, accessible, animatable with CSS/JS, lighter.
- **Global state or signals:** The diagnostic state is local to one component session (~3 minutes). useReducer is sufficient.
- **Inline content strings:** All questions, revelations, narratives, and scoring weights belong in typed data files, not hardcoded in components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Test runner | Custom test harness | Vitest | Vite-native, works with Astro's getViteConfig, ESM-first |
| WhatsApp URL encoding | Manual string concatenation | `encodeURIComponent` on template literal | Edge cases with special characters in Spanish text |
| Scroll-triggered animation | Custom scroll listener | IntersectionObserver | Native API, handles threshold detection, no scroll jank |
| Fade transitions | Manual opacity + setTimeout | CSS transitions + Preact state | CSS handles timing/easing, Preact handles state |

**Key insight:** The scoring algorithm IS the thing to hand-roll (it is unique business logic). Everything else -- transitions, scroll detection, URL encoding -- uses platform primitives.

## Common Pitfalls

### Pitfall 1: Crossfade Transition Flicker
**What goes wrong:** When fading out one question and fading in the next, both render simultaneously causing layout shift or a flash.
**Why it happens:** The outgoing and incoming elements occupy space at the same time.
**How to avoid:** Use absolute positioning within the question container. Outgoing question fades out (opacity 1->0) while incoming question fades in (opacity 0->1) in the same position. Both are `position: absolute` during transition, container has fixed height.
**Warning signs:** Questions jumping up/down during transitions, content flashing.

### Pitfall 2: History API State Mismatch
**What goes wrong:** Browser back button navigates to wrong question, or exits the diagnostic unexpectedly.
**Why it happens:** pushState entries get out of sync with component state, especially after re-answering previous questions.
**How to avoid:** Push a new history entry ONLY when advancing forward. When going back (either via UI button or popstate), do NOT push. Use `replaceState` when re-answering a question. Always check `event.state` in popstate handler.
**Warning signs:** Multiple back-presses needed to go back one question, or diagnostic closes when pressing back on question 2.

### Pitfall 3: Scoring Algorithm Off-by-One
**What goes wrong:** Indicator scores don't match reference implementation.
**Why it happens:** The reference uses 0-indexed question arrays (`q: 0` = question 1), but the question IDs in the content doc are 1-indexed (P1, P2...). Mixing them causes wrong weights to be applied to wrong questions.
**How to avoid:** Use 0-indexed arrays consistently in code. The INDICATOR_WEIGHTS in diagnostic.js already uses 0-indexed `q` values. Port these exactly. Write unit tests with the example from the Mecanica doc (answers: [2,1,2,1,2,1,1,2,1,2] = 15/40, verify each indicator score).
**Warning signs:** "Clientes que vuelven" showing wrong score (it only has one input: q=9 i.e. question 10).

### Pitfall 4: Narrative Selection Complexity
**What goes wrong:** The getNarrative function is the most intricate part of the reference (~120 lines). Missing a condition path results in undefined paragraphs or wrong narrative for a profile.
**Why it happens:** Narrative selection depends on profile class, weakest/strongest indicators, weakest mechanisms, and score thresholds. Many conditional branches.
**How to avoid:** Port getNarrative faithfully from the reference. The function builds paragraphs conditionally based on profileClass (absent/partial/building/solid). Test each profile class with representative answer sets. The reference code IS the specification here.
**Warning signs:** Empty narrative paragraphs, generic text that doesn't match the user's specific weak indicators.

### Pitfall 5: Overlay Z-Index and Scroll Lock
**What goes wrong:** Page content scrolls behind the overlay, or the nav appears on top of the diagnostic.
**Why it happens:** Fixed overlay doesn't lock body scroll, or z-index conflicts with Nav component.
**How to avoid:** When overlay opens: add `overflow: hidden` to `<body>`, set overlay z-index above Nav (z-50 should suffice since Nav is likely z-40 or lower). When overlay closes: remove overflow hidden. Also hide WhatsAppFloat during diagnostic.
**Warning signs:** Being able to scroll the homepage while diagnostic is open, Nav hamburger menu visible over diagnostic.

### Pitfall 6: Mobile Viewport Height (100dvh Issue)
**What goes wrong:** On mobile browsers, `100vh` doesn't account for the URL bar, causing content to be cut off.
**Why it happens:** Mobile browsers have dynamic viewport heights.
**How to avoid:** Use `100dvh` (dynamic viewport height) for the overlay. The Hero already uses `min-h-[100dvh]`, follow same pattern. For question layout, use `min-h-[100dvh]` with flexbox centering.
**Warning signs:** Bottom of question options cut off on mobile, need to scroll within a "fullscreen" question.

## Code Examples

### Verified Scoring Algorithm (from reference diagnostic.js)

The INDICATOR_WEIGHTS matrix -- this is the exact mapping to port:

```typescript
// Source: _reference_repo/js/diagnostic.js lines 128-150
// q = 0-indexed question index, w = weight (1.0, 0.6, or 0.3)
export const INDICATOR_WEIGHTS: Record<string, { q: number; w: number }[]> = {
  "Diferenciacion defendible": [
    { q: 1, w: 0.6 }, { q: 5, w: 0.3 }, { q: 7, w: 1.0 }, { q: 8, w: 0.3 }, { q: 9, w: 0.6 }
  ],
  "Margen": [
    { q: 0, w: 1.0 }, { q: 1, w: 1.0 }, { q: 2, w: 1.0 }, { q: 5, w: 0.6 }, { q: 8, w: 0.6 }
  ],
  "Clientes que vuelven": [
    { q: 9, w: 1.0 }
  ],
  "Talento que quiere estar": [
    { q: 3, w: 1.0 }, { q: 5, w: 1.0 }, { q: 6, w: 0.3 }
  ],
  "Capacidad de invertir": [
    { q: 2, w: 0.6 }, { q: 7, w: 0.3 }, { q: 8, w: 1.0 }
  ],
  "Resiliencia": [
    { q: 0, w: 0.6 }, { q: 3, w: 0.6 }, { q: 4, w: 1.0 }, { q: 6, w: 0.6 }, { q: 9, w: 0.3 }
  ],
  "Opcionalidad": [
    { q: 4, w: 0.6 }, { q: 6, w: 1.0 }, { q: 7, w: 0.6 }
  ]
};
```

### Verified Fixture Data (from Mecanica Diagnostico Capa 2)

```typescript
// Source: _reference_repo/WEB DRIMIAN - Mecanica Diagnostico Capa 2.md, Section "Ejemplo completo"
// Answers: P1=b(2), P2=a(1), P3=b(2), P4=a(1), P5=b(2), P6=a(1), P7=a(1), P8=b(2), P9=a(1), P10=b(2)
const FIXTURE_ANSWERS = [2, 1, 2, 1, 2, 1, 1, 2, 1, 2]; // 0-indexed
const FIXTURE_TOTAL = 15; // CIMIENTOS AUSENTES

const FIXTURE_INDICATORS = {
  "Diferenciacion defendible": 21,  // ((1.64 - 1) / 3) * 100 rounded
  "Margen": 19,                     // ((1.57 - 1) / 3) * 100 rounded
  "Clientes que vuelven": 33,       // ((2.0 - 1) / 3) * 100 rounded
  "Talento que quiere estar": 0,    // ((1.0 - 1) / 3) * 100 = 0
  "Capacidad de invertir": 16,      // ((1.47 - 1) / 3) * 100 rounded
  "Resiliencia": 18,                // ((1.55 - 1) / 3) * 100 rounded
  "Opcionalidad": 15                // ((1.45 - 1) / 3) * 100 rounded
};
```

### WhatsApp CTA URL Construction

```typescript
// Source: wa.me URL format (standard WhatsApp API)
function buildWhatsAppURL(profile: string, total: number, palancas: LeveragePoint[]): string {
  const phone = '59178506050'; // Drimian WhatsApp number (from WhatsAppFloat.astro)
  const palancaList = palancas
    .map((p, i) => `${i + 1}. ${p.name}`)
    .join('\n');

  const message = `Hola! Hice el Diagnostico de Prosperidad de Drimian.

Perfil: ${profile} (${total}/40)

Mis palancas principales:
${palancaList}

Me gustaria conversar.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

### Custom Event Bridge (Astro -> Preact)

```typescript
// Hero.astro CTA (Astro-rendered, no JS framework)
<button
  id="start-diagnostic"
  class="inline-flex items-center justify-center bg-orange text-white ..."
>
  Empezar el diagnostico
</button>
<script>
  document.getElementById('start-diagnostic')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('open-diagnostic'));
  });
</script>

// Diagnostic.tsx (Preact island) listens for the event
useEffect(() => {
  const open = () => dispatch({ type: 'OPEN' });
  document.addEventListener('open-diagnostic', open);
  return () => document.removeEventListener('open-diagnostic', open);
}, []);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas radar chart | SVG radar chart | Ongoing trend | Better retina support, accessibility, smaller bundle |
| React for islands | Preact for islands | Astro ecosystem standard | 3KB vs 40KB runtime. Same JSX API. |
| setTimeout for transitions | CSS transitions + state | Modern CSS | Smoother, GPU-accelerated, no JS timing issues |
| 100vh on mobile | 100dvh | 2023+ browser support | Accounts for mobile URL bar. Supported in 95%+ browsers. |

**Deprecated/outdated:**
- The reference implementation uses Canvas for the radar (`drawRadar` with `getContext('2d')`). Port to SVG instead.
- The reference uses `setTimeout` for auto-advance after revelation. Use CSS transition end events or Preact state timers instead.

## Open Questions

1. **WhatsApp phone number**
   - What we know: WhatsAppFloat.astro likely has the number hardcoded
   - What is unclear: Whether the diagnostic WhatsApp CTA should use the same number
   - Recommendation: Read WhatsAppFloat.astro during implementation, extract number to shared constant

2. **Email capture backend**
   - What we know: RESU-07 says "optional email capture, expandable, post-result"
   - What is unclear: No backend. Where do captured emails go?
   - Recommendation: Use `mailto:` link or defer to Cloudflare Worker. Keep as LOW priority -- WhatsApp is the primary CTA. A simple expandable form that copies to clipboard or opens mailto: is sufficient for v1.

3. **Indicator bar detail view**
   - What we know: Mecanica doc Section 3 describes expandable indicator detail ("Lo que te esta frenando / Lo que ya funciona")
   - What is unclear: CONTEXT.md does not explicitly include or exclude this detail
   - Recommendation: Include indicator bars with percentages (RESU-03). The expandable detail per indicator is bonus -- implement if time allows, but prioritize the core flow.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (latest, Vite-native) |
| Config file | `vitest.config.ts` -- needs creation (Wave 0) |
| Quick run command | `pnpm vitest run tests/scoring.test.ts` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCOR-01 | Total score calculation (sum of answers) | unit | `pnpm vitest run tests/scoring.test.ts -t "calculateTotal"` | Wave 0 |
| SCOR-02 | Profile classification (4 ranges) | unit | `pnpm vitest run tests/scoring.test.ts -t "getProfile"` | Wave 0 |
| SCOR-03 | 7 indicator weighted averages | unit | `pnpm vitest run tests/scoring.test.ts -t "calculateIndicatorScores"` | Wave 0 |
| SCOR-04 | Indicator normalization to 0-100% | unit | `pnpm vitest run tests/scoring.test.ts -t "normalization"` | Wave 0 |
| SCOR-05 | Leverage points algorithm | unit | `pnpm vitest run tests/scoring.test.ts -t "getTopPalancas"` | Wave 0 |
| SCOR-06 | Scoring module has zero DOM dependencies | unit | Import test -- if module imports DOM APIs, test fails | Wave 0 |
| SCOR-07 | Scoring matches reference fixture data | unit | `pnpm vitest run tests/scoring.test.ts -t "fixture"` | Wave 0 |
| DIAG-01 | 10 fullscreen questions rendered | manual | Visual check in browser | manual-only |
| DIAG-02 | Option selection with visual feedback | manual | Click test in browser | manual-only |
| DIAG-03 | Progress indicator shows "N/10" | manual | Visual check | manual-only |
| DIAG-04 | Micro-revelation appears 2s min | manual | Timed interaction test | manual-only |
| DIAG-05 | Smooth crossfade transitions | manual | Visual check | manual-only |
| DIAG-06 | Browser back navigates to previous question | manual | Browser back button test | manual-only |
| DIAG-07 | State survives refresh | manual | Refresh mid-diagnostic, check state | manual-only |
| RESU-01 | Profile badge renders correctly | manual | Visual check after completing diagnostic | manual-only |
| RESU-02 | Radar chart renders 7-axis heptagon | manual | Visual check | manual-only |
| RESU-03 | Color-coded indicator bars | manual | Visual check | manual-only |
| RESU-04 | Top 2-3 leverage points displayed | unit | `pnpm vitest run tests/scoring.test.ts -t "palancas"` | Wave 0 |
| RESU-05 | Dynamic narrative matches profile | unit | `pnpm vitest run tests/scoring.test.ts -t "narrative"` | Wave 0 |
| RESU-06 | WhatsApp CTA has correct URL | unit | `pnpm vitest run tests/scoring.test.ts -t "whatsapp"` | Wave 0 |
| RESU-07 | Email capture form renders | manual | Visual check | manual-only |

### Sampling Rate
- **Per task commit:** `pnpm vitest run tests/scoring.test.ts`
- **Per wave merge:** `pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- Vitest configuration with Astro's getViteConfig
- [ ] `tests/scoring.test.ts` -- Unit tests for scoring module (SCOR-01 through SCOR-07, RESU-04, RESU-05, RESU-06)
- [ ] `pnpm add -D vitest` -- Framework install
- [ ] `package.json` -- Add `"test": "vitest run"` script

## Sources

### Primary (HIGH confidence)
- `_reference_repo/js/diagnostic.js` -- Complete reference scoring implementation (604 lines), weights matrix, narrative generation, leverage points algorithm
- `_reference_repo/WEB DRIMIAN - Mecanica Diagnostico Capa 2.md` -- Scoring specification with worked example, weight justifications, narrative structure
- [Astro Template Directives Reference](https://docs.astro.build/en/reference/directives-reference/) -- client:idle, client:only, client:visible directives
- [Preact Hooks Guide](https://preactjs.com/guide/v10/hooks/) -- useState, useReducer, useEffect API
- [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) -- pushState, popstate for question navigation
- [Astro Testing Docs](https://docs.astro.build/en/guides/testing/) -- Vitest integration with getViteConfig

### Secondary (MEDIUM confidence)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) -- Island hydration patterns
- [MDN popstate event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) -- popstate behavior (only fires on browser action, not pushState)
- [SVG Radar Chart Pattern (Paul Scanlon)](https://www.paulie.dev/posts/2023/10/how-to-create-an-svg-radar-chart/) -- Referenced in STACK.md as validated pattern

### Tertiary (LOW confidence)
- Preact Signals as alternative state management -- researched but NOT recommended for this use case (single component, short session)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, only Vitest to add
- Architecture: HIGH -- reference implementation exists and is complete, patterns well-understood
- Scoring algorithm: HIGH -- exact code to port with verified fixture data
- Pitfalls: HIGH -- common patterns with well-known solutions
- Radar chart: HIGH -- basic trigonometry, SVG is standard, no library dependency

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable -- no rapidly evolving dependencies)
