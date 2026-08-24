import { GameState } from './GameState.js';
import { GameStats } from '../core/GameStats.js';
import { GameTimer } from '../core/GameTimer.js';
import { ScoreCalculator } from '../core/ScoreCalculator.js';
import { LocalStorageRepository } from '../persistence/LocalStorageRepository.js';
import { ThemeManager } from '../themes/ThemeManager.js';
import { installLibraryVisuals } from '../themes/library/LibraryVisuals.js';
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
    this.app = app;
    this.document = documentRef;
    this.window = windowRef;
    this.storage = storage ?? this.window.localStorage;
    this.state = new GameState(new LocalStorageRepository(this.storage, 'library-game', ['chaosGame_v2']));
    this.stats = new GameStats();
    this.theme = new ThemeManager().current;
    this.sound = new SoundManager({ windowRef });
    this.particles = new ParticleSystem({ documentRef, windowRef });
    this.timer = new GameTimer({ onTick: seconds => this.handleTimerTick(seconds), onComplete: () => this.handleFail() });
    this.session = new GameSession({ state: this.state, stats: this.stats, timer: this.timer, sound: this.sound, generateLevel: level => ProceduralLevelGenerator.generate(level, this.theme), onLevelLoaded: level => this.mountLevel(level), onComplete: level => this.finishLevel(level), onFail: () => this.showFailure() });
    this.drag = null;
    this.ui = null;
    this.completionTimeout = null;
    this.visibilityHandler = () => this.handleVisibilityChange();
    this.menu = new Menu({ getState: () => this.state.data, onPlay: () => this.startGame(), onSettings: () => this.showSettings() });
    this.settings = new Settings({ getState: () => this.state.data, sound: this.sound, onSettingChanged: (key, value) => this.updateSetting(key, value), onBack: fromGame => fromGame ? this.closeGameSettings() : this.showMenu() });
    this.levelComplete = new LevelComplete({ onNextLevel: () => this.nextLevel() });
    this.theme.injectStyles();
    installLibraryVisuals(this.document);
    this.app.append(this.menu.container);
    this.document.body?.append(this.settings.container);
    this.menu.show();
    this.settings.hide();
    this.applySettings();
    this.document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  get score() { return this.stats.totalScore; }
  get combo() { return this.stats.combo; }
  get levelScore() { return this.stats.levelScore; }
  get placed() { return this.stats.placed; }
  get mistakes() { return this.stats.mistakes; }
  get currentLevel() { return this.session.level; }
  get isPaused() { return this.session.isPaused; }
  get isTransitioning() { return this.session.transitioning; }
  get isInGame() { return this.session.active; }

  applySettings() {
    const settings = this.state.data.settings;
    this.sound.enabled = settings.sound;
    this.document.body.classList.toggle('reduced-motion', settings.reduced);
  }

  updateSetting(key, value) {
    if (!(key in this.state.data.settings) || typeof value !== 'boolean') return;
    this.state.data.settings[key] = value;
    this.state.save();
    this.applySettings();
    if (key === 'sound' && value) { this.sound.init(); this.sound.playPick(); }
  }

  handleVisibilityChange() {
    if (this.document.hidden && this.session.active && !this.session.transitioning && !this.session.isPaused) { this.pauseGame(); this.ui?.showPauseMenu(); }
  }

  pauseGame() { if (this.session.pause()) this.drag?.pause(); }
  resumeGame() { if (this.session.resume()) { this.drag?.resume(); this.ui?.hidePauseMenu(); } }

  startGame() {
    if (this.session.transitioning) return;
    this.sound.init();
    this.menu.hide();
    this.settings.hide();
    try { this.session.start(); } catch (error) { console.error('Failed to start game:', error); this.showMenu(); }
  }

  mountLevel(level) {
    this.cleanupLevel();
    this.ui = new GameUI({ app: this.app, theme: this.theme, documentRef: this.document, actions: { onPause: () => { this.pauseGame(); this.ui?.showPauseMenu(); }, onRetry: () => this.retryLevel(), onResume: () => this.resumeGame(), onSettings: () => this.showSettingsFromGame(), onMenu: () => this.showMenu() } });
    this.drag = new DragController({ getLevel: () => this.currentLevel, isBlocked: () => this.isTransitioning || this.isPaused || this.session.status === 'FAILED', sound: this.sound, root: this.document, onCorrect: (object, element, container) => this.handleCorrect(object, element, container), onWrong: element => this.handleWrong(element) });
    this.ui.updateHUD(level.id, level.difficulty, this.score);
    this.ui.setRule(level.ruleText, this.theme.displayName);
    this.ui.renderObjects(level.objects);
    this.ui.renderContainers(level.containers);
    if (level.timeLimit) this.ui.showTimer(level.timeLimit); else this.ui.hideTimer();
  }

  cleanupLevel() {
    if (this.completionTimeout) this.window.clearTimeout(this.completionTimeout);
    this.completionTimeout = null;
    this.drag?.destroy();
    this.drag = null;
    this.ui?.destroy();
    this.ui = null;
  }

  retryLevel() { this.session.retry(); }
  nextLevel() { this.session.next(); }

  handleTimerTick(seconds) {
    this.ui?.updateTimer(seconds, seconds <= 5);
    if (seconds > 0 && seconds <= 5) this.sound.playTimerWarning();
  }

  handleCorrect(object, element, containerElement) {
    if (this.isTransitioning || this.isPaused || !this.session.isPlaying || element.classList.contains('correct')) return;
    const points = ScoreCalculator.pointsForCombo(this.combo + 1);
    this.stats.addCorrect(points);
    this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
    this.ui.moveToContainer(element, containerElement);
    element.classList.add('correct');
    const rect = containerElement.getBoundingClientRect();
    this.particles.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, '#c9a227', 14);
    this.ui.showPopup(rect.left + rect.width / 2, rect.top, `+${points}`);
    if (this.combo >= 2) this.ui.showCombo(this.combo);
    if (this.combo >= 3) this.sound.playCombo(); else this.sound.playCorrect();
    this.window.setTimeout(() => element.remove(), 500);
    if (this.placed >= this.currentLevel.objects.length && this.session.markCompleting()) this.completionTimeout = this.window.setTimeout(() => this.session.complete(), 600);
  }

  handleWrong(element) {
    if (this.isPaused || !this.session.isPlaying || element.classList.contains('correct')) return;
    this.stats.addMistake();
    this.ui?.hideCombo();
    element.classList.add('shake');
    this.window.setTimeout(() => element.classList.remove('shake'), 400);
    this.sound.playWrong();
  }

  finishLevel(level) {
    this.sound.playLevelComplete();
    const timeBonus = ScoreCalculator.timeBonus(this.timer.remaining, Boolean(level.timeLimit));
    const accuracyBonus = ScoreCalculator.accuracyBonus(this.stats.accuracy(level.objects.length));
    this.stats.addBonus(timeBonus + accuracyBonus);
    this.state.data.totalScore = this.score;
    this.state.data.bestScore = Math.max(this.state.data.bestScore, this.score);
    this.state.save();
    this.menu.render();
    this.particles.emit(this.window.innerWidth / 2, this.window.innerHeight / 2, '#e8d48b', 30);
    this.levelComplete.show(level.id, this.levelScore, this.combo, this.mistakes, timeBonus, accuracyBonus, this.stats.stars());
    this.completionTimeout = null;
  }

  handleFail() { if (this.session.fail()) this.drag?.pause(); }
  showFailure() { this.ui?.showFail(); this.sound.playWrong(); }

  showMenu() {
    this.session.stop();
    this.cleanupLevel();
    this.menu.render();
    this.menu.show();
    this.settings.hide();
  }

  showSettings() {
    this.menu.hide();
    this.settings.fromGame = false;
    this.settings.render();
    this.settings.show();
  }

  showSettingsFromGame() {
    this.pauseGame();
    this.settings.fromGame = true;
    this.settings.render();
    this.settings.show();
  }

  closeGameSettings() {
    this.settings.fromGame = false;
    this.settings.hide();
    this.resumeGame();
  }

  destroy() {
    this.session.destroy();
    this.cleanupLevel();
    this.document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.timer.destroy();
    this.particles.destroy();
    this.sound.destroy();
    this.menu.destroy();
    this.settings.destroy();
    this.levelComplete.destroy();
  }
}
