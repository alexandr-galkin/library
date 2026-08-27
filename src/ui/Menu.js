import { t } from '../i18n/index.js';

export class Menu {
  constructor({ getState, onPlay, onSettings }) {
    this.getState = getState;
    this.onPlay = onPlay;
    this.onSettings = onSettings;
    this.container = document.createElement('div');
    this.container.className = 'menu-overlay';
    this.eventListeners = [];
    this.enterFrame = null;
    this.enterFallback = null;
    this.hideTimeout = null;
    this.render();
  }

  render() {
    const state = this.getState();
    const wasVisible = this.container.classList.contains('is-visible');
    this.cancelEnterTransition();
    this.cleanupListeners();

    this.container.innerHTML = `
      <div class="menu-container">
        <div class="menu-background">
          <div class="menu-particles"></div>
          <div class="menu-books-decoration">
            <div class="floating-book book-1">📕</div>
            <div class="floating-book book-2">📗</div>
            <div class="floating-book book-3">📘</div>
            <div class="floating-book book-4">📙</div>
            <div class="floating-book book-5">📔</div>
          </div>
        </div>
        <div class="menu-content">
          <div class="menu-header">
            <div class="menu-logo">
              <div class="logo-icon">📚</div>
              <div class="logo-text">
                <h1 class="menu-title">${t('game.title')}</h1>
                <div class="menu-subtitle">${t('game.subtitle')}</div>
              </div>
            </div>
            <p class="menu-description">${t('game.description')}</p>
          </div>
          <div class="menu-stats-grid">
            <div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-value">${state.currentLevel}</div><div class="stat-label">${t('game.level')}</div></div>
            <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-value">${state.bestScore}</div><div class="stat-label">${t('game.record')}</div></div>
            <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${state.totalScore}</div><div class="stat-label">${t('game.totalScore')}</div></div>
          </div>
          <div class="menu-buttons">
            <button class="play-button" id="menu-play"><span class="play-icon">▶</span><span class="play-text">${t('game.play')}</span><span class="play-shine"></span></button>
            <button class="settings-button" id="menu-settings"><span class="settings-icon">⚙</span><span>${t('game.settings')}</span></button>
          </div>
          <div class="menu-footer"><span class="version">v1.0</span><span class="hint">${t('game.hint')}</span><span class="copyright">© 2026 GLKN Games</span></div>
        </div>
      </div>
    `;

    const playBtn = this.container.querySelector('#menu-play');
    const settingsBtn = this.container.querySelector('#menu-settings');

    if (playBtn) {
      const handler = () => {
        playBtn.classList.add('clicked');
        setTimeout(() => this.onPlay(), 300);
      };
      playBtn.addEventListener('click', handler);
      this.eventListeners.push({ element: playBtn, handler });
    }

    if (settingsBtn) {
      const handler = () => this.onSettings();
      settingsBtn.addEventListener('click', handler);
      this.eventListeners.push({ element: settingsBtn, handler });
    }

    if (wasVisible) this.enter();
  }

  cleanupListeners() {
    this.eventListeners.forEach(({ element, handler }) => element?.removeEventListener('click', handler));
    this.eventListeners = [];
  }

  cancelEnterTransition() {
    if (this.enterFrame !== null) {
      cancelAnimationFrame(this.enterFrame);
      this.enterFrame = null;
    }
    if (this.enterFallback !== null) {
      clearTimeout(this.enterFallback);
      this.enterFallback = null;
    }
  }

  enter() {
    this.cancelEnterTransition();

    const content = this.container.querySelector('.menu-content');
    if (!content) return;

    let entered = false;
    const addEnteredClass = () => {
      if (entered) return;
      entered = true;
      this.enterFrame = null;
      this.enterFallback = null;
      content.classList.add('entered');
    };

    this.enterFrame = requestAnimationFrame(addEnteredClass);
    this.enterFallback = setTimeout(addEnteredClass, 50);
  }

  show() {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.container.classList.add('is-visible');
    this.enter();
  }

  hide() {
    this.cancelEnterTransition();
    this.container.querySelector('.menu-content')?.classList.remove('entered');
    this.hideTimeout = setTimeout(() => {
      this.hideTimeout = null;
      this.container.classList.remove('is-visible');
    }, 300);
  }

  destroy() {
    this.cancelEnterTransition();
    if (this.hideTimeout !== null) clearTimeout(this.hideTimeout);
    this.cleanupListeners();
    this.container.remove();
  }
}
