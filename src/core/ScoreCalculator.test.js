import { describe, expect, it } from 'vitest';
import { ScoreCalculator } from './ScoreCalculator.js';

describe('ScoreCalculator', () => {
  it('calculates combo points with a cap', () => {
    expect(ScoreCalculator.pointsForCombo(1)).toBe(100);
    expect(ScoreCalculator.pointsForCombo(3)).toBe(300);
    expect(ScoreCalculator.pointsForCombo(100)).toBe(1000);
  });

  it('calculates time bonus only for timed levels', () => {
    expect(ScoreCalculator.timeBonus(12, true)).toBe(120);
    expect(ScoreCalculator.timeBonus(12, false)).toBe(0);
    expect(ScoreCalculator.timeBonus(-1, true)).toBe(0);
  });

  it('clamps accuracy bonus', () => {
    expect(ScoreCalculator.accuracyBonus(1)).toBe(500);
    expect(ScoreCalculator.accuracyBonus(0.5)).toBe(250);
    expect(ScoreCalculator.accuracyBonus(-1)).toBe(0);
    expect(ScoreCalculator.accuracyBonus(2)).toBe(500);
  });
});
