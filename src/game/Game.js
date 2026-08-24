import { GameState } from './GameState.js';
import { GameStats } from '../core/GameStats.js';
import { GameTimer } from '../core/GameTimer.js';
import { ScoreCalculator } from '../core/ScoreCalculator.js';
import { LocalStorageRepository } from '../persistence/LocalStorageRepository.js';
import { ThemeManager } from '../themes/ThemeManager.js';
import { installLibraryVisuals } from '../themes/library/LibraryVisuals.js';
import { installSortPuzzleVisuals } from '../themes/library/SortPuzzleVisuals.js';
import { ProceduralLevelGenerator } from '../generator/ProceduralLevelGenerator.js';
import { SoundManager } from '../audio/SoundManager.js';
import { ParticleSystem } from '../rendering/ParticleSystem.js';
import { DragController } from '../input/DragController.js';
import { GameUI } from '../ui/GameUI.js';
import { Menu } from '../ui/Menu.js';
import { Settings } from '../ui/Settings.js';
import { LevelComplete } from '../ui/LevelComplete.js';
import { GameSession } from './GameSession.js';

export class Game {
  constructor({ app = document.getElementById('app'), storage, documentRef = document, windowRef = globalThis } = {}) {
    if (!app) throw new Error('Game requires an #app element');
    this.app = app; this.document = documentRef; this.window = windowRef;
    this.storage = storage ?? this.window.localStorage;
    this.state = new GameState(new LocalStorageRepository(this.storage, 'library-game', ['chaosGame_v2']));
    this.stats = new GameStats(); this.theme = new ThemeManager().current;
    this.sound = new SoundManager({ windowRef }); this.particles = new ParticleSystem({ documentRef, windowRef });
    this.timer = new GameTimer({ onTick: () => {}, onComplete: () => {} });
    this.session = new GameSession({ state: this.state, stats: this.stats, timer: this.timer, sound: this.sound, generateLevel: level => ProceduralLevelGenerator.generate(level, this.theme), onLevelLoaded: level => this.mountLevel(level), onComplete: level => this.finishLevel(level), onFail: () => {} });
    this.drag = null; this.ui = null; this.completionTimeout = null; this.history = [];
    this.visibilityHandler = () => this.handleVisibilityChange();
    this.menu = new Menu({ getState: () => this.state.data, onPlay: () => this.startGame(), onSettings: () => this.showSettings() });
    this.settings = new Settings({ getState: () => this.state.data, sound: this.sound, onSettingChanged: (key, value) => this.updateSetting(key, value), onBack: fromGame => fromGame ? this.closeGameSettings() : this.showMenu() });
    this.levelComplete = new LevelComplete({ onNextLevel: () => this.nextLevel() });
    this.theme.injectStyles(); installLibraryVisuals(this.document); installSortPuzzleVisuals(this.document);
    this.app.append(this.menu.container); this.document.body?.append(this.settings.container); this.menu.show(); this.settings.hide(); this.applySettings();
    this.document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  get score() { return this.stats.totalScore; }
  get levelScore() { return this.stats.levelScore; }
  get placed() { return this.stats.placed; }
  get currentLevel() { return this.session.level; }
  get isPaused() { return this.session.isPaused; }
  get isTransitioning() { return this.session.transitioning; }
  get isInGame() { return this.session.active; }

  applySettings() { const settings = this.state.data.settings; this.sound.enabled = settings.sound; this.document.body.classList.toggle('reduced-motion', settings.reduced); }
  updateSetting(key, value) { if (!(key in this.state.data.settings) || typeof value !== 'boolean') return; this.state.data.settings[key] = value; this.state.save(); this.applySettings(); if (key === 'sound' && value) { this.sound.init(); this.sound.playPick(); } }
  handleVisibilityChange() { if (this.document.hidden && this.session.active && !this.session.transitioning && !this.session.isPaused) { this.pauseGame(); this.ui?.showPauseMenu(); } }
  pauseGame() { if (this.session.pause()) this.drag?.pause(); }
  resumeGame() { if (this.session.resume()) { this.drag?.resume(); this.ui?.hidePauseMenu(); } }

  startGame() {
    if (this.session.transitioning) return;
    this.sound.init(); this.menu.hide(); this.settings.hide();
    try { this.session.start(); } catch (error) { console.error('Failed to start game:', error); this.showMenu(); }
  }

  mountLevel(level) {
    this.cleanupLevel(); this.history = [];
    this.ui = new GameUI({ app: this.app, theme: this.theme, documentRef: this.document, actions: {
      onPause: () => { this.pauseGame(); this.ui?.showPauseMenu(); }, onUndo: () => this.undoMove(), onRetry: () => this.retryLevel(),
      onResume: () => this.resumeGame(), onSettings: () => this.showSettingsFromGame(), onMenu: () => this.showMenu(),
    }});
    this.drag = new DragController({ getLevel: () => this.currentLevel, isBlocked: () => this.isTransitioning || this.isPaused, sound: this.sound, root: this.document, onCorrect: (object, element, container) => this.handleCorrect(object, element, container), onWrong: element => this.handleWrong(element) });
    this.ui.updateHUD(level.id, level.difficulty, this.score, level.moves); this.ui.setRule(level.ruleText, this.theme.displayName); this.ui.renderObjects(level.objects); this.ui.renderContainers(level.containers, level.objects);
  }

  cleanupLevel() {
    if (this.completionTimeout) this.window.clearTimeout(this.completionTimeout);
    this.completionTimeout = null; this.drag?.destroy(); this.drag = null; this.ui?.destroy(); this.ui = null;
  }

  retryLevel() { this.session.retry(); }
  nextLevel() { this.session.next(); }

  handleCorrect(object, element, containerElement) {
    if (this.isTransitioning || this.isPaused || !this.session.isPlaying) return;
    const level = this.currentLevel;
    const points = Math.max(1, 100 - level.moves * 2);
    const move = this.ui.moveToContainer(element, containerElement, level);
    if (!move) return;
    move.points = points; this.history.push(move);
    this.stats.addCorrect(points); level.moves += 1;
    this.ui.updateHUD(level.id, level.difficulty, this.score, level.moves);
    const rect = containerElement.getBoundingClientRect();
    this.particles.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, '#c9a227', 8);
    this.ui.showPopup(rect.left + rect.width / 2, rect.top, `ХОД ${level.moves}`); this.sound.playCorrect();
    if (this.ui.isSolved(level) && this.session.markCompleting()) this.completionTimeout = this.window.setTimeout(() => this.session.complete(), 500);
  }

  undoMove() {
    if (!this.session.isPlaying || this.isTransitioning || !this.history.length) return;
    const level = this.currentLevel;
    if (this.ui?.isSolved(level)) return;
    const move = this.history.pop();
    if (!this.ui.undoMove(move, level)) { this.history.push(move); return; }
    this.stats.undoCorrect(move.points); level.moves = Math.max(0, level.moves - 1);
    this.ui.updateHUD(level.id, level.difficulty, this.score, level.moves); this.sound.playPick();
  }

  finishLevel(level) {
    this.sound.playLevelComplete();
    const moveBonus = ScoreCalculator.timeBonus(Math.max(0, 120 - level.moves), true);
    this.stats.addBonus(moveBonus); this.state.data.totalScore = this.score; this.state.data.bestScore = Math.max(this.state.data.bestScore, this.score); this.state.save();
    this.menu.render(); this.particles.emit(this.window.innerWidth / 2, this.window.innerHeight / 2, '#e8d48b', 30);
    this.levelComplete.show(level.id, this.levelScore, moveBonus); this.completionTimeout = null;
  }

  showMenu() { this.session.stop(); this.cleanupLevel(); this.menu.render(); this.menu.show(); this.settings.hide(); }
  showSettings() { this.menu.hide(); this.settings.fromGame = false; this.settings.render(); this.settings.show(); }
  showSettingsFromGame() { this.pauseGame(); this.settings.fromGame = true; this.settings.render(); this.settings.show(); }
  closeGameSettings() { this.settings.fromGame = false; this.settings.hide(); this.resumeGame(); }
  destroy() { this.session.destroy(); this.cleanupLevel(); this.document.removeEventListener('visibilitychange', this.visibilityHandler); this.timer.destroy(); this.particles.destroy(); this.sound.destroy(); this.menu.destroy(); this.settings.destroy(); this.levelComplete.destroy(); }
}
