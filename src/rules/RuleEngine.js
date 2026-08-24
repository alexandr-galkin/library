const VALUE_OPERATORS = new Set(['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'contains', 'startsWith', 'endsWith']);
const COLLECTION_OPERATORS = new Set(['in', 'nin']);

export class RuleEngine {
  static evaluate(object, rule) {
    if (!rule || typeof rule !== 'object') return true;
    if (rule.type === 'and') return Array.isArray(rule.rules) && rule.rules.length > 0 && rule.rules.every(item => this.evaluate(object, item));
    if (rule.type === 'or') return Array.isArray(rule.rules) && rule.rules.length > 0 && rule.rules.some(item => this.evaluate(object, item));
    if (rule.type === 'not') return this.validateRule(rule.rule) && !this.evaluate(object, rule.rule);
    if (!object || !this.validateRule(rule)) return false;

    const value = object[rule.field];
    switch (rule.op) {
      case 'eq': return value === rule.value;
      case 'ne': return value !== rule.value;
      case 'gt': return value > rule.value;
      case 'lt': return value < rule.value;
      case 'gte': return value >= rule.value;
      case 'lte': return value <= rule.value;
      case 'in': return rule.values.includes(value);
      case 'nin': return !rule.values.includes(value);
      case 'contains': return typeof value === 'string' && value.includes(rule.value);
      case 'startsWith': return typeof value === 'string' && value.startsWith(rule.value);
      case 'endsWith': return typeof value === 'string' && value.endsWith(rule.value);
      default: return false;
    }
  }

  static describe(rule, labels = {}) {
    if (!rule) return 'Любая';
    if (rule.type === 'and') return rule.rules.map(item => this.describe(item, labels)).join(' и ');
    if (rule.type === 'or') return rule.rules.map(item => this.describe(item, labels)).join(' или ');
    if (rule.type === 'not') return `не ${this.describe(rule.rule, labels)}`;

    const value = rule.valueLabel ?? labels[rule.field]?.[rule.value] ?? rule.value;
    switch (rule.op) {
      case 'eq': return String(value);
      case 'ne': return `не ${value}`;
      case 'gt': return `больше ${rule.value}`;
      case 'lt': return `меньше ${rule.value}`;
      case 'gte': return `больше или равно ${rule.value}`;
      case 'lte': return `меньше или равно ${rule.value}`;
      case 'in': return rule.valuesLabel?.join(', ') || rule.values.join(', ');
      case 'nin': return `не ${rule.valuesLabel?.join(', ') || rule.values.join(', ')}`;
      case 'contains': return `содержит ${rule.value}`;
      case 'startsWith': return `начинается с ${rule.value}`;
      case 'endsWith': return `заканчивается на ${rule.value}`;
      default: return '';
    }
  }

  static validateRule(rule) {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return false;
    if (rule.type === 'and' || rule.type === 'or') return Array.isArray(rule.rules) && rule.rules.length > 0 && rule.rules.every(item => this.validateRule(item));
    if (rule.type === 'not') return this.validateRule(rule.rule);
    if (typeof rule.field !== 'string' || rule.field.length === 0 || typeof rule.op !== 'string') return false;
    if (VALUE_OPERATORS.has(rule.op)) return rule.value !== undefined;
    if (COLLECTION_OPERATORS.has(rule.op)) return Array.isArray(rule.values) && rule.values.length > 0;
    return false;
  }
}
