import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  calculateTotal,
  getProfile,
  calculateIndicatorScores,
  getTopPalancas,
  getNarrative,
  buildWhatsAppURL,
  getBarColor,
} from '../src/data/scoring';

// Fixture data from Mecanica Diagnostico Capa 2 worked example
const FIXTURE_ANSWERS = [2, 1, 2, 1, 2, 1, 1, 2, 1, 2];
const ALL_MAX = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const ALL_MIN = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

describe('calculateTotal', () => {
  it('sums fixture answers to 15', () => {
    expect(calculateTotal(FIXTURE_ANSWERS)).toBe(15);
  });

  it('sums all-max answers to 40', () => {
    expect(calculateTotal(ALL_MAX)).toBe(40);
  });

  it('sums all-min answers to 10', () => {
    expect(calculateTotal(ALL_MIN)).toBe(10);
  });
});

describe('getProfile', () => {
  it('returns CIMIENTOS AUSENTES for total 15', () => {
    const profile = getProfile(15);
    expect(profile.class).toBe('absent');
    expect(profile.name).toBe('CIMIENTOS AUSENTES');
  });

  it('returns absent for boundary 17', () => {
    expect(getProfile(17).class).toBe('absent');
  });

  it('returns partial for 18', () => {
    expect(getProfile(18).class).toBe('partial');
  });

  it('returns partial for boundary 25', () => {
    expect(getProfile(25).class).toBe('partial');
  });

  it('returns building for 26', () => {
    expect(getProfile(26).class).toBe('building');
  });

  it('returns building for boundary 33', () => {
    expect(getProfile(33).class).toBe('building');
  });

  it('returns solid for 34', () => {
    expect(getProfile(34).class).toBe('solid');
  });

  it('returns solid for 40', () => {
    expect(getProfile(40).class).toBe('solid');
  });

  it('includes a description string', () => {
    const profile = getProfile(15);
    expect(profile.description).toBeTruthy();
    expect(typeof profile.description).toBe('string');
  });

  it('includes a range tuple', () => {
    const profile = getProfile(15);
    expect(profile.range).toEqual([10, 17]);
  });
});

describe('calculateIndicatorScores', () => {
  it('matches fixture indicator scores within +-1', () => {
    const scores = calculateIndicatorScores(FIXTURE_ANSWERS);

    // Expected values computed from reference algorithm with fixture answers.
    // Note: Mecanica doc shows rounded intermediates (e.g., avg=1.64 for Diferenciacion)
    // but the actual formula produces 4.4/2.8=1.5714, score=round(19.05)=19.
    // These values match the reference JS diagnostic.js implementation exactly.
    expect(scores['Diferenciación defendible']).toBe(19);
    expect(scores['Margen']).toBe(16);
    expect(scores['Clientes que vuelven']).toBe(33);
    expect(scores['Talento que quiere estar']).toBe(0);
    expect(scores['Capacidad de invertir']).toBe(16);
    expect(scores['Resiliencia']).toBe(20);
    expect(scores['Opcionalidad']).toBe(18);
  });

  it('returns all 100 for all-max answers', () => {
    const scores = calculateIndicatorScores(ALL_MAX);
    for (const key of Object.keys(scores)) {
      expect(scores[key]).toBe(100);
    }
  });

  it('returns all 0 for all-min answers', () => {
    const scores = calculateIndicatorScores(ALL_MIN);
    for (const key of Object.keys(scores)) {
      expect(scores[key]).toBe(0);
    }
  });

  it('returns exactly 7 indicators', () => {
    const scores = calculateIndicatorScores(FIXTURE_ANSWERS);
    expect(Object.keys(scores)).toHaveLength(7);
  });
});

describe('getTopPalancas', () => {
  it('returns max 3 items for fixture answers', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    expect(palancas.length).toBeLessThanOrEqual(3);
    expect(palancas.length).toBeGreaterThan(0);
  });

  it('returns only questions with score <= 2', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    for (const p of palancas) {
      expect(p.score).toBeLessThanOrEqual(2);
    }
  });

  it('sorts by totalWeight descending', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    for (let i = 1; i < palancas.length; i++) {
      expect(palancas[i - 1].totalWeight).toBeGreaterThanOrEqual(palancas[i].totalWeight);
    }
  });

  it('returns empty array when no weak mechanisms (all-max)', () => {
    const palancas = getTopPalancas(ALL_MAX);
    expect(palancas).toHaveLength(0);
  });

  it('each palanca has required fields', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    for (const p of palancas) {
      expect(p).toHaveProperty('qIndex');
      expect(p).toHaveProperty('score');
      expect(p).toHaveProperty('totalWeight');
      expect(p).toHaveProperty('indicators');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('text');
      expect(Array.isArray(p.indicators)).toBe(true);
    }
  });
});

describe('getNarrative', () => {
  it('returns array with 4 paragraphs for absent profile', () => {
    const scores = calculateIndicatorScores(FIXTURE_ANSWERS);
    const narrative = getNarrative('absent', scores, FIXTURE_ANSWERS);
    expect(Array.isArray(narrative)).toBe(true);
    expect(narrative.length).toBe(4);
  });

  it('returns array with paragraphs for solid profile', () => {
    const scores = calculateIndicatorScores(ALL_MAX);
    const narrative = getNarrative('solid', scores, ALL_MAX);
    expect(Array.isArray(narrative)).toBe(true);
    expect(narrative.length).toBeGreaterThanOrEqual(2);
  });

  it('returns different content for different profile classes', () => {
    const scoresAbsent = calculateIndicatorScores(FIXTURE_ANSWERS);
    const scoresMax = calculateIndicatorScores(ALL_MAX);
    const narrativeAbsent = getNarrative('absent', scoresAbsent, FIXTURE_ANSWERS);
    const narrativeSolid = getNarrative('solid', scoresMax, ALL_MAX);
    expect(narrativeAbsent[0]).not.toBe(narrativeSolid[0]);
  });

  it('returns paragraphs for partial profile', () => {
    const answers = [2, 2, 3, 2, 2, 2, 2, 3, 2, 2];
    const scores = calculateIndicatorScores(answers);
    const narrative = getNarrative('partial', scores, answers);
    expect(Array.isArray(narrative)).toBe(true);
    expect(narrative.length).toBeGreaterThanOrEqual(2);
  });

  it('returns paragraphs for building profile', () => {
    const answers = [3, 3, 3, 3, 3, 3, 2, 3, 3, 3];
    const scores = calculateIndicatorScores(answers);
    const narrative = getNarrative('building', scores, answers);
    expect(Array.isArray(narrative)).toBe(true);
    expect(narrative.length).toBeGreaterThanOrEqual(3);
  });
});

describe('buildWhatsAppURL', () => {
  it('returns valid wa.me URL with correct phone number', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    const url = buildWhatsAppURL('CIMIENTOS AUSENTES', 15, palancas);
    expect(url).toMatch(/^https:\/\/wa\.me\/59176600056\?text=/);
  });

  it('contains encoded message text', () => {
    const palancas = getTopPalancas(FIXTURE_ANSWERS);
    const url = buildWhatsAppURL('CIMIENTOS AUSENTES', 15, palancas);
    // URL should have encoded text after ?text=
    const textPart = url.split('?text=')[1];
    expect(textPart).toBeTruthy();
    expect(textPart.length).toBeGreaterThan(10);
  });
});

describe('getBarColor', () => {
  it('returns red-ish for 0', () => {
    const color = getBarColor(0);
    expect(color).toBeTruthy();
    // Should be some red color representation
    expect(typeof color).toBe('string');
  });

  it('returns different colors for different thresholds', () => {
    const red = getBarColor(0);
    const orange = getBarColor(50);
    const blue = getBarColor(75);
    const green = getBarColor(100);

    expect(red).not.toBe(orange);
    expect(orange).not.toBe(blue);
    expect(blue).not.toBe(green);
  });

  it('returns consistent color within threshold range', () => {
    expect(getBarColor(0)).toBe(getBarColor(25));
    expect(getBarColor(26)).toBe(getBarColor(50));
    expect(getBarColor(51)).toBe(getBarColor(75));
    expect(getBarColor(76)).toBe(getBarColor(100));
  });
});

describe('Zero DOM dependencies', () => {
  it('scoring.ts contains no DOM APIs', () => {
    const scoringPath = resolve(__dirname, '../src/data/scoring.ts');
    const content = readFileSync(scoringPath, 'utf-8');

    expect(content).not.toMatch(/\bdocument\b/);
    expect(content).not.toMatch(/\bwindow\b/);
    expect(content).not.toMatch(/\bHTMLElement\b/);
    expect(content).not.toMatch(/\bgetElementById\b/);
    expect(content).not.toMatch(/\bquerySelector\b/);
  });
});
