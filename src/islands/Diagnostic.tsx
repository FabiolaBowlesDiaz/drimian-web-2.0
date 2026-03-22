import { useReducer, useEffect, useRef, useCallback, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { DiagnosticState, Action } from '../data/types';
import { QUESTIONS, INDICATOR_LABELS } from '../data/questions';
import {
  calculateTotal,
  getProfile,
  calculateIndicatorScores,
  getTopPalancas,
  getNarrative,
  buildWhatsAppURL,
  getBarColor,
} from '../data/scoring';

const TOTAL = QUESTIONS.length;
const STORAGE_KEY = 'diagnostic-state';
const REVELATION_MIN_MS = 2000;

const initialState: DiagnosticState = {
  phase: 'idle',
  currentQuestion: 0,
  answers: new Array(TOTAL).fill(null),
  showRevelation: false,
};

function reducer(state: DiagnosticState, action: Action): DiagnosticState {
  switch (action.type) {
    case 'OPEN':
      return {
        phase: 'question',
        currentQuestion: 0,
        answers: new Array(TOTAL).fill(null),
        showRevelation: false,
      };
    case 'ANSWER':
      if (state.answers[action.questionIndex] !== null) return state;
      const newAnswers = [...state.answers];
      newAnswers[action.questionIndex] = action.value;
      return { ...state, answers: newAnswers, showRevelation: true };
    case 'DISMISS_REVELATION':
      if (state.currentQuestion >= TOTAL - 1) {
        return { ...state, phase: 'results', showRevelation: false };
      }
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        showRevelation: false,
      };
    case 'GO_BACK':
      if (state.currentQuestion <= 0) return state;
      return {
        ...state,
        currentQuestion: state.currentQuestion - 1,
        showRevelation: false,
      };
    case 'CLOSE':
      return { ...initialState };
    case 'RESTORE':
      return { ...action.state };
    default:
      return state;
  }
}

/* ===== RevealBlock: scroll-triggered entrance animation ===== */
function RevealBlock({ children, delay = 0 }: { children: ComponentChildren; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ===== RadarChart: 7-axis heptagon SVG with animated reveal ===== */
function RadarChart({ scores, labels }: { scores: number[]; labels: string[] }) {
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const n = 7;

  const getPoint = (i: number, value: number) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const r = radius * (value / 100);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const getLabelPos = (i: number) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const labelR = radius + 45;
    return { x: cx + labelR * Math.cos(angle), y: cy + labelR * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];

  const dataPoints = scores.map((s, i) => {
    const final = getPoint(i, Math.max(s, 5));
    const center = { x: cx, y: cy };
    return animated ? final : center;
  });
  const dataPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} class="w-full max-w-[360px] md:max-w-[400px] mx-auto">
      {/* Grid polygons */}
      {gridLevels.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return <polygon key={level} points={pts} fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />;
      })}

      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.06)"
            stroke-width="1"
          />
        );
      })}

      {/* Data polygon with CSS transition */}
      <polygon
        points={dataPointsStr}
        fill="rgba(255, 102, 0, 0.15)"
        stroke="rgba(255, 102, 0, 0.8)"
        stroke-width="2"
        style={{ transition: 'all 1s ease-out' }}
      />

      {/* Data points (dots) */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FF6600" style={{ transition: 'all 1s ease-out' }} />
      ))}

      {/* Labels */}
      {labels.map((label, i) => {
        const pos = getLabelPos(i);
        const words = label.split(' ');
        if (words.length > 2) {
          const mid = Math.ceil(words.length / 2);
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              text-anchor="middle"
              fill="var(--color-text-muted)"
              font-size="11"
              font-family="var(--font-body)"
            >
              <tspan x={pos.x} dy="-6">
                {words.slice(0, mid).join(' ')}
              </tspan>
              <tspan x={pos.x} dy="14">
                {words.slice(mid).join(' ')}
              </tspan>
            </text>
          );
        }
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            text-anchor="middle"
            dominant-baseline="middle"
            fill="var(--color-text-muted)"
            font-size="11"
            font-family="var(--font-body)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ===== IndicatorBars: animated bars that fill when visible ===== */
function IndicatorBars({ indicators }: { indicators: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} class="max-w-xl mx-auto mb-16 space-y-4">
      <h3
        class="text-lg font-semibold text-white mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Tus 7 indicadores de prosperidad
      </h3>
      {INDICATOR_LABELS.map((label) => {
        const pct = indicators[label];
        const color = getBarColor(pct);
        return (
          <div key={label} class="space-y-1">
            <div class="flex justify-between items-center text-sm">
              <span class="text-[var(--color-text-secondary)]">{label}</span>
              <span style={{ color }} class="font-semibold">
                {pct}%
              </span>
            </div>
            <div class="h-2 rounded-full bg-[var(--color-bg-section)] overflow-hidden">
              <div
                class="h-full rounded-full"
                style={{
                  width: visible ? `${pct}%` : '0%',
                  background: color,
                  transition: 'width 1s ease-out',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== ResultsView: full results display ===== */
function ResultsView({
  total,
  profile,
  indicators,
  narrative,
  palancas,
  waURL,
  onClose,
}: {
  total: number;
  profile: { name: string; description: string };
  indicators: Record<string, number>;
  narrative: string[];
  palancas: { name: string; indicators: string[]; text: string }[];
  waURL: string;
  onClose: () => void;
}) {
  const [emailExpanded, setEmailExpanded] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleEmailSubmit = () => {
    const name = nameRef.current?.value || '';
    const company = companyRef.current?.value || '';
    const email = emailRef.current?.value || '';
    if (!name || !email) return;

    const subject = encodeURIComponent(`Diagnóstico Drimian — ${name} (${company})`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmpresa: ${company}\nEmail: ${email}\n\nPerfil: ${profile.name} (${total}/40)\n\nPalancas:\n${palancas.map((p) => `- ${p.name}`).join('\n')}\n\nMe gustaría conversar.`,
    );
    window.location.href = `mailto:info@drimian.com?subject=${subject}&body=${body}`;
    setEmailSent(true);
  };

  return (
    <div
      class="fixed inset-0 z-[60] bg-[var(--color-bg-dark)] overflow-y-auto diagnostic-enter"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        class="fixed top-5 right-5 z-10 text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200 w-10 h-10 flex items-center justify-center"
        aria-label="Cerrar resultados"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div class="px-6 py-20 max-w-2xl mx-auto">
        {/* 1. Profile Badge + Score */}
        <RevealBlock>
          <div class="text-center mb-12">
            <div
              class="inline-block px-6 py-2 rounded-full border border-orange/30 bg-orange/10 text-orange text-lg font-semibold tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {profile.name}
            </div>
            <div class="text-5xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {total}
              <span class="text-2xl text-[var(--color-text-muted)]">/40</span>
            </div>
            <p class="text-[var(--color-text-secondary)] max-w-md mx-auto">{profile.description}</p>
          </div>
        </RevealBlock>

        {/* 2. Dynamic Narrative */}
        <RevealBlock delay={200}>
          <div class="max-w-xl mx-auto mb-16 space-y-4">
            {narrative.map((paragraph, i) => (
              <p key={i} class="text-[var(--color-text-secondary)] leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </RevealBlock>

        {/* 3. Radar Chart */}
        <RevealBlock delay={400}>
          <div class="mb-16">
            <RadarChart
              scores={INDICATOR_LABELS.map((l) => indicators[l])}
              labels={INDICATOR_LABELS}
            />
          </div>
        </RevealBlock>

        {/* 4. Indicator Bars */}
        <RevealBlock delay={200}>
          <IndicatorBars indicators={indicators} />
        </RevealBlock>

        {/* 5. Leverage Points */}
        <RevealBlock delay={400}>
          {palancas.length > 0 && (
            <div class="max-w-xl mx-auto mb-16">
              <h3
                class="text-lg font-semibold text-white mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tus palancas principales
              </h3>
              <div class="space-y-4">
                {palancas.map((p, i) => (
                  <div key={i} class="p-5 rounded-xl bg-[var(--color-bg-section)] border border-[var(--color-border-dark)]">
                    <div class="flex items-start gap-3 mb-2">
                      <span
                        class="text-orange font-bold text-lg"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {i + 1}.
                      </span>
                      <div>
                        <h4 class="text-white font-semibold">{p.name}</h4>
                        <p class="text-xs text-[var(--color-text-muted)] mt-1">
                          Impacta: {p.indicators.join(' \u00B7 ')}
                        </p>
                      </div>
                    </div>
                    <p class="text-[var(--color-text-secondary)] text-sm leading-relaxed pl-7">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* 6. WhatsApp CTA */}
        <RevealBlock delay={200}>
          <div class="text-center mb-12">
            <p class="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              Si te interesa explorar cómo mover estas palancas, empecemos a conversar.
            </p>
            <a
              href={waURL}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold rounded-xl px-8 py-4 text-base hover:bg-[#1ea952] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(37,211,102,0.25)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Conversar por WhatsApp
            </a>
          </div>
        </RevealBlock>

        {/* 7. Email Capture */}
        <RevealBlock delay={200}>
          <div class="max-w-md mx-auto mb-16 text-center">
            <button
              onClick={() => setEmailExpanded(!emailExpanded)}
              class="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors underline underline-offset-4"
            >
              {emailExpanded ? 'Cerrar' : 'O déjanos tus datos'}
            </button>
            {emailExpanded && (
              <div class="mt-6 space-y-3 text-left">
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="Nombre"
                  class="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-section)] border border-[var(--color-border-dark)] text-white placeholder:text-[var(--color-text-muted)] focus:border-orange/50 focus:outline-none"
                />
                <input
                  ref={companyRef}
                  type="text"
                  placeholder="Empresa"
                  class="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-section)] border border-[var(--color-border-dark)] text-white placeholder:text-[var(--color-text-muted)] focus:border-orange/50 focus:outline-none"
                />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                  class="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-section)] border border-[var(--color-border-dark)] text-white placeholder:text-[var(--color-text-muted)] focus:border-orange/50 focus:outline-none"
                />
                <button
                  onClick={handleEmailSubmit}
                  class="w-full py-3 rounded-lg bg-orange/20 text-orange font-semibold hover:bg-orange/30 transition-colors"
                >
                  {emailSent ? 'Enviado' : 'Enviar'}
                </button>
              </div>
            )}
          </div>
        </RevealBlock>

        {/* 8. Volver al inicio */}
        <div class="text-center pb-16">
          <button
            onClick={onClose}
            class="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            &larr; Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Diagnostic() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { phase, currentQuestion, answers, showRevelation } = state;

  const revelationShownAt = useRef<number>(0);
  const transitionRef = useRef<boolean>(false);
  const questionKeyRef = useRef<number>(0);
  const prevQuestionRef = useRef<number>(-1);
  const isRestoringRef = useRef<boolean>(false);

  const question = QUESTIONS[currentQuestion];

  // --- Open event listener ---
  useEffect(() => {
    const handleOpen = () => {
      prevQuestionRef.current = -1;
      dispatch({ type: 'OPEN' });
    };
    document.addEventListener('open-diagnostic', handleOpen);
    return () => document.removeEventListener('open-diagnostic', handleOpen);
  }, []);

  // --- Body scroll lock + hide nav/whatsapp ---
  useEffect(() => {
    if (phase !== 'idle') {
      document.body.style.overflow = 'hidden';
      document.body.dataset.diagnosticOpen = 'true';
    } else {
      document.body.style.overflow = '';
      delete document.body.dataset.diagnosticOpen;
    }
    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.diagnosticOpen;
    };
  }, [phase]);

  // --- sessionStorage persistence ---
  useEffect(() => {
    if (phase !== 'idle') {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ phase, currentQuestion, answers, showRevelation })
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [phase, currentQuestion, answers, showRevelation]);

  // --- Restore from sessionStorage on mount ---
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiagnosticState;
        if (parsed.phase && parsed.phase !== 'idle') {
          isRestoringRef.current = true;
          dispatch({ type: 'RESTORE', state: parsed });
        }
      } catch {
        /* corrupted, ignore */
      }
    }
  }, []);

  // --- History API: only pushState when advancing forward ---
  useEffect(() => {
    if (phase !== 'question') return;
    if (isRestoringRef.current) {
      // After restore from sessionStorage, set initial state without push
      isRestoringRef.current = false;
      prevQuestionRef.current = currentQuestion;
      history.replaceState({ diagnosticQuestion: currentQuestion }, '', window.location.pathname);
      return;
    }
    // Only push if advancing forward (currentQuestion > previous)
    if (currentQuestion > prevQuestionRef.current) {
      history.pushState({ diagnosticQuestion: currentQuestion }, '', window.location.pathname);
    }
    prevQuestionRef.current = currentQuestion;
  }, [currentQuestion, phase]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (phase === 'idle') return;
      if (e.state?.diagnosticQuestion !== undefined) {
        dispatch({ type: 'GO_BACK' });
      } else {
        dispatch({ type: 'CLOSE' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [phase]);

  // --- Track revelation shown timestamp ---
  useEffect(() => {
    if (showRevelation) {
      revelationShownAt.current = Date.now();
    }
  }, [showRevelation]);

  // --- Handlers ---
  const handleAnswer = useCallback(
    (value: 1 | 2 | 3 | 4) => {
      if (answers[currentQuestion] !== null) return;
      dispatch({ type: 'ANSWER', questionIndex: currentQuestion, value });
    },
    [currentQuestion, answers]
  );

  const handleDismissRevelation = useCallback(() => {
    const elapsed = Date.now() - revelationShownAt.current;
    if (elapsed < REVELATION_MIN_MS) return;
    if (transitionRef.current) return;

    transitionRef.current = true;
    questionKeyRef.current += 1;

    // Small delay for crossfade effect
    setTimeout(() => {
      dispatch({ type: 'DISMISS_REVELATION' });
      transitionRef.current = false;
    }, 150);
  }, []);

  const handleGoBack = useCallback(() => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    questionKeyRef.current += 1;

    setTimeout(() => {
      dispatch({ type: 'GO_BACK' });
      transitionRef.current = false;
    }, 150);
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE' });
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // --- Render nothing if idle ---
  if (phase === 'idle') return null;

  // --- Results view ---
  if (phase === 'results') {
    const validAnswers = answers.filter((a): a is number => a !== null);
    const total = calculateTotal(validAnswers);
    const profile = getProfile(total);
    const indicators = calculateIndicatorScores(validAnswers);
    const narrative = getNarrative(profile.class, indicators, validAnswers);
    const palancas = getTopPalancas(validAnswers);
    const waURL = buildWhatsAppURL(profile.name, total, palancas);

    return (
      <ResultsView
        total={total}
        profile={profile}
        indicators={indicators}
        narrative={narrative}
        palancas={palancas}
        waURL={waURL}
        onClose={handleClose}
      />
    );
  }

  const selectedAnswer = answers[currentQuestion];

  return (
    <div
      class="fixed inset-0 z-[60] bg-[var(--color-bg-dark)] overflow-y-auto diagnostic-enter"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        class="absolute top-5 right-5 z-10 text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200 w-10 h-10 flex items-center justify-center"
        aria-label="Cerrar diagnostico"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Progress */}
      <div class="absolute top-5 left-5 text-sm text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>
        {currentQuestion + 1}/{TOTAL}
      </div>

      {/* Question area */}
      <div
        key={currentQuestion}
        class="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto relative diagnostic-enter"
      >
        {/* Mechanism label */}
        <span class="text-xs uppercase tracking-widest text-orange mb-4" style={{ fontFamily: 'var(--font-body)' }}>
          {question.mechanism}
        </span>

        {/* Question text */}
        <h2
          class="text-xl md:text-2xl font-semibold text-center text-[var(--color-text-primary)] mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {question.text}
        </h2>

        {/* Options */}
        <div class="w-full space-y-3">
          {question.options.map((opt, i) => {
            const value = (i + 1) as 1 | 2 | 3 | 4;
            const isSelected = selectedAnswer === value;
            const isDisabled = selectedAnswer !== null;
            const dimmed = isDisabled && !isSelected;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(value)}
                disabled={isDisabled}
                class={[
                  'w-full text-left px-5 py-4 rounded-xl border transition-all duration-200',
                  isSelected
                    ? 'border-orange bg-orange/10 text-white'
                    : dimmed
                      ? 'border-[var(--color-border-dark)] text-[var(--color-text-secondary)] opacity-40'
                      : 'border-[var(--color-border-dark)] text-[var(--color-text-secondary)] hover:border-orange hover:text-white',
                ].join(' ')}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Micro-revelation */}
        {showRevelation && (
          <div
            onClick={handleDismissRevelation}
            class="mt-8 p-5 rounded-xl bg-[var(--color-bg-section)] border border-[var(--color-border-dark)] text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-lg text-center cursor-pointer diagnostic-enter"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDismissRevelation(); }}
          >
            <p class="italic">{question.revelation}</p>
            <span class="block mt-3 text-xs text-[var(--color-text-muted)]">Toca para continuar</span>
          </div>
        )}

        {/* Back button */}
        {currentQuestion > 0 && !showRevelation && (
          <button
            onClick={handleGoBack}
            class="mt-8 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            &larr; Pregunta anterior
          </button>
        )}
      </div>
    </div>
  );
}
