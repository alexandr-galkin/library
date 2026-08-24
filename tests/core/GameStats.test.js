import { describe, expect, it } from 'vitest';
import { GameStats } from '../../src/core/GameStats.js';

describe('GameStats', () => {
  it('tracks level progress and score', () => {
    const stats = new GameStats();

    stats.addCorrect(100);
    stats.addCorrect(200);
    stats.addMistake();

    expect(stats.placed).toBe(2);
    expect(stats.levelScore).toBe(300);
    expect(stats.totalScore).toBe(300);
    expect(stats.combo).toBe(0);
    expect(stats.mistakes).toBe(1);
  });

  it('resets level state without losing total score', () => {
    const stats = new GameStats();
    stats.addCorrect(100);
    stats.resetLevel();

    expect(stats.levelScore).toBe(0);
    expect(stats.placed).toBe(0);
    expect(stats.combo).toBe(0);
    expect(stats.totalScore).toBe(100);
  });

  it('calculates accuracy and stars', () => {
    const stats = new GameStats();
    stats.addMistake();

    expect(stats.accuracy(10)).toBe(0.9);
    expect(stats.stars()).toBe(2);
  });
});
