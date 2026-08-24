import { RuleEngine } from '../rules/RuleEngine.js';

const BOOK_FIELDS = Object.freeze(['color', 'size', 'genre', 'symbol', 'thickness']);

export class ObjectGenerator {
  static generate(rng, count, theme, containers, difficulty) {
    const props = theme.getAllBookProperties();
    const normalContainers = containers.filter(container => container.type !== 'forbidden');
    const objects = [];
    const maxAttempts = Math.max(100, count * 200);

    for (let attempt = 0; objects.length < count && attempt < maxAttempts; attempt += 1) {
      const object = this.createRandomBook(rng, props, objects.length);
      if (normalContainers.some(container => RuleEngine.evaluate(object, container.rule))) objects.push(object);
    }

    const fallbackRule = normalContainers[0]?.rule;
    for (let attempt = 0; objects.length < count && attempt < maxAttempts; attempt += 1) {
      const object = this.createBookFromRule(fallbackRule, props, objects.length) || this.createRandomBook(rng, props, objects.length);
      if (!fallbackRule || RuleEngine.evaluate(object, fallbackRule)) objects.push(object);
    }

    while (objects.length < count) {
      objects.push(this.createRandomBook(rng, props, objects.length));
    }

    return rng.shuffle(objects);
  }

  static createRandomBook(rng, props, index) {
    return {
      uid: `book_${index}`,
      type: 'book',
      color: rng.pick(props.colors),
      size: rng.pick(props.sizes),
      genre: rng.pick(props.genres),
      symbol: rng.pick(props.symbols),
      thickness: rng.pick(props.thicknesses),
    };
  }

  static createBookFromRule(rule, props, index) {
    const base = this.createBaseBook(props, index);
    return this.applyRuleConstraints(base, rule);
  }

  static createBaseBook(props, index) {
    return {
      uid: `book_${index}`,
      type: 'book',
      color: props.colors[0],
      size: props.sizes[0],
      genre: props.genres[0],
      symbol: props.symbols[0],
      thickness: props.thicknesses[0],
    };
  }

  static applyRuleConstraints(book, rule) {
    if (!rule) return book;
    if (rule.type === 'and') {
      return rule.rules.reduce((current, child) => this.applyRuleConstraints(current, child), book);
    }
    if (rule.type === 'or' || rule.type === 'not') return RuleEngine.evaluate(book, rule) ? book : null;
    if (BOOK_FIELDS.includes(rule.field) && rule.op === 'eq' && rule.value !== undefined) {
      return { ...book, [rule.field]: rule.value };
    }
    return RuleEngine.evaluate(book, rule) ? book : null;
  }
}
