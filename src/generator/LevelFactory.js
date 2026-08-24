import { SeededRandom } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleGenerator } from './RuleGenerator.js';
import { ContainerGenerator } from './ContainerGenerator.js';
import { ObjectGenerator } from './ObjectGenerator.js';
<<<<<<< HEAD

export class LevelFactory {
  constructor({ theme, difficultyManager = DifficultyManager } = {}) {
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
      ruleText: formatRule(rule, labels),
      objects,
      containers,
      modifiers,
      timeLimit: this.difficultyManager.getTimeLimit(difficulty, objects.length),
=======
import { RuleEngine } from '../rules/RuleEngine.js';

export class LevelFactory {
  constructor({ theme }) {
    if (!theme || typeof theme.getBookLabels !== 'function' || typeof theme.getAllBookProperties !== 'function') {
      throw new TypeError('LevelFactory requires a valid theme');
    }
    this.theme = theme;
  }

  create(levelNum, seed) {
    const rng = new SeededRandom(seed);
    const difficulty = DifficultyManager.getDifficulty(levelNum);
    const labels = this.theme.getBookLabels();
    const mainRule = RuleGenerator.generate(rng, difficulty, labels);
    const containers = ContainerGenerator.generate(rng, difficulty, mainRule, this.theme);
    const objectCount = DifficultyManager.getObjectCount(difficulty, levelNum, rng);
    const objects = ObjectGenerator.generate(rng, objectCount, this.theme, containers, difficulty);

    return {
      id: levelNum,
      difficulty,
      theme: this.theme.name,
      rule: mainRule,
      ruleText: RuleEngine.describe(mainRule, labels),
      objects,
      containers,
      modifiers: DifficultyManager.getModifierChance(difficulty),
      timeLimit: DifficultyManager.getTimeLimit(difficulty, objects.length),
>>>>>>> refactor/technical
      seed,
    };
  }
}
<<<<<<< HEAD

export function formatRule(rule, labels = {}) {
  if (!rule) return 'РАЗЛОЖИ ВСЁ';
  if (rule.type === 'and') return `РАЗЛОЖИ: ${rule.rules.map(item => formatRule(item, labels)).join(' + ')}`;
  if (rule.type === 'or') return `РАЗЛОЖИ: ${rule.rules.map(item => formatRule(item, labels)).join(' / ')}`;
  if (rule.type === 'not') return `РАЗЛОЖИ: НЕ ${formatRule(rule.rule, labels)}`;

  const fieldNames = { color: 'ЦВЕТ', size: 'РАЗМЕР', genre: 'ЖАНР', symbol: 'ЗНАК', thickness: 'ТОЛЩИНА' };
  const field = fieldNames[rule.field] || rule.field;
  const value = rule.valueLabel || labels[rule.field]?.[rule.value] || rule.value;
  if (rule.op === 'ne') return `${field} ≠ ${String(value).toUpperCase()}`;
  return `${field}: ${String(value).toUpperCase()}`;
}
=======
>>>>>>> refactor/technical
