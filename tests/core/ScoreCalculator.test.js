import { describe, expect, it } from 'vitest';
import { ScoreCalculator } from '../../src/core/ScoreCalculator.js';

describe('ScoreCalculator', () => {
  it('caps combo multiplier at ten', () => {
    expect(ScoreCalculator.pointsForCombo(1)).toBe(100);
    expect(ScoreCalculator.pointsForCombo(3)).toBe(300);
    expect(ScoreCalculator.pointsForCombo(99)).toBe(1000);
  });

  it('calculates time bonus only for timed levels', () => {
    expect(ScoreCalculator.timeBonus(10, true)).toBe(100);
    expect(ScoreCalculator.timeBonus(10, false)).toBe(0);
    expect(ScoreCalculator.timeBonus(0, true)).toBe(0);
  });

  it('clamps accuracy bonus to the valid range', () => {
    expect(ScoreCalculator.accuracyBonus(1)).toBe(500);
    expect(ScoreCalculator.accuracyBonus(0.5)).toBe(250);
    expect(ScoreCalculator.accuracyBonus(-1)).toBe(0);
  });
});
