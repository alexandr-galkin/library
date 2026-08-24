import { EventBus } from '../core/EventBus.js';
import { GameSession } from './GameSession.js';
import { ScoreCalculator } from '../core/ScoreCalculator.js';
import { GameRenderer } from '../ui/GameRenderer.js';
import { DragController } from '../ui/DragController.js';

/** Coordinates state, levels, renderer and input without owning application UI. */
export class GameEngine {
  constructor({ app, documentRef = document, windowRef = globalThis, state, stats, timer, sound, particles, levelManager, theme, layoutManager, eventBus = new EventBus(), actions = {} } = {}) {
    if (!app || !state || !stats || !timer || !sound || !levelManager || !theme || !layoutManager) throw new TypeError('GameEngine requires app, state, stats, timer, sound, levelManager, theme and layoutManager');
    this.app = app; this.document = documentRef; this.window = windowRef; this.state = state; this.stats = stats; this.timer = timer; this.sound = sound; this.particles = particles; this.levelManager = levelManager; this.theme = theme; this.layoutManager = layoutManager; this.eventBus = eventBus; this.actions = actions;
    this.renderer = null; this.drag = null; this.history = []; this.completionTimeout = null; this.wrongTimeout = null;
    this.session = new GameSession({ state, stats, timer, sound, generateLevel: level => this.levelManager.generate(level), onLevelLoaded: level => this.mountLevel(level), onComplete: level => this.finishLevel(level), onFail: () => this.renderer?.showFail() });
  }

  /** Current level model. */ get level() { return this.session.level; }
  /** Total score. */ get score() { return this.stats.totalScore; }
  /** Current level score. */ get levelScore() { return this.stats.levelScore; }
  /** Whether the game is paused. */ get isPaused() { return this.session.isPaused; }
  /** Whether a transition is active. */ get isTransitioning() { return this.session.transitioning; }
  /** Whether the game session is active. */ get isActive() { return this.session.active; }
  /** Whether the game is currently accepting moves. */ get isPlaying() { return this.session.isPlaying; }

  /** Start the current saved level. */ start() { this.sound.init(); return this.session.start(); }
  /** Retry the current level. */ retry() { return this.session.retry(); }
  /** Advance to the next level. */ next() { return this.session.next(); }
  /** Pause gameplay. */ pause() { if (this.session.pause()) { this.drag?.pause(); this.eventBus.emit('game:paused'); return true; } return false; }
  /** Resume gameplay. */ resume() { if (this.session.resume()) { this.drag?.resume(); this.renderer?.hidePauseMenu(); this.eventBus.emit('game:resumed'); return true; } return false; }

  /** Mount renderer and input for a freshly generated level. */
  mountLevel(level) {
    this.cleanupLevel(); this.history = []; this.layoutManager.updateShelfCount(level.containers.length);
    this.renderer = new GameRenderer({ app: this.app, theme: this.theme, documentRef: this.document, actions: {
      onPause: () => { this.pause(); this.renderer?.showPauseMenu(); }, onUndo: () => this.undoMove(), onRetry: () => this.retry(), onResume: () => this.resume(), onSettings: () => this.actions.onSettings?.(), onMenu: () => this.actions.onMenu?.(),
    } });
    this.drag = new DragController({ getLevel: () => this.level, isBlocked: () => this.isTransitioning || this.isPaused || !this.isPlaying, sound: this.sound, root: this.document, onDrop: (object, container, element) => this.handleDrop(object, container, element), onWrong: element => this.handleWrong(element), eventBus: this.eventBus });
    this.renderer.updateHUD(level.id, level.difficulty, this.score, level.moves); this.renderer.setRule(level.ruleText, this.theme.displayName); this.renderer.renderContainers(level.containers, level.objects); this.eventBus.emit('level:started', level);
  }

  /** Apply one validated move atomically to the level model. */
  handleDrop(object, target, targetElement) {
    if (!this.isPlaying || this.isTransitioning || this.isPaused || !object || !target) return false;
    const level = this.level; const source = level.containers.find(container => container.id === object.shelfId);
    if (!source || target.items.length >= level.capacity || source.items[0] !== object.uid) return false;
    source.items = source.items.filter(uid => uid !== object.uid); target.items.unshift(object.uid); object.shelfId = target.id; object.depth = 0;
    const points = Math.max(1, 100 - level.moves * 2); this.history.push({ sourceId: source.id, targetId: target.id, objectId: object.uid, points }); level.moves += 1; this.stats.addCorrect(points);
    this.renderer.renderContainers(level.containers, level.objects); this.renderer.updateHUD(level.id, level.difficulty, this.score, level.moves);
    const rect = targetElement?.getBoundingClientRect(); if (rect) { this.particles?.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, '#c9a227', 8); this.renderer.showPopup(rect.left + rect.width / 2, rect.top, `ХОД ${level.moves}`); }
    this.sound.playCorrect(); this.eventBus.emit('game:changed', { type: 'move', object, source, target, moves: level.moves });
    if (this.isSolved(level) && this.session.markCompleting()) { this.eventBus.emit('level:completed', level); this.completionTimeout = this.window.setTimeout(() => this.session.complete(), 500); }
    return true;
  }

  /** Animate a rejected drop without changing game state. */
  handleWrong(element) {
    if (!element) return; if (this.wrongTimeout) this.window.clearTimeout(this.wrongTimeout); element.classList.remove('shake'); void element.offsetWidth; element.classList.add('shake'); this.wrongTimeout = this.window.setTimeout(() => { element.classList.remove('shake'); this.wrongTimeout = null; }, 400);
  }

  /** Undo the latest move. */
  undoMove() {
    if (!this.isPlaying || this.isTransitioning || !this.history.length) return false; const level = this.level; if (this.isSolved(level)) return false;
    const move = this.history.pop(); const object = level.objects.find(item => item.uid === move.objectId); const source = level.containers.find(container => container.id === move.sourceId); const target = level.containers.find(container => container.id === move.targetId);
    if (!object || !source || !target) { this.history.push(move); return false; }
    target.items = target.items.filter(uid => uid !== object.uid); source.items.unshift(object.uid); object.shelfId = source.id; object.depth = 0; level.moves = Math.max(0, level.moves - 1); this.stats.undoCorrect(move.points);
    this.renderer.renderContainers(level.containers, level.objects); this.renderer.updateHUD(level.id, level.difficulty, this.score, level.moves); this.sound.playPick(); this.eventBus.emit('game:changed', { type: 'undo', object, source, target, moves: level.moves }); return true;
  }

  /** Determine whether every non-empty shelf is complete and monochromatic. */
  isSolved(level) { return level.containers.every(container => { if (container.items.length === 0) return true; if (container.items.length !== level.capacity) return false; const colors = container.items.map(uid => level.objects.find(object => object.uid === uid)?.color); return colors.every(color => color && color === colors[0]); }); }

  /** Finalize the level and preserve the existing score calculation. */
  finishLevel(level) { this.sound.playLevelComplete(); const moveBonus = ScoreCalculator.timeBonus(Math.max(0, 120 - level.moves), true); this.stats.addBonus(moveBonus); this.state.data.totalScore = this.score; this.state.data.bestScore = Math.max(this.state.data.bestScore, this.score); this.state.save(); this.particles?.emit(this.window.innerWidth / 2, this.window.innerHeight / 2, '#e8d48b', 30); this.actions.onLevelComplete?.(level.id, this.levelScore, moveBonus); this.completionTimeout = null; }

  /** Remove all level-specific resources. */
  cleanupLevel() { if (this.completionTimeout) this.window.clearTimeout(this.completionTimeout); if (this.wrongTimeout) this.window.clearTimeout(this.wrongTimeout); this.completionTimeout = null; this.wrongTimeout = null; this.drag?.destroy(); this.drag = null; this.renderer?.destroy(); this.renderer = null; }
  /** Stop and destroy the engine. */
  destroy() { this.cleanupLevel(); this.session.destroy(); this.eventBus.clear(); this.actions = {}; }
}
