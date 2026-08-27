import { describe, expect, it } from 'vitest';
import { getLiteraryFactForLevel, literaryFacts } from './LiteraryFacts.js';

describe('LiteraryFacts', () => {
  it('keeps the agreed amount of facts', () => {
    expect(literaryFacts).toHaveLength(70);
  });

  it('cycles facts after the last entry', () => {
    expect(getLiteraryFactForLevel(1, 'ru')).toBe(literaryFacts[0].ru);
    expect(getLiteraryFactForLevel(70, 'ru')).toBe(literaryFacts[69].ru);
    expect(getLiteraryFactForLevel(71, 'ru')).toBe(literaryFacts[0].ru);
  });

  it('falls back to Russian facts for unknown locales', () => {
    expect(getLiteraryFactForLevel(2, 'unknown')).toBe(literaryFacts[1].ru);
  });
});
