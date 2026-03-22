export interface Question {
  id: number;           // 1-10
  mechanism: string;    // "Ciclos de decisión", etc.
  text: string;         // Question text
  options: string[];    // 4 options (a=index 0, b=index 1, c=index 2, d=index 3)
  revelation: string;   // Micro-revelation text
}

export interface Profile {
  name: string;         // "CIMIENTOS AUSENTES" etc.
  class: 'absent' | 'partial' | 'building' | 'solid';
  range: [number, number];
  description: string;  // 2-line profile description
}

export type IndicatorScores = Record<string, number>; // indicator name -> 0-100

export interface LeveragePoint {
  qIndex: number;
  score: number;
  totalWeight: number;
  indicators: string[];
  name: string;
  text: string;
}

export type Phase = 'idle' | 'question' | 'revelation' | 'results';

export interface DiagnosticState {
  phase: Phase;
  currentQuestion: number;
  answers: (number | null)[];
  showRevelation: boolean;
}

export type Action =
  | { type: 'OPEN' }
  | { type: 'ANSWER'; questionIndex: number; value: 1 | 2 | 3 | 4 }
  | { type: 'DISMISS_REVELATION' }
  | { type: 'GO_BACK' }
  | { type: 'SHOW_RESULTS' }
  | { type: 'CLOSE' }
  | { type: 'RESTORE'; state: DiagnosticState };
