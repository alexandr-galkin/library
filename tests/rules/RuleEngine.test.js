import { describe, expect, it } from 'vitest';
import { RuleEngine } from '../../src/rules/RuleEngine.js';

describe('RuleEngine', () => {
  const book = {
    color: 'red',
    genre: 'fantasy',
    title: 'The Hobbit',
    year: 1937,
  };

  it('evaluates scalar comparisons', () => {
    expect(RuleEngine.evaluate(book, { field: 'color', op: 'eq', value: 'red' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'year', op: 'gt', value: 1900 })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'year', op: 'lt', value: 1900 })).toBe(false);
  });

  it('evaluates collection and string operators', () => {
    expect(RuleEngine.evaluate(book, { field: 'color', op: 'in', values: ['blue', 'red'] })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'genre', op: 'nin', values: ['horror'] })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'contains', value: 'Hob' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'startsWith', value: 'The' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'endsWith', value: 'bit' })).toBe(true);
  });

  it('evaluates compound rules', () => {
    expect(RuleEngine.evaluate(book, {
      type: 'and',
      rules: [
        { field: 'color', op: 'eq', value: 'red' },
        { field: 'year', op: 'gte', value: 1937 },
      ],
    })).toBe(true);

    expect(RuleEngine.evaluate(book, {
      type: 'or',
      rules: [
        { field: 'color', op: 'eq', value: 'blue' },
        { field: 'genre', op: 'eq', value: 'fantasy' },
      ],
    })).toBe(true);

    expect(RuleEngine.evaluate(book, {
      type: 'not',
      rule: { field: 'color', op: 'eq', value: 'blue' },
    })).toBe(true);
  });

  it('rejects malformed rules', () => {
    expect(RuleEngine.validateRule(null)).toBe(false);
    expect(RuleEngine.validateRule({ field: 'color' })).toBe(false);
    expect(RuleEngine.validateRule({ field: 'color', op: 'in', values: [] })).toBe(false);
  });
});
