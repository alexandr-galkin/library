import { DifficultyManager } from './DifficultyManager.js';

export class RuleGenerator {
  static generate(rng, difficulty, labels) {
    const fields = DifficultyManager.getAvailableFields(difficulty);
    
    const simple = () => {
      const field = rng.pick(fields);
      const keys = Object.keys(labels[field] || {});
      
      if (keys.length === 0) {
        return null;
      }
      
      const val = rng.pick(keys);
      
      return {
        field,
        op: 'eq',
        value: val,
        valueLabel: labels[field][val],
      };
    };

    const combined = () => {
      const r1 = simple();
      const r2 = simple();
      
      if (!r1 || !r2) {
        return r1 || r2;
      }
      
      // Ensure different fields for better rules
      if (r1.field === r2.field && r1.value === r2.value) {
        r2.op = 'ne';
      }
      
      return { type: 'and', rules: [r1, r2] };
    };

    const orRule = () => {
      const r1 = simple();
      const r2 = simple();
      
      if (!r1 || !r2) {
        return r1 || r2;
      }
      
      return { type: 'or', rules: [r1, r2] };
    };

    const notRule = () => {
      const r = simple();
      if (!r) return null;
      return { type: 'not', rule: r };
    };

    // Difficulty-based rule generation
    switch (difficulty) {
      case 1:
        return simple();
        
      case 2:
        return rng.chance(0.25) ? combined() : simple();
        
      case 3:
        const p3 = rng.next();
        if (p3 < 0.2) return simple();
        if (p3 < 0.55) return combined();
        return orRule();
        
      case 4:
        const p4 = rng.next();
        if (p4 < 0.15) return simple();
        if (p4 < 0.45) return combined();
        if (p4 < 0.75) return orRule();
        return notRule();
        
      default:
        const p = rng.next();
        if (p < 0.12) return simple();
        if (p < 0.38) return combined();
        if (p < 0.68) return orRule();
        if (p < 0.85) return notRule();
        return combined(); // Fallback
    }
  }
}