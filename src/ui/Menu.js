export class Menu {
  constructor(game) {
    this.game = game;
    this.container = document.createElement('div');
    this.container.className = 'menu-overlay';
    this.eventListeners = [];
    this.render();
  }

  render() {
    const state = this.game.state.data;
    
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
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-value">${state.currentLevel}</div>
              <div class="stat-label">Уровень</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-value">${state.bestScore}</div>
              <div class="stat-label">Рекорд</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">${state.totalScore}</div>
              <div class="stat-label">Всего очков</div>
            </div>
          </div>
          
          <div class="menu-buttons">
            <button class="play-button" id="menu-play">
              <span class="play-icon">▶</span>
              <span class="play-text">ИГРАТЬ</span>
              <span class="play-shine"></span>
            </button>
            <button class="settings-button" id="menu-settings">
              <span class="settings-icon">⚙</span>
              <span>Настройки</span>
            </button>
          </div>
          
          <div class="menu-footer">
            <span class="version">v1.0</span>
            <span class="hint">💡 Перетаскивай книги на полки</span>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const playBtn = this.container.querySelector('#menu-play');
    const settingsBtn = this.container.querySelector('#menu-settings');
    
    if (playBtn) {
      const playHandler = () => {
        playBtn.classList.add('clicked');
        setTimeout(() => this.game.startGame(), 300);
      };
      playBtn.addEventListener('click', playHandler);
      this.eventListeners.push({ element: playBtn, handler: playHandler });
    }
    
    if (settingsBtn) {
      const settingsHandler = () => this.game.showSettings();
      settingsBtn.addEventListener('click', settingsHandler);
      this.eventListeners.push({ element: settingsBtn, handler: settingsHandler });
    }
    
    // Add animation for floating books
    this.animateFloatingBooks();
  }

  animateFloatingBooks() {
    const books = this.container.querySelectorAll('.floating-book');
    books.forEach((book, index) => {
      book.style.animation = `floatBook 3s ease-in-out ${index * 0.5}s infinite`;
      book.style.animationDelay = `${index * 0.7}s`;
    });
  }

  cleanupListeners() {
    this.eventListeners.forEach(({ element, handler }) => {
      if (element) {
        element.removeEventListener('click', handler);
      }
    });
    this.eventListeners = [];
  }

  show() {
    this.container.style.display = 'flex';
    // Trigger entrance animation
    requestAnimationFrame(() => {
      this.container.querySelector('.menu-content').classList.add('entered');
    });
  }

  hide() {
    const content = this.container.querySelector('.menu-content');
    if (content) {
      content.classList.remove('entered');
    }
    setTimeout(() => {
      this.container.style.display = 'none';
    }, 300);
  }

  destroy() {
    this.cleanupListeners();
    if (this.container.parentNode) {
      this.container.remove();
    }
  }
}