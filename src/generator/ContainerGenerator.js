import { RuleGenerator } from './RuleGenerator.js';
import { DifficultyManager } from './DifficultyManager.js';
import { RuleEngine } from '../rules/RuleEngine.js';

export class ContainerGenerator {
  static generate(rng, difficulty, mainRule, theme) {
    const labels = theme.getBookLabels();
    const maxContainers = DifficultyManager.getMaxContainers(difficulty);
    const containers = [{ id: 'main', label: this.formatLabel(mainRule, labels), rule: mainRule, type: 'normal' }];
    const signatures = new Set([this.signature(mainRule)]);
    const fields = Object.keys(labels);
    const maxAttempts = Math.max(20, maxContainers * 10);

    for (let attempt = 0; containers.length < maxContainers && attempt < maxAttempts; attempt += 1) {
      const rule = RuleGenerator.generate(rng, Math.max(1, difficulty - 1), labels, fields);
      if (!rule || !RuleEngine.validateRule(rule)) continue;
      const signature = this.signature(rule);
      if (signatures.has(signature)) continue;
      signatures.add(signature);
      containers.push({ id: `c${containers.length}`, label: this.formatLabel(rule, labels), rule, type: 'normal' });
    }

    if (difficulty >= 5 && rng.chance(0.35)) {
      containers.push({ id: 'forbidden', label: 'ЗАПРЕЩЕНО', rule: null, type: 'forbidden' });
    }

    return containers;
  }

  static signature(rule) {
    return JSON.stringify(rule, Object.keys(rule || {}).sort());
  }

  static formatLabel(rule, labels) {
    return RuleEngine.describe(rule, labels);
  }
}
