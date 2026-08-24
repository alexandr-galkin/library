import { DifficultyManager } from './DifficultyManager.js';
import { createSimpleRule, createCombinedRule, createOrRule, createNotRule } from './RuleStrategies.js';

const STRATEGIES = Object.freeze({
  simple: createSimpleRule,
  combined: createCombinedRule,
  or: createOrRule,
  not: createNotRule,
});

const PROFILES = Object.freeze({
  1: [['simple', 1]],
  2: [['simple', 0.75], ['combined', 0.25]],
  3: [['simple', 0.2], ['combined', 0.35], ['or', 0.45]],
  4: [['simple', 0.15], ['combined', 0.30], ['or', 0.30], ['not', 0.25]],
  default: [['simple', 0.12], ['combined', 0.26], ['or', 0.30], ['not', 0.17], ['combined', 0.15]],
});

export class RuleGenerator {
  static generate(rng, difficulty, labels) {
    const fields = DifficultyManager.getAvailableFields(difficulty);
    const profile = PROFILES[difficulty] || PROFILES.default;
    const strategy = pickStrategy(rng, profile);
    return STRATEGIES[strategy]?.(rng, fields, labels) ?? createSimpleRule(rng, fields, labels);
  }
}

function pickStrategy(rng, profile) {
  const roll = rng.next();
  let cursor = 0;
  for (const [name, probability] of profile) {
    cursor += probability;
    if (roll < cursor) return name;
  }
  return profile[profile.length - 1][0];
}
