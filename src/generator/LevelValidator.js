export class LevelValidator {
  static validate(level) {
    if (!this.validateBasicStructure(level)) return false;
    const normal = level.containers.filter(container => container.type !== 'empty');
    const empty = level.containers.filter(container => container.type === 'empty');
    if (empty.length < 1) return false;
    if (level.mode !== 'book-sort' || level.capacity !== 4) return false;

    const counts = new Map();
    for (const object of level.objects) counts.set(object.color, (counts.get(object.color) ?? 0) + 1);
    if (counts.size !== level.colorCount) return false;
    if ([...counts.values()].some(count => count !== level.capacity)) return false;
    if (normal.length !== level.colorCount) return false;
    if (level.objects.some(object => !level.containers.some(container => container.id === object.shelfId))) return false;
    if (level.containers.some(container => container.items.length > level.capacity)) return false;
    return true;
  }

  static validateBasicStructure(level) {
    if (!level || typeof level !== 'object' || Array.isArray(level)) return false;
    if (!Array.isArray(level.objects) || !level.objects.length) return false;
    if (!Array.isArray(level.containers) || level.containers.length < 3 || level.containers.length > 8) return false;
    if (!Array.isArray(level.colors) || level.colors.length < 3 || level.colors.length > 8) return false;
    if (!level.objects.every(object => this.validateObject(object))) return false;
    if (!level.containers.every(container => this.validateContainer(container))) return false;
    if (new Set(level.objects.map(object => object.uid)).size !== level.objects.length) return false;
    if (new Set(level.containers.map(container => container.id)).size !== level.containers.length) return false;
    return true;
  }

  static validateObject(object) {
    return Boolean(object && typeof object.uid === 'string' && object.uid && typeof object.color === 'string' && typeof object.shelfId === 'string');
  }

  static validateContainer(container) {
    return Boolean(container && typeof container.id === 'string' && container.id && Number.isInteger(container.capacity) && container.capacity === 4 && Array.isArray(container.items));
  }
}
