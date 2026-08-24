import { SeededRandom } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleGenerator } from './RuleGenerator.js';
import { ContainerGenerator } from './ContainerGenerator.js';
import { ObjectGenerator } from './ObjectGenerator.js';
import { RuleEngine } from '../rules/RuleEngine.js';

export class LevelFactory {
  constructor({ theme, difficultyManager = DifficultyManager } = {}) {
    if (!theme || typeof theme.getBookLabels !== 'function') {
      throw new TypeError('LevelFactory requires a valid theme');
    }
    this.theme = theme;
    this.difficultyManager = difficultyManager;
  }

  create(levelNumber, seed) {
    const difficulty = this.difficultyManager.getDifficulty(levelNumber);
    const labels = this.theme.getBookLabels();
    const rng = new SeededRandom(seed);
    const rule = RuleGenerator.generate(rng, difficulty, labels);
    const containers = ContainerGenerator.generate(rng, difficulty, rule, this.theme);
    const objectCount = this.difficultyManager.getObjectCount(difficulty, levelNumber, rng);
    const objects = ObjectGenerator.generate(rng, objectCount, this.theme, containers, difficulty);
    const modifierChances = this.difficultyManager.getModifierChance(difficulty);
    const modifiers = Object.entries(modifierChances)
      .filter(([, chance]) => rng.chance(chance))
      .map(([modifier]) => modifier);

    return {
      id: levelNumber,
      difficulty,
      theme: this.theme.name,
      rule,
      ruleText: RuleEngine.describe(rule, labels),
      objects,
      containers,
      modifiers,
      timeLimit: this.difficultyManager.getTimeLimit(difficulty, objects.length),
      seed,
    };
  }
}
