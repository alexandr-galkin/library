import { describe, expect, it } from 'vitest';
import { GameState } from './GameState.js';

function repository(initial = null) {
  return {
    value: initial,
    load() { return this.value; },
    save(value) { this.value = value; },
    clear() { this.value = null; },
  };
}

describe('GameState', () => {
  it('uses safe defaults for missing data', () => {
    const state = new GameState(repository());
    expect(state.data).toEqual({
      currentLevel: 1,
      bestScore: 0,
      totalScore: 0,
      settings: { sound: true, anim: true, reduced: false },
    });
  });

  it('sanitizes invalid persisted values', () => {
    const state = new GameState(repository({
      currentLevel: -10,
      bestScore: 'bad',
      totalScore: 42.9,
      settings: { sound: 'yes', reduced: true },
    }));

    expect(state.data.currentLevel).toBe(1);
    expect(state.data.bestScore).toBe(0);
    expect(state.data.totalScore).toBe(42);
    expect(state.data.settings).toEqual({ sound: true, anim: true, reduced: true });
  });

  it('persists updates and can reset', () => {
    const repo = repository();
    const state = new GameState(repo);
    state.set('currentLevel', 7);
    expect(repo.value.currentLevel).toBe(7);
    state.reset();
    expect(repo.value.currentLevel).toBe(1);
  });
});
