export class BookSortDropValidator {
  canDrop(object, container, level) {
    if (!object || !container || !level || container.type === 'forbidden') return false;
    if (container.id === object.shelfId) return false;
    if (container.items.length >= level.capacity) return false;

    const source = level.containers.find(item => item.id === object.shelfId);
    if (!source || source.items[0] !== object.uid) return false;

    // Если на полке есть свободное место — книгу можно положить независимо от цвета.
    return true;
  }
}
