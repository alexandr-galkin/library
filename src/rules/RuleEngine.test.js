import { describe, expect, it } from 'vitest';
import { RuleEngine } from './RuleEngine.js';

describe('RuleEngine', () => {
  const book = { color: 'red', title: 'Clean Code', pages: 464 };

  it('evaluates primitive comparisons', () => {
    expect(RuleEngine.evaluate(book, { field: 'color', op: 'eq', value: 'red' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'pages', op: 'gt', value: 400 })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'pages', op: 'lte', value: 400 })).toBe(false);
  });

  it('evaluates collections and strings', () => {
    expect(RuleEngine.evaluate(book, { field: 'color', op: 'in', values: ['blue', 'red'] })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'color', op: 'nin', values: ['blue'] })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'contains', value: 'Clean' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'startsWith', value: 'Clean' })).toBe(true);
    expect(RuleEngine.evaluate(book, { field: 'title', op: 'endsWith', value: 'Code' })).toBe(true);
  });

  it('evaluates nested boolean rules', () => {
    expect(RuleEngine.evaluate(book, {
      type: 'and',
      rules: [
        { field: 'color', op: 'eq', value: 'red' },
        { field: 'pages', op: 'gt', value: 400 },
      ],
    })).toBe(true);

    expect(RuleEngine.evaluate(book, {
      type: 'not',
      rule: { field: 'color', op: 'eq', value: 'blue' },
    })).toBe(true);
  });

  it('rejects malformed rules', () => {
    expect(RuleEngine.validateRule(null)).toBe(false);
    expect(RuleEngine.validateRule({ field: 'color', op: 'in' })).toBe(false);
    expect(RuleEngine.validateRule({ type: 'and', rules: [] })).toBe(false);
  });
});
