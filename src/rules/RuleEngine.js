const VALUE_OPERATORS = Object.freeze({
  eq: (value, expected) => value === expected,
  ne: (value, expected) => value !== expected,
  gt: (value, expected) => value > expected,
  lt: (value, expected) => value < expected,
  gte: (value, expected) => value >= expected,
  lte: (value, expected) => value <= expected,
  contains: (value, expected) => typeof value === 'string' && value.includes(expected),
  startsWith: (value, expected) => typeof value === 'string' && value.startsWith(expected),
  endsWith: (value, expected) => typeof value === 'string' && value.endsWith(expected),
});

const COLLECTION_OPERATORS = Object.freeze({
  in: (value, values) => values.includes(value),
  nin: (value, values) => !values.includes(value),
});

export class RuleEngine {
  static evaluate(object, rule) {
    if (!rule || typeof rule !== 'object') return true;
    switch (rule.type) {
      case 'and': return this.evaluateGroup(object, rule.rules, true);
      case 'or': return this.evaluateGroup(object, rule.rules, false);
      case 'not': return this.validateRule(rule.rule) && !this.evaluate(object, rule.rule);
      default: return this.evaluateLeaf(object, rule);
    }
  }

  static evaluateGroup(object, rules, every) {
    if (!Array.isArray(rules) || rules.length === 0) return false;
    return every ? rules.every(rule => this.evaluate(object, rule)) : rules.some(rule => this.evaluate(object, rule));
  }

  static evaluateLeaf(object, rule) {
    if (!object || !this.validateRule(rule)) return false;
    const value = object[rule.field];
    if (VALUE_OPERATORS[rule.op]) return VALUE_OPERATORS[rule.op](value, rule.value);
    if (COLLECTION_OPERATORS[rule.op]) return COLLECTION_OPERATORS[rule.op](value, rule.values);
    return false;
  }

  static describe(rule, labels = {}) {
    if (!rule) return 'Любая';
    if (rule.type === 'and') return rule.rules.map(item => this.describe(item, labels)).join(' и ');
    if (rule.type === 'or') return rule.rules.map(item => this.describe(item, labels)).join(' или ');
    if (rule.type === 'not') return `не ${this.describe(rule.rule, labels)}`;
    const value = rule.valueLabel ?? labels[rule.field]?.[rule.value] ?? rule.value;
    const descriptions = {
      eq: () => String(value),
      ne: () => `не ${value}`,
      gt: () => `больше ${rule.value}`,
      lt: () => `меньше ${rule.value}`,
      gte: () => `больше или равно ${rule.value}`,
      lte: () => `меньше или равно ${rule.value}`,
      in: () => rule.valuesLabel?.join(', ') || rule.values.join(', '),
      nin: () => `не ${rule.valuesLabel?.join(', ') || rule.values.join(', ')}`,
      contains: () => `содержит ${rule.value}`,
      startsWith: () => `начинается с ${rule.value}`,
      endsWith: () => `заканчивается на ${rule.value}`,
    };
    return descriptions[rule.op]?.() || '';
  }

  static validateRule(rule) {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return false;
    if (rule.type === 'and' || rule.type === 'or') return Array.isArray(rule.rules) && rule.rules.length > 0 && rule.rules.every(item => this.validateRule(item));
    if (rule.type === 'not') return this.validateRule(rule.rule);
    if (typeof rule.field !== 'string' || !rule.field || typeof rule.op !== 'string') return false;
    if (VALUE_OPERATORS[rule.op]) return rule.value !== undefined;
    if (COLLECTION_OPERATORS[rule.op]) return Array.isArray(rule.values) && rule.values.length > 0;
    return false;
  }
}
