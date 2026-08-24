export class Menu {
  constructor({ getState, onPlay, onSettings }) {
    this.getState = getState;
    this.onPlay = onPlay;
    this.onSettings = onSettings;
    this.container = document.createElement('div');
    this.container.className = 'menu-overlay';
    this.eventListeners = [];
    this.render();
  }

  render() {
    const state = this.getState();
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
                <h1 class="menu-title">РАЗБЕРИ ХАОС</h1>
                <div class="menu-subtitle">Библиотека</div>
              </div>
            </div>
            <p class="menu-description">Разложи книги по полкам.<br>Порядок — это сила.</p>
          </div>
          <div class="menu-stats-grid">
            <div class="stat-card"><div class="stat-icon">🎯</div><div class="stat-value">${state.currentLevel}</div><div class="stat-label">Уровень</div></div>
            <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-value">${state.bestScore}</div><div class="stat-label">Рекорд</div></div>
            <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${state.totalScore}</div><div class="stat-label">Всего очков</div></div>
          </div>
          <div class="menu-buttons">
            <button class="play-button" id="menu-play"><span class="play-icon">▶</span><span class="play-text">ИГРАТЬ</span><span class="play-shine"></span></button>
            <button class="settings-button" id="menu-settings"><span class="settings-icon">⚙</span><span>Настройки</span></button>
          </div>
          <div class="menu-footer"><span class="version">v1.0</span><span class="hint">💡 Перетаскивай книги на полки</span></div>
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

    this.animateFloatingBooks();
  }

  animateFloatingBooks() {
    this.container.querySelectorAll('.floating-book').forEach((book, index) => {
      book.style.animation = `floatBook 3s ease-in-out ${index * 0.5}s infinite`;
      book.style.animationDelay = `${index * 0.7}s`;
    });
  }

  cleanupListeners() {
    this.eventListeners.forEach(({ element, handler }) => element?.removeEventListener('click', handler));
    this.eventListeners = [];
  }

  show() {
    this.container.style.display = 'flex';
    requestAnimationFrame(() => this.container.querySelector('.menu-content')?.classList.add('entered'));
  }

  hide() {
    this.container.querySelector('.menu-content')?.classList.remove('entered');
    setTimeout(() => { this.container.style.display = 'none'; }, 300);
  }

  destroy() {
    this.cleanupListeners();
    this.container.remove();
  }
}
