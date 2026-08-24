export class BookSortDropValidator {
  canDrop(object, container, level) {
    if (!object || !container || !level || container.type === 'forbidden') return false;
    if (container.id === object.shelfId) return false;
    if (container.items.length >= level.capacity) return false;

    const source = level.containers.find(item => item.id === object.shelfId);
    if (!source || source.items[source.items.length - 1] !== object.uid) return false;

    if (container.items.length === 0) return true;
    const topId = container.items[container.items.length - 1];
    const topObject = level.objects.find(item => item.uid === topId);
    return Boolean(topObject && topObject.color === object.color);
  }
}
