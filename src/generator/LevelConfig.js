const LEVELS = Object.freeze({
  1: { colors: [3, 3], shelves: [4, 4], capacity: 4 },
  2: { colors: [3, 3], shelves: [4, 4], capacity: 4 },
  3: { colors: [3, 4], shelves: [4, 5], capacity: 4 },
  4: { colors: [4, 4], shelves: [5, 5], capacity: 4 },
  5: { colors: [4, 5], shelves: [5, 6], capacity: 4 },
  6: { colors: [5, 5], shelves: [6, 6], capacity: 4 },
  7: { colors: [5, 6], shelves: [6, 7], capacity: 4 },
  8: { colors: [6, 6], shelves: [7, 7], capacity: 4 },
  9: { colors: [6, 7], shelves: [7, 8], capacity: 4 },
  10: { colors: [7, 7], shelves: [8, 8], capacity: 4 },
});

const MAX_DIFFICULTY = Object.keys(LEVELS).length;

function normalizeDifficulty(value) {
  return Math.max(1, Math.min(MAX_DIFFICULTY, Math.floor(Number(value) || 1)));
}

function cloneConfig(config) {
  return {
    colors: [...config.colors],
    shelves: [...config.shelves],
    capacity: config.capacity,
    fields: ['color'],
    maxContainers: config.shelves[1],
    objects: [config.colors[0] * config.capacity, config.colors[1] * config.capacity],
    modifiers: {},
    timeLimit: null,
  };
}

export class LevelConfig {
  static forDifficulty(difficulty) {
    return cloneConfig(LEVELS[normalizeDifficulty(difficulty)]);
  }

  static maxDifficulty() { return MAX_DIFFICULTY; }
}
