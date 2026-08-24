import { GameState } from './GameState.js';
import { GameStats } from '../core/GameStats.js';
import { GameTimer } from '../core/GameTimer.js';
import { LocalStorageRepository } from '../persistence/LocalStorageRepository.js';
import { ThemeManager } from '../themes/ThemeManager.js';
import { LevelManager } from './LevelManager.js';
import { GameEngine } from './GameEngine.js';
import { LayoutManager } from '../ui/LayoutManager.js';
import { SoundManager } from '../audio/SoundManager.js';
import { ParticleSystem } from '../rendering/ParticleSystem.js';
import { Menu } from '../ui/Menu.js';
import { Settings } from '../ui/Settings.js';
import { LevelComplete } from '../ui/LevelComplete.js';

/** Application shell. It owns menus/settings; GameEngine owns puzzle gameplay. */
export class Game {
  constructor({ app = document.getElementById('app'), storage, documentRef = document, windowRef = globalThis } = {}) {
    if (!app) throw new Error('Game requires an #app element');
    this.app = app;
    this.document = documentRef;
    this.window = windowRef;
    this.storage = storage ?? this.window.localStorage;
    this.state = new GameState(new LocalStorageRepository(this.storage, 'library-game', ['chaosGame_v2']));
    this.stats = new GameStats();
    this.themeManager = new ThemeManager({ documentRef });
    this.theme = this.themeManager.current;
    this.sound = new SoundManager({ windowRef });
    this.particles = new ParticleSystem({ documentRef, windowRef });
    this.timer = new GameTimer({ onTick: () => {}, onComplete: () => {} });
    this.levelManager = new LevelManager({ theme: this.theme });
    this.layoutManager = new LayoutManager({ documentRef });
    this.layoutCleanup = this.layoutManager.install();
    this.themeCleanup = this.theme.install();
    this.engine = new GameEngine({
      app: this.app,
      documentRef: this.document,
      windowRef: this.window,
      state: this.state,
      stats: this.stats,
      timer: this.timer,
      sound: this.sound,
      particles: this.particles,
      levelManager: this.levelManager,
      theme: this.theme,
      actions: {
        onSettings: () => this.showSettingsFromGame(),
        onMenu: () => this.showMenu(),
        onLevelComplete: (level, score, bonus) => this.showLevelComplete(level, score, bonus),
      },
    });
    this.visibilityHandler = () => this.handleVisibilityChange();

    this.menu = new Menu({ getState: () => this.state.data, onPlay: () => this.startGame(), onSettings: () => this.showSettings() });
    this.settings = new Settings({ getState: () => this.state.data, sound: this.sound, onSettingChanged: (key, value) => this.updateSetting(key, value), onBack: fromGame => fromGame ? this.closeGameSettings() : this.showMenu() });
    this.levelComplete = new LevelComplete({ onNextLevel: () => this.nextLevel() });

    this.app.append(this.menu.container);
    this.document.body?.append(this.settings.container);
    this.menu.show();
    this.settings.hide();
    this.applySettings();
    this.document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /** Total score. */
  get score() { return this.stats.totalScore; }
  /** Current level score. */
  get levelScore() { return this.stats.levelScore; }
  /** Current level number. */
  get currentLevel() { return this.engine.level?.id ?? 0; }
  /** Whether the game is paused. */
  get isPaused() { return this.engine.isPaused; }
  /** Whether a transition is active. */
  get isTransitioning() { return this.engine.isTransitioning; }
  /** Whether the game is active. */
  get isInGame() { return this.engine.isActive; }

  /** Apply persisted settings to the application. */
  applySettings() {
    const settings = this.state.data.settings;
    this.sound.enabled = settings.sound;
    this.document.body.classList.toggle('reduced-motion', settings.reduced);
  }

  /** Persist one boolean setting. */
  updateSetting(key, value) {
    if (!(key in this.state.data.settings) || typeof value !== 'boolean') return;
    this.state.data.settings[key] = value;
    this.state.save();
    this.applySettings();
    if (key === 'sound' && value) {
      this.sound.init();
      this.sound.playPick();
    }
  }

  /** Switch theme styles without reloading the page. @param {string} name @returns {boolean} */
  setTheme(name) {
    const next = this.themeManager.getTheme(name);
    if (!next || next === this.theme) return false;
    this.themeCleanup?.();
    this.theme = next;
    this.themeCleanup = this.theme.install();
    this.themeManager.setTheme(name);
    this.engine.theme = this.theme;
    this.levelManager.theme = this.theme;
    if (this.engine.level) this.engine.mountLevel(this.engine.level);
    return true;
  }

  /** Pause automatically when the document becomes hidden. */
  handleVisibilityChange() {
    if (this.document.hidden && this.engine.isActive && !this.engine.isTransitioning && !this.engine.isPaused) {
      this.pauseGame();
      this.engine.renderer?.showPauseMenu();
    }
  }

  /** Pause gameplay. */
  pauseGame() { return this.engine.pause(); }
  /** Resume gameplay. */
  resumeGame() { return this.engine.resume(); }

  /** Start gameplay. */
  startGame() {
    if (this.engine.isTransitioning) return;
    this.sound.init();
    this.menu.hide();
    this.settings.hide();
    try {
      this.engine.start();
    } catch (error) {
      console.error('Failed to start game:', error);
      this.showMenu();
    }
  }

  /** Retry the current level. */
  retryLevel() { return this.engine.retry(); }
  /** Advance to the next level. */
  nextLevel() { return this.engine.next(); }

  /** Show level completion UI. */
  showLevelComplete(level, score, bonus) {
    this.menu.render();
    this.levelComplete.show(level, score, bonus);
  }

  /** Return to the main menu. */
  showMenu() {
    this.engine.session.stop();
    this.engine.cleanupLevel();
    this.menu.render();
    this.menu.show();
    this.settings.hide();
  }

  /** Open settings from the menu. */
  showSettings() {
    this.menu.hide();
    this.settings.fromGame = false;
    this.settings.render();
    this.settings.show();
  }

  /** Open settings while preserving the active game. */
  showSettingsFromGame() {
    this.pauseGame();
    this.settings.fromGame = true;
    this.settings.render();
    this.settings.show();
  }

  /** Close game settings and resume. */
  closeGameSettings() {
    this.settings.fromGame = false;
    this.settings.hide();
    this.resumeGame();
  }

  /** Destroy the application and every owned resource. */
  destroy() {
    this.engine.destroy();
    this.layoutCleanup?.();
    this.themeCleanup?.();
    this.document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.timer.destroy();
    this.particles.destroy();
    this.sound.destroy();
    this.menu.destroy();
    this.settings.destroy();
    this.levelComplete.destroy();
  }
}
