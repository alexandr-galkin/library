import { DropValidator, pointInRect } from './DropValidator.js';

const DRAG_THRESHOLD = 5;

export class DragController {
  constructor({ getLevel, isBlocked = () => false, sound = null, onCorrect = () => {}, onWrong = () => {}, root = document, validator = new DropValidator() } = {}) {
    if (typeof getLevel !== 'function') throw new TypeError('DragController requires getLevel()');
    this.getLevel = getLevel;
    this.isBlocked = isBlocked;
    this.sound = sound;
    this.onCorrect = onCorrect;
    this.onWrong = onWrong;
    this.root = root;
    this.validator = validator;
    this.dragItem = null;
    this.dragEl = null;
    this.originalParent = null;
    this.originalNext = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.startX = 0;
    this.startY = 0;
    this.isDragging = false;
    this.isPaused = false;
    this.hasMoved = false;
    this.pointerId = null;
    this.onDown = event => this.onPointerDown(event);
    this.onMove = event => this.onPointerMove(event);
    this.onUp = event => this.onPointerUp(event);
    this.root.addEventListener('pointerdown', this.onDown);
    this.root.addEventListener('pointermove', this.onMove);
    this.root.addEventListener('pointerup', this.onUp);
    this.root.addEventListener('pointercancel', this.onUp);
  }

  pause() { this.isPaused = true; this.cancelDrag(); }
  resume() { this.isPaused = false; }

  onPointerDown(event) {
    if (this.isPaused || this.isBlocked()) return;
    const item = event.target.closest?.('.book-item');
    if (!item || item.classList.contains('correct')) return;
    const object = this.getLevel()?.objects?.find(({ uid }) => uid === item.dataset.uid);
    if (!object) return;
    event.preventDefault();
    const rect = item.getBoundingClientRect();
    this.dragItem = object;
    this.dragEl = item;
    this.originalParent = item.parentNode;
    this.originalNext = item.nextSibling;
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.hasMoved = false;
    this.pointerId = event.pointerId ?? null;
    this.isDragging = true;
    item.classList.add('dragging');
    if (typeof item.setPointerCapture === 'function' && this.pointerId !== null) {
      try { item.setPointerCapture(this.pointerId); } catch { /* pointer may already be released */ }
    }
    this.root.body?.appendChild(item);
    this.updatePosition(event.clientX, event.clientY);
    this.sound?.playPick();
  }

  onPointerMove(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl || !this.ownsPointer(event)) return;
    event.preventDefault();
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    if (!this.hasMoved && Math.hypot(dx, dy) > DRAG_THRESHOLD) this.hasMoved = true;
    this.updatePosition(event.clientX, event.clientY);
    this.updateContainerHighlights(event.clientX, event.clientY);
  }

  onPointerUp(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl || !this.ownsPointer(event)) return;
    event.preventDefault();
    if (!this.hasMoved) return this.cancelDrag();
    const target = this.findTargetContainer(event.clientX, event.clientY);
    this.clearContainerHighlights();
    if (target && this.validator.canDrop(this.dragItem, target.container)) {
      const item = this.dragItem;
      const element = this.dragEl;
      this.releasePointer();
      this.clearDragState();
      this.onCorrect(item, element, target.element);
      return;
    }
    const element = this.dragEl;
    this.onWrong(element);
    this.cancelDrag();
  }

  ownsPointer(event) {
    return this.pointerId === null || event.pointerId === undefined || event.pointerId === this.pointerId;
  }

  releasePointer() {
    if (this.dragEl && this.pointerId !== null && typeof this.dragEl.releasePointerCapture === 'function') {
      try { this.dragEl.releasePointerCapture(this.pointerId); } catch { /* pointer may already be released */ }
    }
    this.pointerId = null;
  }

  cancelDrag() {
    const element = this.dragEl;
    this.releasePointer();
    if (element) {
      element.classList.remove('dragging');
      element.style.left = '';
      element.style.top = '';
      if (this.originalParent && element.parentNode !== this.originalParent) this.originalParent.insertBefore(element, this.originalNext);
    }
    this.clearContainerHighlights();
    this.clearDragState();
  }

  clearDragState() {
    this.isDragging = false;
    this.dragEl = null;
    this.dragItem = null;
    this.originalParent = null;
    this.originalNext = null;
    this.hasMoved = false;
    this.pointerId = null;
  }

  updatePosition(clientX, clientY) {
    if (!this.dragEl) return;
    this.dragEl.style.left = `${clientX - this.offsetX}px`;
    this.dragEl.style.top = `${clientY - this.offsetY}px`;
  }

  updateContainerHighlights(clientX, clientY) {
    const level = this.getLevel();
    if (!level || !this.dragItem) return;
    for (const element of this.root.querySelectorAll('.shelf-container')) {
      element.classList.remove('highlight', 'reject');
      if (!pointInRect(clientX, clientY, element.getBoundingClientRect())) continue;
      const container = level.containers.find(({ id }) => id === element.dataset.id);
      if (container) element.classList.add(this.validator.canDrop(this.dragItem, container) ? 'highlight' : 'reject');
    }
  }

  clearContainerHighlights() {
    this.root.querySelectorAll('.shelf-container').forEach(element => element.classList.remove('highlight', 'reject'));
  }

  findTargetContainer(clientX, clientY) {
    const level = this.getLevel();
    if (!level) return null;
    for (const element of this.root.querySelectorAll('.shelf-container')) {
      if (!pointInRect(clientX, clientY, element.getBoundingClientRect())) continue;
      const container = level.containers.find(({ id }) => id === element.dataset.id);
      if (container) return { container, element };
    }
    return null;
  }

  destroy() {
    this.cancelDrag();
    this.root.removeEventListener('pointerdown', this.onDown);
    this.root.removeEventListener('pointermove', this.onMove);
    this.root.removeEventListener('pointerup', this.onUp);
    this.root.removeEventListener('pointercancel', this.onUp);
    this.getLevel = null;
    this.isBlocked = () => true;
    this.onCorrect = null;
    this.onWrong = null;
  }
}
