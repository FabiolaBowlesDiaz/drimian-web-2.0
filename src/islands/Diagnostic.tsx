import { useReducer, useEffect, useRef, useCallback } from 'preact/hooks';
import type { DiagnosticState, Action } from '../data/types';
import { QUESTIONS } from '../data/questions';

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

  // Results placeholder (will be built in plan 03-03)
  if (phase === 'results') {
    return (
      <div class="fixed inset-0 z-[60] bg-[var(--color-bg-dark)] flex items-center justify-center">
        <div class="text-center px-6">
          <h2 class="text-2xl font-heading font-bold text-[var(--color-text-primary)] mb-4">
            Resultados
          </h2>
          <p class="text-[var(--color-text-secondary)] mb-8">
            Tu resultado se esta calculando... (disponible en la siguiente fase)
          </p>
          <button
            onClick={handleClose}
            class="px-8 py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
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
