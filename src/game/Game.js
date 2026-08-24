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
  constructor({ app = document.getElementById('app') } = {}) {
    if (!app) throw new Error('Game requires an #app element');

    this.app = app;
    this.state = new GameState();
    this.stats = new GameStats();
    this.themeManager = new ThemeManager();
    this.theme = this.themeManager.current;
    this.sound = new SoundManager();
    this.particles = new ParticleSystem();
    this.timer = new GameTimer({ onTick: seconds => this.handleTimerTick(seconds), onComplete: () => this.handleFail() });
    this.drag = null;
    this.ui = null;
    this.currentLevel = null;
    this.status = GameStatus.MENU;
    this.isTransitioning = false;
    this.isInGame = false;
    this.animations = true;
    this.completionTimeout = null;
    this.visibilityHandler = () => this.handleVisibilityChange();

    this.menu = new Menu({
      getState: () => this.state.data,
      onPlay: () => this.startGame(),
      onSettings: () => this.showSettings(),
    });
    this.settings = new Settings({
      getState: () => this.state.data,
      sound: this.sound,
      onSettingChanged: (key, value) => this.updateSetting(key, value),
      onBack: fromGame => {
        if (fromGame) {
          this.settings.fromGame = false;
          this.settings.hide();
          this.resumeGame();
        } else {
          this.showMenu();
        }
      },
    });
    this.levelComplete = new LevelComplete(this);

    this.theme.injectStyles();
    this.app.append(this.menu.container, this.settings.container);
    this.menu.show();
    this.settings.hide();
    this.applySettings();
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  get score() { return this.stats.totalScore; }
  set score(value) { this.stats.totalScore = Math.max(0, value); }
  get combo() { return this.stats.combo; }
  get levelScore() { return this.stats.levelScore; }
  get placed() { return this.stats.placed; }
  get mistakes() { return this.stats.mistakes; }
  get isPaused() { return this.status === GameStatus.PAUSED; }
  set isPaused(value) { if (value) this.status = GameStatus.PAUSED; else if (this.status === GameStatus.PAUSED) this.status = GameStatus.PLAYING; }

  applySettings() {
    const settings = this.state.data.settings;
    this.sound.enabled = settings.sound !== false;
    this.animations = settings.anim !== false;
    document.body.classList.toggle('reduced-motion', settings.reduced === true);
  }

  updateSetting(key, value) {
    this.state.data.settings[key] = value;
    this.state.save();
    this.applySettings();
    if (key === 'sound' && value) {
      this.sound.init();
      this.sound.playPick();
    }
  }

  handleVisibilityChange() {
    if (document.hidden && this.isInGame && !this.isTransitioning && !this.isPaused) {
      this.pauseGame();
      this.ui?.showPauseMenu();
    }
  }

  pauseGame() {
    if (!this.isInGame || this.isPaused) return;
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
      this.ui = new GameUI(this);
      this.drag = new DragController({
        getLevel: () => this.currentLevel,
        isBlocked: () => this.isTransitioning || this.isPaused,
        sound: this.sound,
        root: document,
        onCorrect: (object, element, container) => this.handleCorrect(object, element, container),
        onWrong: element => this.handleWrong(element),
      });

      this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
      this.ui.setRule(this.currentLevel.ruleText, this.theme.displayName);
      this.ui.renderObjects(this.currentLevel.objects, this.theme);
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
    try {
      this.cleanupLevel();
      this.currentLevel = ProceduralLevelGenerator.generate(1, this.theme);
      this.loadLevel(1);
    } catch (error) {
      console.error('Critical error loading fallback level:', error);
      this.showMenu();
    }
  }

  cleanupLevel() {
    if (this.completionTimeout) clearTimeout(this.completionTimeout);
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
    if (this.isTransitioning || this.isPaused || element.classList.contains('correct')) return;

    const points = ScoreCalculator.pointsForCombo(this.stats.combo + 1);
    this.stats.addCorrect(points);
    this.ui.updateHUD(this.currentLevel.id, this.currentLevel.difficulty, this.score);
    this.ui.moveToContainer(element, containerElement);
    element.classList.add('correct');

    const rect = containerElement.getBoundingClientRect();
    this.particles.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, '#c9a227', 14);
    this.ui.showPopup(rect.left + rect.width / 2, rect.top, `+${points}`);
    if (this.combo >= 2) this.ui.showCombo(this.combo);
    if (this.combo >= 3) this.sound.playCombo(); else this.sound.playCorrect();
    setTimeout(() => element.remove(), 500);

    if (this.placed >= this.currentLevel.objects.length) {
      this.isTransitioning = true;
      this.status = GameStatus.COMPLETING;
      this.completionTimeout = setTimeout(() => this.handleComplete(), 600);
    }
  }

  handleWrong(element) {
    if (this.isPaused || element.classList.contains('correct')) return;
    this.stats.addMistake();
    this.ui?.hideCombo();
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 400);
    this.sound.playWrong();
  }

  handleComplete() {
    this.stopTimer();
    this.sound.playLevelComplete();
    const timeBonus = ScoreCalculator.timeBonus(this.timer.remaining, Boolean(this.currentLevel.timeLimit));
    const accuracyBonus = ScoreCalculator.accuracyBonus(this.stats.accuracy(this.currentLevel.objects.length));
    this.stats.addBonus(timeBonus + accuracyBonus);
    const stars = this.stats.stars();

    this.state.data.totalScore = this.score;
    this.state.data.bestScore = Math.max(this.state.data.bestScore, this.score);
    this.state.save();
    this.menu.render();
    this.particles.emit(window.innerWidth / 2, window.innerHeight / 2, '#e8d48b', 30);
    this.levelComplete.show(this.currentLevel.id, this.levelScore, this.combo, this.mistakes, timeBonus, accuracyBonus, stars);
    this.status = GameStatus.PLAYING;
    this.isTransitioning = false;
    this.completionTimeout = null;
  }

  handleFail() {
    if (this.status === GameStatus.FAILED || this.status === GameStatus.COMPLETING) return;
    this.status = GameStatus.FAILED;
    this.timer.stop();
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
    this.settings.fromGame = true;
    this.settings.render();
    this.settings.show();
  }

  destroy() {
    this.cleanupLevel();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.timer.destroy();
    this.particles.destroy();
    this.menu.destroy();
    this.settings.destroy();
    this.levelComplete.destroy();
  }
}
