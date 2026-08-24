import { SeededRandom } from './SeededRandom.js';

export class ObjectGenerator {
  static generate(rng, count, theme, containers, difficulty) {
    const props = theme.getAllBookProperties();
    const objects = [];
    const normalContainers = containers.filter(c => c.type !== 'forbidden');
    
    let attempts = 0;
    const maxAttempts = 2000;
    
    while (objects.length < count && attempts < maxAttempts) {
      attempts++;
      
      const obj = this.createRandomBook(rng, props, objects);
      
      // Check if object fits at least one container
      const fits = normalContainers.some(c => 
        this.evaluateBook(obj, c.rule)
      );
      
      if (fits) {
        objects.push(obj);
      }
    }

    // Fallback: generate books that definitely fit main container
    if (objects.length < count) {
      const mainRule = containers[0]?.rule;
      
      while (objects.length < count && attempts < maxAttempts * 2) {
        attempts++;
        
        const obj = this.createRandomBook(rng, props, objects);
        
        if (mainRule && this.evaluateBook(obj, mainRule)) {
          objects.push(obj);
        } else if (!mainRule) {
          objects.push(obj);
        }
      }
    }

    // Ensure minimum objects
    if (objects.length < 2) {
      // Create simple valid objects
      const mainRule = containers[0]?.rule;
      
      while (objects.length < 2) {
        const obj = this.createBookFromRule(mainRule, props);
        if (obj) {
          objects.push(obj);
        }
      }
    }

    return rng.shuffle(objects);
  }

  static createRandomBook(rng, props, existing) {
    return {
      uid: `book_${existing.length}_${Date.now()}_${rng.int(0, 9999)}`,
      type: 'book',
      color: rng.pick(props.colors),
      size: rng.pick(props.sizes),
      genre: rng.pick(props.genres),
      symbol: rng.pick(props.symbols),
      thickness: rng.pick(props.thicknesses),
    };
  }

  static createBookFromRule(rule, props) {
    if (!rule) {
      return {
        uid: `book_${Date.now()}_${Math.random()}`,
        type: 'book',
        color: props.colors[0],
        size: props.sizes[0],
        genre: props.genres[0],
        symbol: props.symbols[0],
        thickness: props.thicknesses[0],
      };
    }
    
    // Handle simple equality rule
    if (rule.type === 'eq' || (rule.field && rule.value)) {
      return {
        uid: `book_${Date.now()}_${Math.random()}`,
        type: 'book',
        color: rule.field === 'color' ? rule.value : props.colors[0],
        size: rule.field === 'size' ? rule.value : props.sizes[0],
        genre: rule.field === 'genre' ? rule.value : props.genres[0],
        symbol: rule.field === 'symbol' ? rule.value : props.symbols[0],
        thickness: rule.field === 'thickness' ? rule.value : props.thicknesses[0],
      };
    }
    
    return null;
  }

  static evaluateBook(book, rule) {
    if (!rule) return true;
    
    if (rule.type === 'and') {
      return rule.rules.every(r => this.evaluateBook(book, r));
    }
    
    if (rule.type === 'or') {
      return rule.rules.some(r => this.evaluateBook(book, r));
    }
    
    if (rule.type === 'not') {
      return !this.evaluateBook(book, rule.rule);
    }
    
    const val = book[rule.field];
    
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