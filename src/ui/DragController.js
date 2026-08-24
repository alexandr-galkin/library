import { CleanupManager } from '../core/CleanupManager.js';
import { EventBus } from '../core/EventBus.js';
import { BookSortDropValidator } from '../input/BookSortDropValidator.js';
import { pointInRect } from '../input/DropValidator.js';

const DRAG_THRESHOLD = 5;

/** Pointer-event drag controller with atomic drag state and RAF throttling. */
export class DragController {
  constructor({ getLevel, isBlocked = () => false, sound = null, onDrop = () => {}, onWrong = () => {}, root = document, validator = new BookSortDropValidator(), eventBus = new EventBus() } = {}) {
    if (typeof getLevel !== 'function') throw new TypeError('DragController requires getLevel()');
    this.getLevel = getLevel; this.isBlocked = isBlocked; this.sound = sound; this.onDrop = onDrop; this.onWrong = onWrong; this.root = root; this.validator = validator; this.eventBus = eventBus; this.cleanup = new CleanupManager();
    this.isDragging = false; this.isPaused = false; this.pointerId = null; this.dragItem = null; this.dragEl = null; this.originalParent = null; this.originalNext = null; this.offsetX = 0; this.offsetY = 0; this.startX = 0; this.startY = 0; this.hasMoved = false; this.latestPointer = null; this.frameId = null;
    this.onDown = event => this.onPointerDown(event); this.onMove = event => this.onPointerMove(event); this.onUp = event => this.onPointerUp(event);
    this.cleanup.listen(this.root, 'pointerdown', this.onDown, { passive: false }); this.cleanup.listen(this.root, 'pointermove', this.onMove, { passive: false }); this.cleanup.listen(this.root, 'pointerup', this.onUp, { passive: false }); this.cleanup.listen(this.root, 'pointercancel', this.onUp, { passive: false }); this.cleanup.add(() => this.cancelFrame());
  }

  /** Pause input and cancel the active drag. */ pause() { this.isPaused = true; this.cancelDrag(); }
  /** Resume input. */ resume() { this.isPaused = false; }

  /** Start dragging only the top book of a shelf. */
  onPointerDown(event) {
    if (this.isPaused || this.isBlocked() || this.isDragging) return;
    const item = event.target.closest?.('.book-item'); if (!item || item.classList.contains('correct') || !item.classList.contains('top-book')) return;
    const level = this.getLevel(); const object = level?.objects?.find(({ uid }) => String(uid) === String(item.dataset.uid)); if (!object) return;
    const source = level.containers.find(container => container.id === object.shelfId); if (!source || source.items[0] !== object.uid) return;
    event.preventDefault(); const rect = item.getBoundingClientRect();
    this.dragItem = object; this.dragEl = item; this.originalParent = item.parentNode; this.originalNext = item.nextSibling; this.offsetX = event.clientX - rect.left; this.offsetY = event.clientY - rect.top; this.startX = event.clientX; this.startY = event.clientY; this.hasMoved = false; this.pointerId = event.pointerId ?? null; this.isDragging = true;
    item.classList.add('is-dragging'); item.style.position = 'fixed'; item.style.left = '0'; item.style.top = '0'; item.style.zIndex = '10000'; item.style.willChange = 'transform'; this.root.body?.appendChild(item); this.applyTransform(event.clientX, event.clientY);
    if (typeof item.setPointerCapture === 'function' && this.pointerId !== null) { try { item.setPointerCapture(this.pointerId); } catch { /* noop */ } }
    this.sound?.playPick(); this.eventBus.emit('drag:started', { object, pointerId: this.pointerId });
  }

  /** Queue pointer movement into one animation-frame update. */
  onPointerMove(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl || !this.ownsPointer(event)) return; event.preventDefault(); this.latestPointer = { x: event.clientX, y: event.clientY };
    const dx = event.clientX - this.startX; const dy = event.clientY - this.startY; if (!this.hasMoved && Math.hypot(dx, dy) > DRAG_THRESHOLD) this.hasMoved = true; if (this.frameId !== null) return;
    const request = this.root.defaultView?.requestAnimationFrame ?? requestAnimationFrame; this.frameId = request(() => this.flushPointerFrame());
  }

  /** Apply the latest pointer position and update highlights. */
  flushPointerFrame() { this.frameId = null; if (!this.isDragging || !this.dragEl || !this.latestPointer) return; const { x, y } = this.latestPointer; this.applyTransform(x, y); this.updateContainerHighlights(x, y); }

  /** Complete or cancel the current atomic drag transaction. */
  onPointerUp(event) {
    if (this.isPaused || !this.isDragging || !this.dragEl || !this.ownsPointer(event)) return; event.preventDefault();
    if (!this.hasMoved) { this.cancelDrag(); return; }
    const target = this.findTargetContainer(event.clientX, event.clientY); this.clearContainerHighlights(); const object = this.dragItem; const element = this.dragEl; const level = this.getLevel();
    if (target && this.validator.canDrop(object, target.container, level)) { this.finishVisualDrag(element); this.clearDragState(); this.onDrop(object, target.container, target.element); this.eventBus.emit('drag:ended', { object, target: target.container, accepted: true }); return; }
    this.onWrong?.(element); this.eventBus.emit('drag:ended', { object, target: target?.container ?? null, accepted: false }); this.cancelDrag();
  }

  /** @param {PointerEvent} event @returns {boolean} */ ownsPointer(event) { return this.pointerId === null || event.pointerId === undefined || event.pointerId === this.pointerId; }
  /** Move the dragged element using transform rather than per-frame left/top writes. */ applyTransform(clientX, clientY) { if (!this.dragEl) return; this.dragEl.style.transform = `translate3d(${clientX - this.offsetX}px, ${clientY - this.offsetY}px, 0)`; }

  /** Find the shelf currently underneath the pointer. */
  findTargetContainer(clientX, clientY) {
    const level = this.getLevel(); if (!level) return null; const hit = this.root.elementFromPoint?.(clientX, clientY)?.closest?.('.shelf-container');
    if (hit) { const container = level.containers.find(({ id }) => String(id) === String(hit.dataset.id)); if (container) return { container, element: hit }; }
    for (const element of this.root.querySelectorAll('.shelf-container')) { if (!pointInRect(clientX, clientY, element.getBoundingClientRect())) continue; const container = level.containers.find(({ id }) => String(id) === String(element.dataset.id)); if (container) return { container, element }; }
    return null;
  }

  /** Highlight the current drop target. */
  updateContainerHighlights(clientX, clientY) { const level = this.getLevel(); if (!level || !this.dragItem) return; const target = this.findTargetContainer(clientX, clientY); for (const element of this.root.querySelectorAll('.shelf-container')) element.classList.remove('highlight', 'reject'); if (target) target.element.classList.add(this.validator.canDrop(this.dragItem, target.container, level) ? 'highlight' : 'reject'); }
  /** Clear all drop target states. */ clearContainerHighlights() { this.root.querySelectorAll('.shelf-container').forEach(element => element.classList.remove('highlight', 'reject')); }

  /** Restore a successful drag element to normal DOM flow. */
  finishVisualDrag(element) { if (!element) return; this.releasePointer(); element.classList.remove('is-dragging'); element.style.position = ''; element.style.left = ''; element.style.top = ''; element.style.zIndex = ''; element.style.willChange = ''; element.style.transform = ''; if (this.originalParent && element.parentNode !== this.originalParent) this.originalParent.insertBefore(element, this.originalNext); }
  /** Cancel the active transaction and restore the DOM. */
  cancelDrag() { const element = this.dragEl; this.releasePointer(); this.cancelFrame(); if (element) this.finishVisualDrag(element); this.clearContainerHighlights(); this.clearDragState(); }
  /** Reset atomic drag state. */
  clearDragState() { this.isDragging = false; this.dragEl = null; this.dragItem = null; this.originalParent = null; this.originalNext = null; this.hasMoved = false; this.pointerId = null; this.latestPointer = null; }
  /** Release pointer capture if present. */
  releasePointer() { if (this.dragEl && this.pointerId !== null && typeof this.dragEl.releasePointerCapture === 'function') { try { this.dragEl.releasePointerCapture(this.pointerId); } catch { /* noop */ } } this.pointerId = null; }
  /** Cancel a pending RAF callback. */
  cancelFrame() { if (this.frameId === null) return; const cancel = this.root.defaultView?.cancelAnimationFrame ?? cancelAnimationFrame; cancel(this.frameId); this.frameId = null; }
  /** Destroy listeners and release all retained DOM references. */
  destroy() { this.cancelDrag(); this.cleanup.cleanup(); this.getLevel = null; this.isBlocked = () => true; this.onDrop = null; this.onWrong = null; this.sound = null; this.root = null; this.eventBus = null; }
}
