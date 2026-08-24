import { RuleEngine } from '../rules/RuleEngine.js';

export class DragController {
  constructor(game) {
    this.game = game;
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

    document.addEventListener('pointerdown', this.onDown);
    document.addEventListener('pointermove', this.onMove);
    document.addEventListener('pointerup', this.onUp);
    document.addEventListener('pointercancel', this.onUp);
  }

  pause() {
    this.isPaused = true;

    if (this.isDragging) {
      this.cancelDrag();
    }
  }

  resume() {
    this.isPaused = false;
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
  }

  onPointerDown(e) {
    if (this.isPaused || this.game.isTransitioning) return;

    const item = e.target.closest('.book-item');
    if (!item || item.classList.contains('correct')) return;

    e.preventDefault();

    this.dragItem = this.game.currentLevel.objects.find(o => o.uid === item.dataset.uid);
    if (!this.dragItem) return;

    this.dragEl = item;
    this.originalParent = item.parentNode;
    this.originalNext = item.nextSibling;

    const rect = item.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;

    this.startX = e.clientX;
    this.startY = e.clientY;
    this.hasMoved = false;
    this.isDragging = true;

    item.classList.add('dragging');
    document.body.appendChild(item);

    this.updatePosition(e.clientX, e.clientY);

    this.game.sound.playPick();
  }

  onPointerMove(e) {
    if (this.isPaused || !this.isDragging || !this.dragEl) return;

    e.preventDefault();

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (!this.hasMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      this.hasMoved = true;
    }

    this.updatePosition(e.clientX, e.clientY);
    this.updateContainerHighlights(e.clientX, e.clientY);
  }

  onPointerUp(e) {
    if (this.isPaused || !this.isDragging || !this.dragEl) return;

    e.preventDefault();

    if (!this.hasMoved) {
      this.cancelDrag();
      return;
    }

    const targetContainer = this.findTargetContainer(e.clientX, e.clientY);

    this.clearContainerHighlights();

    if (
      targetContainer &&
      targetContainer.container.type !== 'forbidden' &&
      RuleEngine.evaluate(this.dragItem, targetContainer.container.rule)
    ) {
      this.game.handleCorrect(this.dragItem, this.dragEl, targetContainer.element);
    } else {
      this.game.handleWrong(this.dragEl);
      this.cancelDrag();
    }

    this.isDragging = false;
    this.dragEl = null;
    this.dragItem = null;
  }

  updatePosition(clientX, clientY) {
    if (!this.dragEl) return;

    this.dragEl.style.left = (clientX - this.offsetX) + 'px';
    this.dragEl.style.top = (clientY - this.offsetY) + 'px';
  }

  updateContainerHighlights(clientX, clientY) {
    document.querySelectorAll('.shelf-container').forEach(containerEl => {
      containerEl.classList.remove('highlight', 'reject');

      const rect = containerEl.getBoundingClientRect();
      if (this.isPointInRect(clientX, clientY, rect)) {
        const container = this.game.currentLevel.containers.find(
          c => c.id === containerEl.dataset.id
        );

        if (container) {
          if (container.type === 'forbidden') {
            containerEl.classList.add('reject');
          } else if (RuleEngine.evaluate(this.dragItem, container.rule)) {
            containerEl.classList.add('highlight');
          } else {
            containerEl.classList.add('reject');
          }
        }
      }
    });
  }

  clearContainerHighlights() {
    document.querySelectorAll('.shelf-container').forEach(containerEl => {
      containerEl.classList.remove('highlight', 'reject');
    });
  }

  findTargetContainer(clientX, clientY) {
    for (const containerEl of document.querySelectorAll('.shelf-container')) {
      const rect = containerEl.getBoundingClientRect();
      if (this.isPointInRect(clientX, clientY, rect)) {
        const container = this.game.currentLevel.containers.find(
          c => c.id === containerEl.dataset.id
        );
        if (container) {
          return { container, element: containerEl };
        }
      }
    }
    return null;
  }

  isPointInRect(x, y, rect) {
    return x >= rect.left && x <= rect.right &&
      y >= rect.top && y <= rect.bottom;
  }

  destroy() {
    document.removeEventListener('pointerdown', this.onDown);
    document.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerup', this.onUp);
    document.removeEventListener('pointercancel', this.onUp);

    if (this.dragEl) {
      this.cancelDrag();
    }
  }
}
