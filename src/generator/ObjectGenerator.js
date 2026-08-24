import { RuleEngine } from '../rules/RuleEngine.js';

export class ObjectGenerator {
  static generate(rng, count, theme, containers) {
    const props = theme.getAllBookProperties();
    const objects = [];
    const normalContainers = containers.filter(container => container.type !== 'forbidden');
    let attempts = 0;
    const maxAttempts = 2000;

    while (objects.length < count && attempts < maxAttempts) {
      attempts += 1;
      const object = this.createRandomBook(rng, props, objects.length);
      if (normalContainers.some(container => RuleEngine.evaluate(object, container.rule))) {
        objects.push(object);
      }
    }

    const mainRule = containers[0]?.rule;
    while (objects.length < count && attempts < maxAttempts * 2) {
      attempts += 1;
      const object = this.createRandomBook(rng, props, objects.length);
      if (!mainRule || RuleEngine.evaluate(object, mainRule)) objects.push(object);
    }

    while (objects.length < Math.min(2, count)) {
      const object = this.createBookFromRule(mainRule, props, objects.length);
      if (object) objects.push(object);
      else objects.push(this.createRandomBook(rng, props, objects.length));
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
    const base = {
      uid: `book_${index}`,
      type: 'book',
      color: props.colors[0],
      size: props.sizes[0],
      genre: props.genres[0],
      symbol: props.symbols[0],
      thickness: props.thicknesses[0],
    };

    if (!rule) return base;

    if (rule.field && rule.value !== undefined && Object.hasOwn(base, rule.field)) {
      return { ...base, [rule.field]: rule.value };
    }

    if (rule.type === 'and') {
      return rule.rules.reduce((book, child) => {
        if (child.field && child.value !== undefined && Object.hasOwn(book, child.field)) {
          return { ...book, [child.field]: child.value };
        }
        return book;
      }, base);
    }

    return RuleEngine.evaluate(base, rule) ? base : null;
  }
}
