const LEVELS = Object.freeze({
  1: { fields: ['color', 'size'], maxContainers: 3, objects: [4, 4], modifiers: {}, timeLimit: null },
  2: { fields: ['color', 'size', 'genre'], maxContainers: 4, objects: [5, 7], modifiers: {}, timeLimit: null },
  3: { fields: ['color', 'size', 'genre', 'symbol'], maxContainers: 4, objects: [6, 9], modifiers: {}, timeLimit: null },
  4: { fields: ['color', 'size', 'genre', 'symbol', 'thickness'], maxContainers: 5, objects: [7, 10], modifiers: { timer: 0.25 }, timeLimit: { base: 30, perObject: 5, perDifficulty: 3, min: 15 } },
  5: { fields: ['color', 'size', 'genre', 'symbol', 'thickness'], maxContainers: 5, objects: [10, 13], modifiers: { timer: 0.30, forbidden: 0.15, decoy: 0.10 }, timeLimit: { base: 30, perObject: 5, perDifficulty: 3, min: 15 } },
  6: { fields: ['color', 'size', 'genre', 'symbol', 'thickness'], maxContainers: 5, objects: [12, 14], modifiers: { timer: 0.35, forbidden: 0.19, decoy: 0.13, moving: 0.08 }, timeLimit: { base: 30, perObject: 5, perDifficulty: 3, min: 15 } },
  7: { fields: ['color', 'size', 'genre', 'symbol', 'thickness'], maxContainers: 6, objects: [14, 14], modifiers: { timer: 0.40, forbidden: 0.23, decoy: 0.16, moving: 0.10, chaos: 0.06 }, timeLimit: { base: 30, perObject: 5, perDifficulty: 3, min: 15 } },
  8: { fields: ['color', 'size', 'genre', 'symbol', 'thickness'], maxContainers: 6, objects: [14, 14], modifiers: { timer: 0.45, forbidden: 0.27, decoy: 0.19, moving: 0.12, chaos: 0.08, hidden: 0.04 }, timeLimit: { base: 30, perObject: 5, perDifficulty: 3, min: 15 } },
});

const MAX_DIFFICULTY = Object.keys(LEVELS).reduce((max, key) => Math.max(max, Number(key)), 1);

function normalizeDifficulty(value) {
  return Math.max(1, Math.min(MAX_DIFFICULTY, Math.floor(Number(value) || 1)));
}

function cloneConfig(config) {
  return {
    fields: [...config.fields],
    maxContainers: config.maxContainers,
    objects: [...config.objects],
    modifiers: { ...config.modifiers },
    timeLimit: config.timeLimit ? { ...config.timeLimit } : null,
  };
}

export class LevelConfig {
  static forDifficulty(difficulty) {
    return cloneConfig(LEVELS[normalizeDifficulty(difficulty)]);
  }

  static maxDifficulty() {
    return MAX_DIFFICULTY;
  }
}
