import { describe, expect, it } from 'vitest';
import { GameState } from '../../src/game/GameState.js';

function repository(initial = null) {
  let data = initial;
  return {
    load: () => data,
    save: value => { data = value; },
  };
}

describe('GameState', () => {
  it('loads and sanitizes persisted values', () => {
    const state = new GameState(repository({
      currentLevel: '12',
      bestScore: 500,
      totalScore: -20,
      settings: { sound: false, anim: 'invalid' },
    }));

    expect(state.data.currentLevel).toBe(12);
    expect(state.data.bestScore).toBe(500);
    expect(state.data.totalScore).toBe(0);
    expect(state.data.settings).toEqual({ sound: false, anim: true, reduced: false });
  });

  it('does not depend on localStorage', () => {
    const repo = repository();
    const state = new GameState(repo);
    state.set('currentLevel', 42);

    expect(repo.load().currentLevel).toBe(42);
  });
});
