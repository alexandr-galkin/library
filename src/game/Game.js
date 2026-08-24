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
import { onLocaleChanged } from '../i18n/index.js';
import { showFullscreenAd } from '../platform/YandexSDK.js';

export class Game {
  constructor({ app = document.getElementById('app'), storage, documentRef = document, windowRef = globalThis } = {}) {
    if (!app) throw new Error('Game requires an #app element');
    this.app = app; this.document = documentRef; this.window = windowRef; this.storage = storage ?? this.window.localStorage;
    this.state = new GameState(new LocalStorageRepository(this.storage, 'library-game', ['chaosGame_v2'])); this.stats = new GameStats();
    this.themeManager = new ThemeManager({ documentRef }); this.theme = this.themeManager.current; this.sound = new SoundManager({ windowRef }); this.particles = new ParticleSystem({ documentRef, windowRef }); this.timer = new GameTimer({ onTick: () => {}, onComplete: () => {} });
    this.levelManager = new LevelManager({ theme: this.theme }); this.layoutManager = new LayoutManager({ documentRef }); this.layoutCleanup = this.layoutManager.install(); this.themeCleanup = this.theme.install();
    this.engine = new GameEngine({ app: this.app, documentRef: this.document, windowRef: this.window, state: this.state, stats: this.stats, timer: this.timer, sound: this.sound, particles: this.particles, levelManager: this.levelManager, theme: this.theme, layoutManager: this.layoutManager, actions: { onSettings: () => this.showSettingsFromGame(), onMenu: () => this.showMenu(), onLevelComplete: (level, score, bonus) => this.showLevelComplete(level, score, bonus) } });
    this.visibilityHandler = () => this.handleVisibilityChange();
    this.menu = new Menu({ getState: () => this.state.data, onPlay: () => this.startGame(), onSettings: () => this.showSettings() });
    this.settings = new Settings({ getState: () => this.state.data, sound: this.sound, onSettingChanged: (key, value) => this.updateSetting(key, value), onBack: fromGame => fromGame ? this.closeGameSettings() : this.showMenu() });
    this.levelComplete = new LevelComplete({ onNextLevel: () => this.nextLevel() });
    this.app.append(this.menu.container); this.document.body?.append(this.settings.container); this.menu.show(); this.settings.hide(); this.applySettings();
    this.localeCleanup = onLocaleChanged(() => this.refreshLocale());
    this.document.addEventListener('visibilitychange', this.visibilityHandler);
  }
  get score() { return this.stats.totalScore; } get levelScore() { return this.stats.levelScore; } get currentLevel() { return this.engine.level?.id ?? 0; } get isPaused() { return this.engine.isPaused; } get isTransitioning() { return this.engine.isTransitioning; } get isInGame() { return this.engine.isActive; }
  applySettings() { const settings = this.state.data.settings; this.sound.enabled = settings.sound; this.document.body.classList.toggle('reduced-motion', settings.reduced); }
  updateSetting(key, value) { if (!(key in this.state.data.settings) || typeof value !== 'boolean') return; this.state.data.settings[key] = value; this.state.save(); this.applySettings(); if (key === 'sound' && value) { this.sound.init(); this.sound.playPick(); } }
  setTheme(name) { const next = this.themeManager.getTheme(name); if (!next || next === this.theme) return false; this.themeCleanup?.(); this.theme = next; this.themeCleanup = this.theme.install(); this.themeManager.setTheme(name); this.engine.theme = this.theme; this.levelManager.theme = this.theme; if (this.engine.level) this.engine.mountLevel(this.engine.level); return true; }
  handleVisibilityChange() { if (this.document.hidden && this.engine.isActive && !this.engine.isTransitioning && !this.engine.isPaused) { this.pauseGame(); this.engine.renderer?.showPauseMenu(); } }
  pauseGame() { return this.engine.pause(); } resumeGame() { return this.engine.resume(); }
  startGame() { if (this.engine.isTransitioning) return; this.sound.init(); this.menu.hide(); this.settings.hide(); try { this.engine.start(); } catch (error) { console.error('Failed to start game:', error); this.showMenu(); } }
  retryLevel() { return this.engine.retry(); } nextLevel() { return this.engine.next(); }
  async showLevelComplete(level, score, bonus) {
    this.menu.render();
    this.levelComplete.show(level, score, bonus);
    // The completion screen is a natural pause between levels; show fullscreen ad here.
    await showFullscreenAd();
  }
  showMenu() { this.engine.session.stop(); this.engine.cleanupLevel(); this.menu.render(); this.menu.show(); this.settings.hide(); }
  showSettings() { this.menu.hide(); this.settings.fromGame = false; this.settings.render(); this.settings.show(); }
  showSettingsFromGame() { this.pauseGame(); this.settings.fromGame = true; this.settings.render(); this.settings.show(); }
  closeGameSettings() { this.settings.fromGame = false; this.settings.hide(); this.resumeGame(); }
  refreshLocale() {
    const settingsVisible = this.settings.container.style.display !== 'none';
    const menuVisible = this.menu.container.style.display !== 'none';
    if (this.engine.isActive && this.engine.level) this.engine.mountLevel(this.engine.level);
    if (menuVisible) this.menu.render();
    if (settingsVisible) { this.settings.render(); this.settings.show(); }
  }
  destroy() { this.localeCleanup?.(); this.engine.destroy(); this.layoutCleanup?.(); this.themeCleanup?.(); this.document.removeEventListener('visibilitychange', this.visibilityHandler); this.timer.destroy(); this.particles.destroy(); this.sound.destroy(); this.menu.destroy(); this.settings.destroy(); this.levelComplete.destroy(); }
}
