import { RuleEngine } from '../rules/RuleEngine.js';

const BOOK_FIELDS = Object.freeze(['color', 'size', 'genre', 'symbol', 'thickness']);
const MAX_MATCH_ATTEMPTS = 500;

export class ObjectGenerator {
  static generate(rng, count, theme, containers) {
    if (!rng || typeof rng.pick !== 'function' || typeof rng.shuffle !== 'function') throw new TypeError('ObjectGenerator requires a compatible RNG');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('ObjectGenerator count must be positive');

    const props = theme.getAllBookProperties();
    const normalContainers = containers.filter(container => container.type !== 'forbidden');
    if (!normalContainers.length) throw new Error('Cannot generate objects without normal containers');
    if (count < normalContainers.length) throw new Error('Object count must cover every normal container');

    const objects = [];
    for (const container of normalContainers) {
      const object = this.findMatchingObject(rng, props, container.rule, objects.length);
      if (!object) throw new Error(`Unable to create object for container ${container.id}`);
      objects.push(object);
    }

    while (objects.length < count) {
      const object = this.findAnyMatchingObject(rng, props, normalContainers, objects.length);
      if (!object) throw new Error('Unable to generate a valid object');
      objects.push(object);
    }

    return rng.shuffle(objects);
  }

  static findMatchingObject(rng, props, rule, index) {
    for (let attempt = 0; attempt < MAX_MATCH_ATTEMPTS; attempt += 1) {
      const object = this.createRandomBook(rng, props, index);
      if (RuleEngine.evaluate(object, rule)) return object;
    }
    return this.createBookFromRule(rule, props, index);
  }

  static findAnyMatchingObject(rng, props, containers, index) {
    for (let attempt = 0; attempt < MAX_MATCH_ATTEMPTS; attempt += 1) {
      const object = this.createRandomBook(rng, props, index);
      if (containers.some(container => RuleEngine.evaluate(object, container.rule))) return object;
    }
    return null;
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
    if (!rule) return null;
    const base = this.createBaseBook(props, index);
    const object = this.applyRuleConstraints(base, rule);
    return object && RuleEngine.evaluate(object, rule) ? object : null;
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
      return rule.rules.reduce((current, child) => current ? this.applyRuleConstraints(current, child) : null, book);
    }
    if (rule.type === 'or') {
      const branch = rule.rules?.find(Boolean);
      return branch ? this.applyRuleConstraints(book, branch) : null;
    }
    if (rule.type === 'not') return RuleEngine.evaluate(book, rule) ? book : null;
    if (BOOK_FIELDS.includes(rule.field) && rule.op === 'eq' && rule.value !== undefined) {
      return { ...book, [rule.field]: rule.value };
    }
    return RuleEngine.evaluate(book, rule) ? book : null;
  }
}
