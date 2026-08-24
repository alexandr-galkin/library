import { RuleEngine } from '../rules/RuleEngine.js';

const DEFAULT_ROOT = () => document;

export class DragController {
  constructor({
    getLevel,
    isBlocked = () => false,
    sound = null,
    onCorrect = () => {},
    onWrong = () => {},
    root = DEFAULT_ROOT(),
  }) {
    this.getLevel = getLevel;
    this.isBlocked = isBlocked;
    this.sound = sound;
    this.onCorrect = onCorrect;
    this.onWrong = onWrong;
    this.root = root;

    this.dragItem = null;
    this.dragEl = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.originalParent = null;
    this.originalNext = null;
    this.isDragging = false;
    this.isPaused = false;
    this.startX = 0;
    this.startY = 0;
    this.hasMoved = false;

    this.onDown = this.onPointerDown.bind(this);
    this.onMove = this.onPointerMove.bind(this);
    this.onUp = this.onPointerUp.bind(this);

    this.root.addEventListener('pointerdown', this.onDown);
    this.root.addEventListener('pointermove', this.onMove);
    this.root.addEventListener('pointerup', this.onUp);
    this.root.addEventListener('pointercancel', this.onUp);
  }

  pause() {
    this.isPaused = true;
    if (this.isDragging) this.cancelDrag();
  }

  resume() {
    this.isPaused = false;
  }

  getLevel() {
    return this.getLevel?.() ?? null;
  }

  cancelDrag() {
    if (this.dragEl) {
      this.dragEl.classList.remove('dragging');
      this.dragEl.style.left = '';
      this.dragEl.style.top = '';

      if (this.originalParent && this.dragEl.parentNode !== this.originalParent) {
        this.originalParent.insertBefore(this.dragEl, this.originalNext);
      }
    }

    this.clearContainerHighlights();
    this.isDragging = false;
    this.dragEl = null;
    this.dragItem = null;
    this.originalParent = null;
    this.originalNext = null;
  }

  onPointerDown(event) {
    if (this.isPaused || this.isBlocked()) return;

    const item = event.target.closest('.book-item');
    if (!item || item.classList.contains('correct')) return;

    const level = this.getLevel();
    const object = level?.objects?.find(({ uid }) => uid === item.dataset.uid);
    if (!object) return;

    event.preventDefault();

    this.dragItem = object;
    this.dragEl = item;
    this.originalParent = item.parentNode;
    this.originalNext = item.nextSibling;

    const rect = item.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.hasMoved = false;
    this.isDragging = true;

    item.classList.add('dragging');
    document.body.appendChild(item);
    this.updatePosition(event.clientX, event.clientY);
    this.sound?.playPick();
  }

  onPointerMove(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl) return;

    event.preventDefault();

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    if (!this.hasMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      this.hasMoved = true;
    }

    this.updatePosition(event.clientX, event.clientY);
    this.updateContainerHighlights(event.clientX, event.clientY);
  }

  onPointerUp(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl) return;

    event.preventDefault();

    if (!this.hasMoved) {
      this.cancelDrag();
      return;
    }

    const target = this.findTargetContainer(event.clientX, event.clientY);
    this.clearContainerHighlights();

    if (target && target.container.type !== 'forbidden' && RuleEngine.evaluate(this.dragItem, target.container.rule)) {
      const item = this.dragItem;
      const element = this.dragEl;
      this.clearDragState();
      this.onCorrect(item, element, target.element);
      return;
    }

    const element = this.dragEl;
    this.onWrong(element);
    this.cancelDrag();
  }

  clearDragState() {
    this.isDragging = false;
    this.dragEl = null;
    this.dragItem = null;
    this.originalParent = null;
    this.originalNext = null;
  }

  updatePosition(clientX, clientY) {
    if (!this.dragEl) return;
    this.dragEl.style.left = `${clientX - this.offsetX}px`;
    this.dragEl.style.top = `${clientY - this.offsetY}px`;
  }

  updateContainerHighlights(clientX, clientY) {
    this.root.querySelectorAll('.shelf-container').forEach(containerEl => {
      containerEl.classList.remove('highlight', 'reject');

      const rect = containerEl.getBoundingClientRect();
      if (!this.isPointInRect(clientX, clientY, rect)) return;

      const level = this.getLevel();
      const container = level?.containers?.find(({ id }) => id === containerEl.dataset.id);
      if (!container) return;

      if (container.type === 'forbidden') {
        containerEl.classList.add('reject');
      } else if (RuleEngine.evaluate(this.dragItem, container.rule)) {
        containerEl.classList.add('highlight');
      } else {
        containerEl.classList.add('reject');
      }
    });
  }

  clearContainerHighlights() {
    this.root.querySelectorAll('.shelf-container').forEach(containerEl => {
      containerEl.classList.remove('highlight', 'reject');
    });
  }

  findTargetContainer(clientX, clientY) {
    const level = this.getLevel();
    if (!level) return null;

    for (const element of this.root.querySelectorAll('.shelf-container')) {
      if (!this.isPointInRect(clientX, clientY, element.getBoundingClientRect())) continue;

      const container = level.containers.find(({ id }) => id === element.dataset.id);
      if (container) return { container, element };
    }

    return null;
  }

  isPointInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  destroy() {
    this.root.removeEventListener('pointerdown', this.onDown);
    this.root.removeEventListener('pointermove', this.onMove);
    this.root.removeEventListener('pointerup', this.onUp);
    this.root.removeEventListener('pointercancel', this.onUp);
    this.cancelDrag();
  }
}
