import { RuleGenerator } from './RuleGenerator.js';
import { DifficultyManager } from './DifficultyManager.js';

export class ContainerGenerator {
  static generate(rng, difficulty, mainRule, theme) {
    const labels = theme.getBookLabels();
    const count = DifficultyManager.getMaxContainers(difficulty);
    
    const containers = [{
      id: 'main',
      label: this.formatLabel(mainRule, labels),
      rule: mainRule,
      type: 'normal',
    }];

    const usedFields = new Set();
    this.collectFields(mainRule, usedFields);
    
    const allFields = ['color', 'size', 'genre', 'symbol', 'thickness'];
    const availableFields = allFields.filter(f => !usedFields.has(f));

    for (let i = 1; i < count; i++) {
      let rule = null;
      
      if (availableFields.length > 0 && rng.chance(0.7)) {
        const field = rng.pick(availableFields);
        const keys = Object.keys(labels[field] || {});
        
        if (keys.length > 0) {
          const val = rng.pick(keys);
          rule = {
            field,
            op: 'eq',
            value: val,
            valueLabel: labels[field][val],
          };
        }
      }
      
      if (!rule) {
        rule = RuleGenerator.generate(rng, Math.max(1, difficulty - 1), labels);
      }
      
      if (rule) {
        // Ensure unique rules for containers
        const isDuplicate = containers.some(c => 
          JSON.stringify(c.rule) === JSON.stringify(rule)
        );
        
        if (!isDuplicate) {
          containers.push({
            id: 'c' + i,
            label: this.formatLabel(rule, labels),
            rule,
            type: 'normal',
          });
        }
      }
    }

    if (difficulty >= 5 && rng.chance(0.35)) {
      containers.push({
        id: 'forbidden',
        label: 'ЗАПРЕЩЕНО',
        rule: null,
        type: 'forbidden',
      });
    }

    return containers;
  }

  static collectFields(rule, set) {
    if (!rule) return;
    
    if (rule.field) {
      set.add(rule.field);
    }
    
    if (rule.rules) {
      rule.rules.forEach(r => this.collectFields(r, set));
    }
    
    if (rule.rule) {
      this.collectFields(rule.rule, set);
    }
  }

  static formatLabel(rule, labels) {
    if (!rule) return 'Любые';
    
    if (rule.type === 'and') {
      return rule.rules.map(r => this.formatLabel(r, labels)).join(' + ');
    }
    
    if (rule.type === 'or') {
      return rule.rules.map(r => this.formatLabel(r, labels)).join(' / ');
    }
    
    if (rule.type === 'not') {
      return 'Не ' + this.formatLabel(rule.rule, labels);
    }
    
    return rule.valueLabel || 
           (labels[rule.field] && labels[rule.field][rule.value]) || 
           rule.value;
  }
}