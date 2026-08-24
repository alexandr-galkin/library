import { RuleEngine } from '../rules/RuleEngine.js';

export class LevelValidator {
  static validate(level) {
    if (!this.validateBasicStructure(level)) return false;

    const normalContainers = level.containers.filter(container => container.type !== 'forbidden');
    if (normalContainers.length < 2) return false;

    const validObjects = level.objects.filter(object => normalContainers.some(container => RuleEngine.evaluate(object, container.rule)));
    if (validObjects.length !== level.objects.length) return false;

    // Every normal container must have at least one matching object.
    if (normalContainers.some(container => !level.objects.some(object => RuleEngine.evaluate(object, container.rule)))) return false;

    // At least one object must belong to exactly one container. Without this,
    // a level can be technically valid but ambiguous to the player.
    if (!level.objects.some(object => this.matchCount(object, normalContainers) === 1)) return false;

    return true;
  }

  static matchCount(object, containers) {
    return containers.reduce((count, container) => count + (RuleEngine.evaluate(object, container.rule) ? 1 : 0), 0);
  }

  static validateBasicStructure(level) {
    if (!level || typeof level !== 'object' || Array.isArray(level)) return false;
    if (!Array.isArray(level.objects) || level.objects.length === 0) return false;
    if (!Array.isArray(level.containers) || level.containers.length < 2) return false;
    if (!level.objects.every(object => this.validateObject(object))) return false;
    if (!level.containers.every(container => this.validateContainer(container))) return false;
    if (new Set(level.objects.map(object => object.uid)).size !== level.objects.length) return false;
    if (new Set(level.containers.map(container => container.id)).size !== level.containers.length) return false;
    return true;
  }

  static validateObject(object) {
    return Boolean(object && typeof object === 'object' && !Array.isArray(object)
      && typeof object.uid === 'string' && object.uid.length > 0);
  }

  static validateContainer(container) {
    if (!container || typeof container !== 'object' || Array.isArray(container)) return false;
    if (typeof container.id !== 'string' || container.id.length === 0) return false;
    if (container.type === 'forbidden') return true;
    return Boolean(container.rule && RuleEngine.validateRule(container.rule));
  }
}
