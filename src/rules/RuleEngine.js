export class RuleEngine {
  static evaluate(obj, rule) {
    if (!rule) return true;
    
    if (rule.type === 'and') {
      return rule.rules.every(r => this.evaluate(obj, r));
    }
    
    if (rule.type === 'or') {
      return rule.rules.some(r => this.evaluate(obj, r));
    }
    
    if (rule.type === 'not') {
      return !this.evaluate(obj, rule.rule);
    }
    
    const val = obj[rule.field];
    
    switch (rule.op) {
      case 'eq': return val === rule.value;
      case 'ne': return val !== rule.value;
      case 'gt': return val > rule.value;
      case 'lt': return val < rule.value;
      case 'gte': return val >= rule.value;
      case 'lte': return val <= rule.value;
      case 'in': return rule.values && rule.values.includes(val);
      case 'nin': return rule.values && !rule.values.includes(val);
      case 'contains': return val && val.includes(rule.value);
      case 'startsWith': return val && val.startsWith(rule.value);
      case 'endsWith': return val && val.endsWith(rule.value);
      default: return false;
    }
  }

  static describe(rule, labels) {
    if (!rule) return 'Любая';
    
    if (rule.type === 'and') {
      return rule.rules.map(r => this.describe(r, labels)).join(' и ');
    }
    
    if (rule.type === 'or') {
      return rule.rules.map(r => this.describe(r, labels)).join(' или ');
    }
    
    if (rule.type === 'not') {
      return 'не ' + this.describe(rule.rule, labels);
    }
    
    const val = rule.valueLabel || 
                (labels && labels[rule.field] && labels[rule.field][rule.value]) || 
                rule.value;
    
    switch (rule.op) {
      case 'eq': return val;
      case 'ne': return 'не ' + val;
      case 'gt': return 'больше ' + rule.value;
      case 'lt': return 'меньше ' + rule.value;
      case 'gte': return 'больше или равно ' + rule.value;
      case 'lte': return 'меньше или равно ' + rule.value;
      case 'in': return rule.valuesLabel?.join(', ') || rule.values.join(', ');
      case 'nin': return 'не ' + (rule.valuesLabel?.join(', ') || rule.values.join(', '));
      default: return '';
    }
  }

  static validateRule(rule) {
    if (!rule || typeof rule !== 'object') {
      return false;
    }
    
    if (rule.type === 'and' || rule.type === 'or') {
      return Array.isArray(rule.rules) && 
             rule.rules.length > 0 && 
             rule.rules.every(r => this.validateRule(r));
    }
    
    if (rule.type === 'not') {
      return this.validateRule(rule.rule);
    }
    
    if (!rule.field || !rule.op) {
      return false;
    }
    
    switch (rule.op) {
      case 'eq':
      case 'ne':
      case 'gt':
      case 'lt':
      case 'gte':
      case 'lte':
        return rule.value !== undefined;
      case 'in':
      case 'nin':
        return Array.isArray(rule.values) && rule.values.length > 0;
      default:
        return false;
    }
  }
}