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
    const object = this.getLevel()?.objects?.find(({ uid }) => String(uid) === String(item.dataset.uid));
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
      try { item.setPointerCapture(this.pointerId); } catch { /* already captured */ }
    }
    // Fixed positioning makes the book independent from the layout while dragging.
    item.style.position = 'fixed';
    item.style.zIndex = '10000';
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
    const element = this.dragEl;

    if (target && this.validator.canDrop(this.dragItem, target.container)) {
      const item = this.dragItem;
      const containerElement = target.element;
      this.releasePointer();
      // Restore the element before handing it to Game/GameUI. This prevents the
      // old fixed-position drag state from surviving the successful drop.
      this.restoreElementToOrigin(element);
      this.clearDragState();
      this.onCorrect(item, element, containerElement);
      return;
    }

    this.onWrong(element);
    this.cancelDrag();
  }

  ownsPointer(event) {
    return this.pointerId === null || event.pointerId === undefined || event.pointerId === this.pointerId;
  }

  releasePointer() {
    if (this.dragEl && this.pointerId !== null && typeof this.dragEl.releasePointerCapture === 'function') {
      try { this.dragEl.releasePointerCapture(this.pointerId); } catch { /* already released */ }
    }
    this.pointerId = null;
  }

  restoreElementToOrigin(element) {
    if (!element) return;
    element.classList.remove('dragging');
    element.style.position = '';
    element.style.zIndex = '';
    element.style.left = '';
    element.style.top = '';
    if (this.originalParent && element.parentNode !== this.originalParent) {
      this.originalParent.insertBefore(element, this.originalNext);
    }
  }

  cancelDrag() {
    const element = this.dragEl;
    this.releasePointer();
    this.restoreElementToOrigin(element);
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

  findTargetContainer(clientX, clientY) {
    const level = this.getLevel();
    if (!level) return null;
    const hit = this.root.elementFromPoint?.(clientX, clientY)?.closest?.('.shelf-container');
    if (hit) {
      const container = level.containers.find(({ id }) => String(id) === String(hit.dataset.id));
      if (container) return { container, element: hit };
    }
    for (const element of this.root.querySelectorAll('.shelf-container')) {
      if (!pointInRect(clientX, clientY, element.getBoundingClientRect())) continue;
      const container = level.containers.find(({ id }) => String(id) === String(element.dataset.id));
      if (container) return { container, element };
    }
    return null;
  }

  updateContainerHighlights(clientX, clientY) {
    const level = this.getLevel();
    if (!level || !this.dragItem) return;
    const target = this.findTargetContainer(clientX, clientY);
    for (const element of this.root.querySelectorAll('.shelf-container')) element.classList.remove('highlight', 'reject');
    if (target) target.element.classList.add(this.validator.canDrop(this.dragItem, target.container) ? 'highlight' : 'reject');
  }

  clearContainerHighlights() {
    this.root.querySelectorAll('.shelf-container').forEach(element => element.classList.remove('highlight', 'reject'));
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
