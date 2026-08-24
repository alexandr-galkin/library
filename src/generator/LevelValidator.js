export class LevelValidator {
  static validate(level) {
    if (!this.validateBasicStructure(level)) {
      return false;
    }
    
    const normalContainers = level.containers.filter(c => c.type !== 'forbidden');
    
    if (normalContainers.length === 0) {
      return false;
    }
    
    // Check that every object fits at least one container
    for (const obj of level.objects) {
      const fits = normalContainers.some(c => this.evaluate(obj, c.rule));
      if (!fits) {
        console.warn('Object does not fit any container:', obj);
        return false;
      }
    }
    
    // Check that every container accepts at least one object
    for (const container of normalContainers) {
      const accepts = level.objects.some(o => this.evaluate(o, container.rule));
      if (!accepts) {
        console.warn('Container does not accept any object:', container);
        return false;
      }
    }
    
    return true;
  }

  static validateBasicStructure(level) {
    if (!level || typeof level !== 'object') {
      return false;
    }
    
    if (!Array.isArray(level.objects) || level.objects.length === 0) {
      return false;
    }
    
    if (!Array.isArray(level.containers) || level.containers.length < 2) {
      return false;
    }
    
    if (!level.objects.every(obj => obj && typeof obj === 'object' && obj.uid)) {
      return false;
    }
    
    if (!level.containers.every(c => c && typeof c === 'object' && c.id)) {
      return false;
    }
    
    return true;
  }

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
      case 'in': return rule.values.includes(val);
      case 'nin': return !rule.values.includes(val);
      default: return false;
    }
  }
}