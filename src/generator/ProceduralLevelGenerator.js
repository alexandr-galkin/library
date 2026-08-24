import { SeededRandom, generateSeed } from './SeededRandom.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleGenerator } from './RuleGenerator.js';
import { ContainerGenerator } from './ContainerGenerator.js';
import { ObjectGenerator } from './ObjectGenerator.js';
import { LevelValidator } from './LevelValidator.js';

const MAX_ATTEMPTS = 10;

export class ProceduralLevelGenerator {
  static generate(levelNum, theme) {
    const seed = generateSeed(levelNum);
    const difficulty = DifficultyManager.getDifficulty(levelNum);
    const labels = theme.getBookLabels();

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const attemptSeed = seed + attempt * 1000;
      const level = this.generateAttempt(levelNum, theme, difficulty, labels, attemptSeed);
      if (LevelValidator.validate(level)) return level;
    }

    return this.generateSimpleLevel(levelNum, theme, difficulty);
  }

  static generateAttempt(levelNum, theme, difficulty, labels, seed) {
    const rng = new SeededRandom(seed);
    const rule = RuleGenerator.generate(rng, difficulty, labels);
    const containers = ContainerGenerator.generate(rng, difficulty, rule, theme);
    const objectCount = DifficultyManager.getObjectCount(difficulty, levelNum, rng);
    const objects = ObjectGenerator.generate(rng, objectCount, theme, containers, difficulty);
    const modChances = DifficultyManager.getModifierChance(difficulty);
    const modifiers = Object.entries(modChances).filter(([, chance]) => rng.chance(chance)).map(([modifier]) => modifier);

    return {
      id: levelNum,
      difficulty,
      theme: theme.name,
      rule,
      ruleText: this.formatTask(rule, labels),
      objects,
      containers,
      modifiers,
      timeLimit: DifficultyManager.getTimeLimit(difficulty, objects.length),
      seed,
    };
  }

  static generateSimpleLevel(levelNum, theme, difficulty) {
    const labels = theme.getBookLabels();
    const colors = Object.keys(labels.color || {});
    const primary = colors[0] || 'red';
    const secondary = colors[1] || primary;
    const props = theme.getAllBookProperties();
    const simpleRule = { field: 'color', op: 'eq', value: primary, valueLabel: labels.color?.[primary] || primary };
    const secondaryRule = { field: 'color', op: 'eq', value: secondary, valueLabel: labels.color?.[secondary] || secondary };
    const objects = Array.from({ length: 4 }, (_, index) => ObjectGenerator.createBookFromRule(index % 2 === 0 ? simpleRule : secondaryRule, props, index));

    return {
      id: levelNum,
      difficulty,
      theme: theme.name,
      rule: simpleRule,
      ruleText: `ЦВЕТ: ${(labels.color?.[primary] || primary).toUpperCase()}`,
      objects,
      containers: [
        { id: 'main', label: labels.color?.[primary] || primary, rule: simpleRule, type: 'normal' },
        { id: 'secondary', label: labels.color?.[secondary] || secondary, rule: secondaryRule, type: 'normal' },
      ],
      modifiers: [],
      timeLimit: null,
      seed: levelNum,
    };
  }

  static formatTask(rule, labels) {
    if (!rule) return 'РАЗЛОЖИ ВСЁ';
    if (rule.type === 'and') return `РАЗЛОЖИ: ${rule.rules.map(r => this.formatTask(r, labels)).join(' + ')}`;
    if (rule.type === 'or') return `РАЗЛОЖИ: ${rule.rules.map(r => this.formatTask(r, labels)).join(' / ')}`;
    if (rule.type === 'not') return `РАЗЛОЖИ: НЕ ${this.formatTask(rule.rule, labels)}`;
    const fieldNames = { color: 'ЦВЕТ', size: 'РАЗМЕР', genre: 'ЖАНР', symbol: 'ЗНАК', thickness: 'ТОЛЩИНА' };
    const field = fieldNames[rule.field] || rule.field;
    const val = rule.valueLabel || labels[rule.field]?.[rule.value] || rule.value;
    if (rule.op === 'eq') return `${field}: ${String(val).toUpperCase()}`;
    if (rule.op === 'ne') return `${field} ≠ ${String(val).toUpperCase()}`;
    return `${field}: ${String(val).toUpperCase()}`;
  }
}
