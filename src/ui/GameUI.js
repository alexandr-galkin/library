export class GameUI {
  constructor(game) {
    this.game = game;
    this.app = document.getElementById('app');
    this.elements = {};
    this.build();
  }

  build() {
    this.app.innerHTML = '';
    
    // Background
    this.elements.bg = document.createElement('div');
    this.elements.bg.className = 'library-bg';
    this.app.appendChild(this.elements.bg);
    this.game.theme.renderBackground(this.elements.bg);
    this.game.theme.injectStyles();

    // Table
    const table = document.createElement('div');
    table.className = 'game-table';
    this.app.appendChild(table);

    // HUD
    this.elements.hud = document.createElement('div');
    this.elements.hud.className = 'hud-bar';
    this.elements.hud.innerHTML = `
      <div class="hud-item">УРОВЕНЬ <span id="hud-level">1</span></div>
      <div class="hud-item">СЛОЖНОСТЬ <span id="hud-diff">1</span></div>
      <div class="hud-item">ОЧКИ <span id="hud-score">0</span></div>
      <div class="hud-item hud-timer" id="hud-timer" style="display:none">
        ⏱ <span>30</span>
      </div>
      <button class="menu-button" id="btn-menu">
        <span class="menu-icon">☰</span>
        <span class="menu-text">Меню</span>
      </button>
    `;
    this.app.appendChild(this.elements.hud);

    // Cache HUD elements
    this.elements.hudLevel = this.elements.hud.querySelector('#hud-level');
    this.elements.hudDiff = this.elements.hud.querySelector('#hud-diff');
    this.elements.hudScore = this.elements.hud.querySelector('#hud-score');
    this.elements.hudTimer = this.elements.hud.querySelector('#hud-timer');
    this.elements.hudTimerSpan = this.elements.hudTimer.querySelector('span');
    this.elements.menuButton = this.elements.hud.querySelector('#btn-menu');

    // Add menu button listener
    this.elements.menuButton.addEventListener('click', () => {
      this.showPauseMenu();
    });

    // Rule banner
    this.elements.ruleBanner = document.createElement('div');
    this.elements.ruleBanner.className = 'rule-banner';
    this.elements.ruleBanner.innerHTML = `
      <h2 id="rule-text">РАЗЛОЖИ КНИГИ</h2>
      <div class="sub" id="rule-sub"></div>
    `;
    this.app.appendChild(this.elements.ruleBanner);
    
    this.elements.ruleText = this.elements.ruleBanner.querySelector('#rule-text');
    this.elements.ruleSub = this.elements.ruleBanner.querySelector('#rule-sub');

    // Combo display
    this.elements.comboDisplay = document.createElement('div');
    this.elements.comboDisplay.className = 'combo-display';
    this.elements.comboDisplay.id = 'combo-display';
    this.elements.comboDisplay.textContent = 'КОМБО x2';
    this.app.appendChild(this.elements.comboDisplay);

    // Objects zone
    this.elements.objectsZone = document.createElement('div');
    this.elements.objectsZone.className = 'objects-zone';
    this.elements.objectsZone.id = 'objects-zone';
    this.app.appendChild(this.elements.objectsZone);

    // Containers zone
    this.elements.containersZone = document.createElement('div');
    this.elements.containersZone.className = 'containers-zone';
    this.elements.containersZone.id = 'containers-zone';
    this.app.appendChild(this.elements.containersZone);

    // Fail overlay
    this.elements.failOverlay = document.createElement('div');
    this.elements.failOverlay.className = 'modal-overlay';
    this.elements.failOverlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-title" style="color:var(--danger)">ВРЕМЯ ВЫШЛО!</div>
        <p style="margin:12px 0;color:var(--text2)">Попробуй ещё раз</p>
        <button class="menu-btn menu-btn-primary" id="btn-retry">↻ ПОПРОБОВАТЬ СНОВА</button>
        <button class="menu-btn menu-btn-secondary" id="btn-menu-fail">← В МЕНЮ</button>
      </div>
    `;
    
    this.elements.failOverlay.querySelector('#btn-retry').addEventListener('click', () => {
      this.hideFail();
      this.game.retryLevel();
    });
    
    this.elements.failOverlay.querySelector('#btn-menu-fail').addEventListener('click', () => {
      this.hideFail();
      this.game.showMenu();
    });
    
    document.body.appendChild(this.elements.failOverlay);

    // Pause menu overlay
    this.elements.pauseOverlay = document.createElement('div');
    this.elements.pauseOverlay.className = 'modal-overlay';
    this.elements.pauseOverlay.id = 'pause-overlay';
    this.elements.pauseOverlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-title">⏸ ПАУЗА</div>
        <p style="margin:12px 0;color:var(--text2)">Игра приостановлена</p>
        <button class="menu-btn menu-btn-primary" id="btn-resume">▶ ПРОДОЛЖИТЬ</button>
        <button class="menu-btn menu-btn-secondary" id="btn-settings-pause">⚙ НАСТРОЙКИ</button>
        <button class="menu-btn menu-btn-secondary" id="btn-menu-pause">← В МЕНЮ</button>
      </div>
    `;
    
    // Add event listeners
    const resumeBtn = this.elements.pauseOverlay.querySelector('#btn-resume');
    const settingsBtn = this.elements.pauseOverlay.querySelector('#btn-settings-pause');
    const menuBtn = this.elements.pauseOverlay.querySelector('#btn-menu-pause');
    
    resumeBtn.addEventListener('click', () => {
      this.hidePauseMenu();
      this.game.resumeGame();
    });
    
    settingsBtn.addEventListener('click', () => {
      this.hidePauseMenu();
      this.game.showSettingsFromGame();
    });
    
    menuBtn.addEventListener('click', () => {
      this.hidePauseMenu();
      this.game.showMenu();
    });
    
    document.body.appendChild(this.elements.pauseOverlay);
  }

  updateHUD(level, difficulty, score) {
    this.elements.hudLevel.textContent = level;
    this.elements.hudDiff.textContent = difficulty;
    this.elements.hudScore.textContent = score;
  }

  showTimer(time) {
    this.elements.hudTimer.style.display = 'block';
    this.updateTimer(time, false);
  }

  updateTimer(time, warning) {
    this.elements.hudTimerSpan.textContent = time;
    this.elements.hudTimer.classList.toggle('warning', warning);
  }

  hideTimer() {
    this.elements.hudTimer.style.display = 'none';
  }

  setRule(text, sub) {
    this.elements.ruleText.textContent = text;
    this.elements.ruleSub.textContent = sub || '';
  }

  renderObjects(objects, theme) {
    this.elements.objectsZone.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    objects.forEach(obj => {
      const bookEl = theme.renderBook(obj);
      fragment.appendChild(bookEl);
    });
    
    this.elements.objectsZone.appendChild(fragment);
  }

  renderContainers(containers) {
    this.elements.containersZone.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    containers.forEach(cont => {
      const el = document.createElement('div');
      el.className = 'shelf-container' + (cont.type === 'forbidden' ? ' forbidden' : '');
      el.dataset.id = cont.id;
      el.innerHTML = `
        <div class="shelf-label">${cont.label}</div>
        <div class="shelf-items"></div>
      `;
      fragment.appendChild(el);
    });
    
    this.elements.containersZone.appendChild(fragment);
  }

  moveToContainer(bookEl, containerEl) {
    const items = containerEl.querySelector('.shelf-items');
    const mini = document.createElement('div');
    mini.innerHTML = bookEl.querySelector('svg').outerHTML;
    mini.style.width = '28px';
    mini.style.height = 'auto';
    items.appendChild(mini);
  }

  showFail() {
    this.elements.failOverlay.classList.add('active');
  }

  hideFail() {
    this.elements.failOverlay.classList.remove('active');
  }

  showPauseMenu() {
    this.elements.pauseOverlay.classList.add('active');
    this.game.pauseGame();
  }

  hidePauseMenu() {
    this.elements.pauseOverlay.classList.remove('active');
  }

  showCombo(combo) {
    this.elements.comboDisplay.textContent = 'КОМБО x' + combo;
    this.elements.comboDisplay.classList.add('show');
  }

  hideCombo() {
    this.elements.comboDisplay.classList.remove('show');
  }

  showPopup(x, y, text) {
    const el = document.createElement('div');
    el.className = 'score-popup';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    
    setTimeout(() => {
      if (el.parentNode) {
        el.remove();
      }
    }, 1000);
  }

  destroy() {
    if (this.elements.failOverlay && this.elements.failOverlay.parentNode) {
      this.elements.failOverlay.remove();
    }
    
    if (this.elements.pauseOverlay && this.elements.pauseOverlay.parentNode) {
      this.elements.pauseOverlay.remove();
    }
    
    // Clear references
    this.elements = {};
  }
}