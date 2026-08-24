import { RuleEngine } from '../rules/RuleEngine.js';

export class DropValidator {
  constructor({ evaluate = RuleEngine.evaluate } = {}) {
    this.evaluate = evaluate;
  }

  canDrop(object, container) {
    if (!object || !container || container.type === 'forbidden') return false;
    return Boolean(this.evaluate(object, container.rule));
  }
}

export function pointInRect(x, y, rect) {
  return Number.isFinite(x) && Number.isFinite(y)
    && x >= rect.left && x <= rect.right
    && y >= rect.top && y <= rect.bottom;
}
