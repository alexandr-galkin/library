import { LevelFactory } from './LevelFactory.js';
import { generateSeed } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { LevelValidator } from './LevelValidator.js';
import { ObjectGenerator } from './ObjectGenerator.js';

const MAX_ATTEMPTS = 10;

export class ProceduralLevelGenerator {
  static generate(levelNum, theme) {
    const factory = new LevelFactory({ theme });
    const seed = generateSeed(levelNum);
    const difficulty = DifficultyManager.getDifficulty(levelNum);

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const level = factory.create(levelNum, seed + attempt * 1000);
      if (LevelValidator.validate(level)) return level;
    }

    return createFallbackLevel(levelNum, theme, difficulty);
  }
}

function createFallbackLevel(levelNum, theme, difficulty) {
  const labels = theme.getBookLabels();
  const colors = Object.keys(labels.color || {});
  const primary = colors[0] || 'red';
  const secondary = colors[1] || primary;
  const properties = theme.getAllBookProperties();
  const primaryRule = { field: 'color', op: 'eq', value: primary, valueLabel: labels.color?.[primary] || primary };
  const secondaryRule = { field: 'color', op: 'eq', value: secondary, valueLabel: labels.color?.[secondary] || secondary };
  const objects = Array.from({ length: 4 }, (_, index) => ObjectGenerator.createBookFromRule(index % 2 === 0 ? primaryRule : secondaryRule, properties, index));

  return {
    id: levelNum,
    difficulty,
    theme: theme.name,
    rule: primaryRule,
    ruleText: `ЦВЕТ: ${(labels.color?.[primary] || primary).toUpperCase()}`,
    objects,
    containers: [
      { id: 'main', label: labels.color?.[primary] || primary, rule: primaryRule, type: 'normal' },
      { id: 'secondary', label: labels.color?.[secondary] || secondary, rule: secondaryRule, type: 'normal' },
    ],
    modifiers: [],
    timeLimit: null,
    seed: levelNum,
  };
}
