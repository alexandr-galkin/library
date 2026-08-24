import { RuleEngine } from '../rules/RuleEngine.js';

export class LevelValidator {
  static validate(level) {
    if (!this.validateBasicStructure(level)) return false;
    const normalContainers = level.containers.filter(container => container.type !== 'forbidden');
    if (normalContainers.length === 0) return false;

    if (level.objects.some(object => !normalContainers.some(container => RuleEngine.evaluate(object, container.rule)))) return false;
    if (normalContainers.some(container => !level.objects.some(object => RuleEngine.evaluate(object, container.rule)))) return false;
    return true;
  }

  static validateBasicStructure(level) {
    if (!level || typeof level !== 'object' || Array.isArray(level)) return false;
    if (!Array.isArray(level.objects) || level.objects.length === 0) return false;
    if (!Array.isArray(level.containers) || level.containers.length < 2) return false;
    if (!level.objects.every(object => object && typeof object === 'object' && typeof object.uid === 'string' && object.uid.length > 0)) return false;
    if (!level.containers.every(container => container && typeof container === 'object' && typeof container.id === 'string' && container.id.length > 0 && container.rule)) return false;
    return new Set(level.containers.map(container => container.id)).size === level.containers.length;
  }
}
