const FIELD_NAMES = Object.freeze({ color: 'ЦВЕТ', size: 'РАЗМЕР', genre: 'ЖАНР', symbol: 'ЗНАК', thickness: 'ТОЛЩИНА' });

export function createSimpleRule(rng, fields, labels) {
  const field = rng.pick(fields);
  const keys = Object.keys(labels[field] || {});
  if (!keys.length) return null;
  const value = rng.pick(keys);
  return { field, op: 'eq', value, valueLabel: labels[field][value] };
}

export function createCombinedRule(rng, fields, labels) {
  const first = createSimpleRule(rng, fields, labels);
  const second = createSimpleRule(rng, fields, labels);
  if (!first || !second) return first || second;
  if (first.field === second.field && first.value === second.value) second.op = 'ne';
  return { type: 'and', rules: [first, second] };
}

export function createOrRule(rng, fields, labels) {
  const first = createSimpleRule(rng, fields, labels);
  const second = createSimpleRule(rng, fields, labels);
  if (!first || !second) return first || second;
  return { type: 'or', rules: [first, second] };
}

export function createNotRule(rng, fields, labels) {
  const rule = createSimpleRule(rng, fields, labels);
  return rule ? { type: 'not', rule } : null;
}

export function ruleLabel(rule) {
  if (!rule) return '';
  if (rule.type === 'and') return rule.rules.map(ruleLabel).join(' + ');
  if (rule.type === 'or') return rule.rules.map(ruleLabel).join(' / ');
  if (rule.type === 'not') return `НЕ ${ruleLabel(rule.rule)}`;
  const field = FIELD_NAMES[rule.field] || String(rule.field).toUpperCase();
  const value = String(rule.valueLabel ?? rule.value).toUpperCase();
  return rule.op === 'ne' ? `${field} ≠ ${value}` : `${field}: ${value}`;
}
