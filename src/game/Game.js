import { GameState } from './GameState.js';
import { GameStats } from '../core/GameStats.js';
import { GameTimer } from '../core/GameTimer.js';
import { GameStatus } from '../core/GameStatus.js';
import { ScoreCalculator } from '../core/ScoreCalculator.js';
import { ThemeManager } from '../themes/ThemeManager.js';
import { ProceduralLevelGenerator } from '../generator/ProceduralLevelGenerator.js';
import { SoundManager } from '../audio/SoundManager.js';
import { ParticleSystem } from '../rendering/ParticleSystem.js';
import { DragController } from '../input/DragController.js';
import { GameUI } from '../ui/GameUI.js';
import { Menu } from '../ui/Menu.js';
import { Settings } from '../ui/Settings.js';
import { LevelComplete } from '../ui/LevelComplete.js';

export class Game {
  constructor({ app = document.getElementById('app'), storage, documentRef = document, windowRef = globalThis } = {}) {
    if (!app) throw new Error('Game requires an #app element');
    this.app = app;
    this.document = documentRef;
    this.window = windowRef;
    this.state = new GameState(storage);
    this.stats = new GameStats();
    this.theme = new ThemeManager().current;
    this.sound = new SoundManager({ windowRef });
    this.particles = new ParticleSystem({ documentRef, windowRef });
    this.timer = new GameTimer({ onTick: seconds => this.handleTimerTick(seconds), onComplete: () => this.handleFail() });
    this.drag = null;
    this.ui = null;
    this.currentLevel = null;
    this.status = GameStatus.MENU;
    this.isTransitioning = false;
    this.isInGame = false;
    this.completionTimeout = null;
    this.visibilityHandler = () => this.handleVisibilityChange();

    this.menu = new Menu({ getState: () => this.state.data, onPlay: () => this.startGame(), onSettings: () => this.showSettings() });
    this.settings = new Settings({
      getState: () => this.state.data,
      sound: this.sound,
      onSettingChanged: (key, value) => this.updateSetting(key, value),
      onBack: fromGame => fromGame ? this.closeGameSettings() : this.showMenu(),
    });
    this.levelComplete = new LevelComplete({ onNextLevel: () => this.nextLevel() });

    this.theme.injectStyles();
    this.app.append(this.menu.container, this.settings.container);
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
  get isPaused() { return this.status === GameStatus.PAUSED; }

  applySettings() {
    const settings = this.state.data.settings;
    this.sound.enabled = settings.sound;
    this.document.body.classList.toggle('reduced-motion', settings.reduced);
  }

  updateSetting(key, value) {
    if (!(key in this.state.data.settings)) return;
    this.state.data.settings[key] = value;
    this.state.save();
    this.applySettings();
    if (key === 'sound' && value) {
      this.sound.init();
      this.sound.playPick();
    }
  }

  handleVisibilityChange() {
    if (this.document.hidden && this.isInGame && !this.isTransitioning && !this.isPaused) {
      this.pauseGame();
      this.ui?.showPauseMenu();
    }
  }

  pauseGame() {
    if (!this.isInGame || this.isPaused || this.status === GameStatus.COMPLETING) return;
    this.status = GameStatus.PAUSED;
    this.timer.pause();
    this.sound.pauseAudio();
    this.drag?.pause();
  }

  resumeGame() {
    if (!this.isPaused) return;
    this.status = GameStatus.PLAYING;
    this.timer.resume();
    this.sound.resumeAudio();
    this.drag?.resume();
    this.ui?.hidePauseMenu();
  }

  startGame() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.sound.init();
    this.stats.totalScore = 0;
    this.isInGame = true;
    this.status = GameStatus.PLAYING;
    this.menu.hide();
    this.settings.hide();
    this.loadLevel(this.state.data.currentLevel);
    this.isTransitioning = false;
  }

  loadLevel(levelNumber) {
    try {
      this.cleanupLevel();
      this.currentLevel = ProceduralLevelGenerator.generate(levelNumber, this.theme);
      this.stats.resetLevel();
      this.status = GameStatus.PLAYING;
      this.ui = new GameUI({ app: this.app, theme: this.theme, documentRef: this.document, actions: {
        onPause: () => { this.pauseGame(); this.ui?.showPauseMenu(); },
        onRetry: () => this.retryLevel(),
        onResume: () => this.resumeGame(),
        onSettings: () => this.showSettingsFromGame(),
        onMenu: () => this.showMenu(),
      }});
      this.drag = new DragController({
        getLevel: () => this.currentLevel,
        isBlocked: () => this.isTransitioning || this.isPaused || this.status === GameStatus.FAILED,
        sound: this.sound,
        root: this.document,
        onCorrect: (object, element, container) => this.handleCorrect(object, element, container),
        onWrong: element => this.handleWrong(element),
      });
      this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
      this.ui.setRule(this.currentLevel.ruleText, this.theme.displayName);
      this.ui.renderObjects(this.currentLevel.objects);
      this.ui.renderContainers(this.currentLevel.containers);
      if (this.currentLevel.timeLimit) {
        this.ui.showTimer(this.currentLevel.timeLimit);
        this.startTimer(this.currentLevel.timeLimit);
      } else {
        this.ui.hideTimer();
      }
    } catch (error) {
      console.error('Failed to load level:', error);
      this.handleLevelLoadError();
    }
  }

  handleLevelLoadError() {
    this.cleanupLevel();
    try {
      this.currentLevel = ProceduralLevelGenerator.generate(1, this.theme);
      this.stats.resetLevel();
      this.loadLevel(1);
    } catch (error) {
      console.error('Critical error loading fallback level:', error);
      this.showMenu();
    }
  }

  cleanupLevel() {
    if (this.completionTimeout) this.window.clearTimeout(this.completionTimeout);
    this.completionTimeout = null;
    this.drag?.destroy();
    this.drag = null;
    this.ui?.destroy();
    this.ui = null;
    this.timer.stop();
  }

  retryLevel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.loadLevel(this.state.data.currentLevel);
    this.isTransitioning = false;
  }

  nextLevel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.state.data.currentLevel += 1;
    this.state.save();
    this.loadLevel(this.state.data.currentLevel);
    this.isTransitioning = false;
  }

  startTimer(seconds) { this.timer.start(seconds); }
  stopTimer() { this.timer.stop(); }

  handleTimerTick(seconds) {
    this.ui?.updateTimer(seconds, seconds <= 5);
    if (seconds > 0 && seconds <= 5) this.sound.playTimerWarning();
  }

  handleCorrect(object, element, containerElement) {
    if (this.isTransitioning || this.isPaused || this.status !== GameStatus.PLAYING || element.classList.contains('correct')) return;
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
    if (this.placed >= this.currentLevel.objects.length) {
      this.isTransitioning = true;
      this.status = GameStatus.COMPLETING;
      this.completionTimeout = this.window.setTimeout(() => this.handleComplete(), 600);
    }
  }

  handleWrong(element) {
    if (this.isPaused || this.status !== GameStatus.PLAYING || element.classList.contains('correct')) return;
    this.stats.addMistake();
    this.ui?.hideCombo();
    element.classList.add('shake');
    this.window.setTimeout(() => element.classList.remove('shake'), 400);
    this.sound.playWrong();
  }

  handleComplete() {
    if (this.status !== GameStatus.COMPLETING) return;
    this.stopTimer();
    this.sound.playLevelComplete();
    const timeBonus = ScoreCalculator.timeBonus(this.timer.remaining, Boolean(this.currentLevel.timeLimit));
    const accuracyBonus = ScoreCalculator.accuracyBonus(this.stats.accuracy(this.currentLevel.objects.length));
    this.stats.addBonus(timeBonus + accuracyBonus);
    this.state.data.totalScore = this.score;
    this.state.data.bestScore = Math.max(this.state.data.bestScore, this.score);
    this.state.save();
    this.menu.render();
    this.particles.emit(this.window.innerWidth / 2, this.window.innerHeight / 2, '#e8d48b', 30);
    this.levelComplete.show(this.currentLevel.id, this.levelScore, this.combo, this.mistakes, timeBonus, accuracyBonus, this.stats.stars());
    this.status = GameStatus.PLAYING;
    this.isTransitioning = false;
    this.completionTimeout = null;
  }

  handleFail() {
    if (this.status !== GameStatus.PLAYING) return;
    this.status = GameStatus.FAILED;
    this.timer.stop();
    this.drag?.pause();
    this.ui?.showFail();
    this.sound.playWrong();
  }

  showMenu() {
    this.cleanupLevel();
    this.isInGame = false;
    this.status = GameStatus.MENU;
    while (this.app.firstChild) this.app.firstChild.remove();
    this.app.append(this.menu.container, this.settings.container);
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
