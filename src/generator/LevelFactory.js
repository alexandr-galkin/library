import { SeededRandom } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleGenerator } from './RuleGenerator.js';
import { ContainerGenerator } from './ContainerGenerator.js';
import { ObjectGenerator } from './ObjectGenerator.js';

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
      ruleText: mainRule ? formatRule(mainRule) : '',
      objects,
      containers,
      modifiers: DifficultyManager.getModifierChance(difficulty),
      timeLimit: DifficultyManager.getTimeLimit(difficulty, objects.length),
      seed: rng.seed,
    };
  }
}

function formatRule(rule) {
  if (rule.type === 'and') return rule.rules.map(formatRule).join(' + ');
  if (rule.type === 'or') return rule.rules.map(formatRule).join(' / ');
  if (rule.type === 'not') return `НЕ ${formatRule(rule.rule)}`;
  const field = String(rule.field).toUpperCase();
  const value = String(rule.valueLabel ?? rule.value).toUpperCase();
  return rule.op === 'ne' ? `${field} ≠ ${value}` : `${field}: ${value}`;
}
