import type { Profile, IndicatorScores, LeveragePoint } from './types';
import {
  INDICATOR_WEIGHTS,
  INDICATOR_LABELS,
  PALANCA_DESCRIPTIONS,
  Q_TO_INDICATORS,
} from './questions';
import {
  PROFILE_DESCRIPTIONS,
  WEAKNESS_PHRASES,
  STRENGTH_PHRASES,
  MECH_PHRASES,
} from './profiles';

/**
 * Sum all answer values.
 * Each answer is 1-4. Total range: 10-40.
 */
export function calculateTotal(answers: number[]): number {
  return answers.reduce((a, b) => a + b, 0);
}

/**
 * Classify total score into one of 4 profile ranges.
 * 10-17 = absent, 18-25 = partial, 26-33 = building, 34-40 = solid.
 */
export function getProfile(total: number): Profile {
  if (total <= 17) {
    return {
      name: 'CIMIENTOS AUSENTES',
      class: 'absent',
      range: [10, 17],
      description: PROFILE_DESCRIPTIONS['absent'],
    };
  }
  if (total <= 25) {
    return {
      name: 'CIMIENTOS PARCIALES',
      class: 'partial',
      range: [18, 25],
      description: PROFILE_DESCRIPTIONS['partial'],
    };
  }
  if (total <= 33) {
    return {
      name: 'CIMIENTOS EN CONSTRUCCIÓN',
      class: 'building',
      range: [26, 33],
      description: PROFILE_DESCRIPTIONS['building'],
    };
  }
  return {
    name: 'CIMIENTOS SÓLIDOS',
    class: 'solid',
    range: [34, 40],
    description: PROFILE_DESCRIPTIONS['solid'],
  };
}

/**
 * Calculate weighted average score per indicator, normalized to 0-100.
 * Formula: ((weighted_avg - 1) / 3) * 100, rounded.
 * Ported from reference diagnostic.js calculateIndicatorScores.
 */
export function calculateIndicatorScores(answers: number[]): IndicatorScores {
  const scores: IndicatorScores = {};
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
  return scores;
}

/**
 * Get top 3 leverage points (palancas) from weak mechanisms.
 * Only questions scored 1-2 are candidates.
 * Sorted by total indicator weight (descending).
 */
export function getTopPalancas(answers: number[]): LeveragePoint[] {
  const palancas: LeveragePoint[] = [];
  for (let i = 0; i < 10; i++) {
    if (answers[i] <= 2) {
      let totalWeight = 0;
      const indicators: string[] = [];
      if (Q_TO_INDICATORS[i]) {
        for (const { indicator, weight } of Q_TO_INDICATORS[i]) {
          totalWeight += weight;
          indicators.push(indicator);
        }
      }
      palancas.push({
        qIndex: i,
        score: answers[i],
        totalWeight,
        indicators: [...new Set(indicators)],
        ...PALANCA_DESCRIPTIONS[i],
      });
    }
  }
  palancas.sort((a, b) => b.totalWeight - a.totalWeight);
  return palancas.slice(0, 3);
}

/** Lowercase only the first character of a string. */
function lcFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * Generate dynamic narrative paragraphs based on profile class, indicator scores, and answers.
 * Faithful port of reference diagnostic.js getNarrative (lines 267-388).
 * Returns array of paragraph strings.
 */
export function getNarrative(
  profileClass: string,
  indicatorScores: IndicatorScores,
  answers: number[],
): string[] {
  // Find weakest and strongest indicators
  const sorted = INDICATOR_LABELS.map((l) => ({ label: l, score: indicatorScores[l] })).sort(
    (a, b) => a.score - b.score,
  );
  const weakest = sorted[0];
  const secondWeakest = sorted[1];
  const strongest = sorted[sorted.length - 1];

  // Find weakest mechanisms (questions with lowest scores)
  const mechWeak = answers
    .map((score, i) => ({ index: i, score, name: PALANCA_DESCRIPTIONS[i].name }))
    .sort((a, b) => a.score - b.score);
  const weakMech1 = mechWeak[0];
  const weakMech2 = mechWeak[1];

  const paragraphs: string[] = [];
  const total = answers.reduce((a, b) => a + b, 0);

  // --- PARAGRAPH 1: Opening ---
  if (profileClass === 'absent') {
    paragraphs.push(
      'Tu empresa funciona. Llegó hasta acá — y eso no es poco. Pero probablemente sentís que depende demasiado de vos, que los problemas se repiten, y que el esfuerzo no se traduce en resultados proporcionados.',
    );
  } else if (profileClass === 'partial') {
    const openings: Record<string, string> = {
      'Diferenciación defendible':
        'Tu empresa tiene algo propio — algo que otros no copian fácil. Eso es una ventaja real. La pregunta es qué más necesita para que esa ventaja se sostenga sola.',
      Margen:
        'Tu empresa captura valor. Eso no es trivial — muchas no lo logran. Ahora, hay mecanismos que podrían hacer que captures más, con el mismo esfuerzo.',
      'Clientes que vuelven':
        'Tus clientes vuelven — y eso es la señal más difícil de fabricar. Es una base fuerte. Hay mecanismos internos que podrían estar frenando ese potencial.',
      'Talento que quiere estar':
        'Tu gente quiere estar — y eso se construyó, no pasó solo. Es un activo real. La pregunta es si el sistema les da las condiciones para dar lo mejor.',
      'Capacidad de invertir':
        'Generás capacidad para mejorar — la mayoría de las empresas no pueden decir eso. Pero esa capacidad rinde más cuando los mecanismos base la acompañan.',
      Resiliencia:
        'Tu empresa absorbe golpes sin perder el rumbo. Es una fortaleza que se nota en las crisis. Ahora, hay oportunidad en pasar de resistir a prosperar.',
      Opcionalidad:
        'Tenés espacio para elegir hacia dónde ir — eso vale mucho. La pregunta es si los mecanismos internos están listos para aprovechar esas opciones.',
    };
    paragraphs.push(openings[strongest.label]);
  } else if (profileClass === 'building') {
    paragraphs.push(
      `Tu empresa tiene bases sólidas — ${STRENGTH_PHRASES[strongest.label]}. Los mecanismos principales funcionan. La pregunta ahora es dónde está el valor que se queda sobre la mesa.`,
    );
  } else {
    paragraphs.push(
      'Tu empresa prospera por diseño, no solo por esfuerzo. Los mecanismos que producen prosperidad están operando — y eso es raro.',
    );
  }

  // --- PARAGRAPH 2: Specific insight ---
  if (profileClass === 'absent') {
    paragraphs.push(
      `Lo que vemos: ${lcFirst(MECH_PHRASES[weakMech1.index])} ${lcFirst(MECH_PHRASES[weakMech2.index])} Esto no es falta de esfuerzo — es que hay mecanismos de base que aún no están construidos.`,
    );
  } else if (profileClass === 'partial') {
    paragraphs.push(
      `Donde vemos más oportunidad: ${lcFirst(WEAKNESS_PHRASES[weakest.label])} A nivel operativo, ${lcFirst(MECH_PHRASES[weakMech1.index])}`,
    );
  } else if (profileClass === 'building') {
    paragraphs.push(
      `Donde vemos más oportunidad: ${lcFirst(WEAKNESS_PHRASES[weakest.label])}`,
    );
    if (secondWeakest.score < 50) {
      paragraphs.push(
        `También: ${lcFirst(WEAKNESS_PHRASES[secondWeakest.label])}`,
      );
    }
  } else {
    const weakAreas = sorted.filter((s) => s.score < 67);
    if (weakAreas.length > 0) {
      paragraphs.push(
        `Donde queda espacio para crecer: ${lcFirst(WEAKNESS_PHRASES[weakAreas[0].label])}`,
      );
    } else {
      paragraphs.push(
        strongest.score === 100
          ? `Los mecanismos principales están operando. En ${strongest.label.toLowerCase()} estás al máximo.`
          : 'Los mecanismos principales están operando. El sistema genera prosperidad de forma sostenida.',
      );
    }
  }

  // --- PARAGRAPH 3: Structural insight ---
  if (profileClass === 'absent') {
    paragraphs.push(
      'Estos patrones son comunes y tienen una explicación estructural: los sistemas tienen estados por defecto, y tienden a volver ahí después de cada intento de cambio. No se resuelve empujando más fuerte — se resuelve cambiando lo que sostiene el estado actual.',
    );
  } else if (profileClass === 'partial') {
    const thirdMech = mechWeak[2] || mechWeak[1];
    if (thirdMech.score <= 2) {
      paragraphs.push(
        `Hay otro patrón que probablemente reconozcas: ${lcFirst(MECH_PHRASES[thirdMech.index])} Cuando estos mecanismos se acumulan, se frenan entre sí — pero también se pueden resolver en cadena.`,
      );
    }
  } else if (profileClass === 'building') {
    paragraphs.push(
      `El mecanismo que más impacto tendría si se resuelve: ${lcFirst(MECH_PHRASES[weakMech1.index])} Mover eso tiene efecto cascada sobre ${weakest.label.toLowerCase()} y ${secondWeakest.label.toLowerCase()}.`,
    );
  }
  // Note: 'solid' has no paragraph 3 in reference

  // --- PARAGRAPH 4: Closing ---
  if (profileClass === 'absent') {
    paragraphs.push(
      'Hay 10 mecanismos que determinan si una empresa prospera. La mayoría aún no están operando — pero cada uno se puede construir cuando se sabe cuál mover primero y en qué orden.',
    );
  } else if (profileClass === 'partial') {
    paragraphs.push(
      'La prosperidad no viene de resolver todo a la vez — viene de identificar qué mecanismos faltan y en qué orden construirlos. En tu caso, los puntos de mayor impacto están claros.',
    );
  } else if (profileClass === 'building') {
    paragraphs.push(
      'La diferencia entre una empresa buena y una que prospera no es más esfuerzo — es saber qué mover y qué dejar de hacer. En tu caso, los puntos de mayor impacto son pocos y concretos.',
    );
  } else {
    paragraphs.push(
      'Si estás pensando en comprimir tiempos con IA, explorar nuevos modelos, o escalar sin agregar complejidad — eso es exactamente la conversación que vale la pena tener.',
    );
  }

  return paragraphs;
}

/**
 * Build WhatsApp URL with pre-formatted diagnostic context.
 * Uses phone number from WhatsAppFloat.astro.
 */
export function buildWhatsAppURL(
  profile: string,
  total: number,
  palancas: LeveragePoint[],
): string {
  const phone = '59176600056';
  let message = `Hola, hice el diagnóstico Drimian.\n\nPerfil: ${profile} (${total}/40)\n`;

  if (palancas.length > 0) {
    message += '\nPalancas de mayor impacto:\n';
    for (const p of palancas) {
      message += `- ${p.name}\n`;
    }
  }

  message += '\nMe gustaría conversar sobre cómo trabajar estas palancas.';

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Get bar color based on percentage threshold.
 * Returns Tailwind-compatible color values.
 * <=25 red, <=50 orange, <=75 blue, >75 green.
 */
export function getBarColor(pct: number): string {
  if (pct <= 25) return '#ef4444'; // red-500
  if (pct <= 50) return '#f97316'; // orange-500
  if (pct <= 75) return '#3b82f6'; // blue-500
  return '#22c55e'; // green-500
}
