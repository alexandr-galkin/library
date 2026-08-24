export class GameUI {
  constructor({ app = document.getElementById('app'), theme, actions = {} } = {}) {
    if (!app) throw new Error('GameUI requires an #app element');
    this.app = app;
    this.theme = theme;
    this.actions = actions;
    this.elements = {};
    this.build();
  }

  build() {
    this.app.innerHTML = '';

    this.elements.bg = document.createElement('div');
    this.elements.bg.className = 'library-bg';
    this.app.append(this.elements.bg);
    this.theme.renderBackground(this.elements.bg);

    this.elements.table = document.createElement('div');
    this.elements.table.className = 'game-table';
    this.app.append(this.elements.table);

    this.buildHUD();
    this.buildRuleBanner();
    this.buildGameZones();
    this.buildOverlays();
  }

  buildHUD() {
    this.elements.hud = document.createElement('div');
    this.elements.hud.className = 'hud-bar';
    this.elements.hud.innerHTML = `
      <div class="hud-item">УРОВЕНЬ <span id="hud-level">1</span></div>
      <div class="hud-item">СЛОЖНОСТЬ <span id="hud-diff">1</span></div>
      <div class="hud-item">ОЧКИ <span id="hud-score">0</span></div>
      <div class="hud-item hud-timer" id="hud-timer" style="display:none">⏱ <span>30</span></div>
      <button class="menu-button" id="btn-menu" type="button"><span>☰</span><span>Меню</span></button>
    `;
    this.app.append(this.elements.hud);
    this.elements.hudLevel = this.elements.hud.querySelector('#hud-level');
    this.elements.hudDiff = this.elements.hud.querySelector('#hud-diff');
    this.elements.hudScore = this.elements.hud.querySelector('#hud-score');
    this.elements.hudTimer = this.elements.hud.querySelector('#hud-timer');
    this.elements.hudTimerSpan = this.elements.hudTimer.querySelector('span');
    this.elements.menuButton = this.elements.hud.querySelector('#btn-menu');
    this.elements.menuButton.addEventListener('click', () => this.actions.onPause?.());
  }

  buildRuleBanner() {
    this.elements.ruleBanner = document.createElement('div');
    this.elements.ruleBanner.className = 'rule-banner';
    this.elements.ruleBanner.innerHTML = '<h2 id="rule-text">РАЗЛОЖИ КНИГИ</h2><div class="sub" id="rule-sub"></div>';
    this.app.append(this.elements.ruleBanner);
    this.elements.ruleText = this.elements.ruleBanner.querySelector('#rule-text');
    this.elements.ruleSub = this.elements.ruleBanner.querySelector('#rule-sub');
  }

  buildGameZones() {
    this.elements.comboDisplay = document.createElement('div');
    this.elements.comboDisplay.className = 'combo-display';
    this.app.append(this.elements.comboDisplay);

    this.elements.objectsZone = document.createElement('div');
    this.elements.objectsZone.className = 'objects-zone';
    this.app.append(this.elements.objectsZone);

    this.elements.containersZone = document.createElement('div');
    this.elements.containersZone.className = 'containers-zone';
    this.app.append(this.elements.containersZone);
  }

  buildOverlays() {
    this.elements.failOverlay = this.createOverlay('fail-overlay', `
      <div class="modal-card">
        <div class="modal-title" style="color:var(--danger)">ВРЕМЯ ВЫШЛО!</div>
        <p>Попробуй ещё раз</p>
        <button class="menu-btn menu-btn-primary" data-action="retry" type="button">↻ ПОПРОБОВАТЬ СНОВА</button>
        <button class="menu-btn menu-btn-secondary" data-action="menu" type="button">← В МЕНЮ</button>
      </div>
    `);

    this.elements.pauseOverlay = this.createOverlay('pause-overlay', `
      <div class="modal-card">
        <div class="modal-title">⏸ ПАУЗА</div>
        <p>Игра приостановлена</p>
        <button class="menu-btn menu-btn-primary" data-action="resume" type="button">▶ ПРОДОЛЖИТЬ</button>
        <button class="menu-btn menu-btn-secondary" data-action="settings" type="button">⚙ НАСТРОЙКИ</button>
        <button class="menu-btn menu-btn-secondary" data-action="menu" type="button">← В МЕНЮ</button>
      </div>
    `);
  }

  createOverlay(id, html) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = id;
    overlay.innerHTML = html;
    overlay.addEventListener('click', event => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      this.hideOverlay(overlay);
      this.actions[`on${action[0].toUpperCase()}${action.slice(1)}`]?.();
    });
    document.body.append(overlay);
    return overlay;
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

  hideTimer() { this.elements.hudTimer.style.display = 'none'; }

  setRule(text, sub) {
    this.elements.ruleText.textContent = text;
    this.elements.ruleSub.textContent = sub || '';
  }

  renderObjects(objects) {
    const fragment = document.createDocumentFragment();
    for (const object of objects) fragment.append(this.theme.renderBook(object));
    this.elements.objectsZone.replaceChildren(fragment);
  }

  renderContainers(containers) {
    const fragment = document.createDocumentFragment();
    for (const container of containers) {
      const element = document.createElement('div');
      element.className = `shelf-container${container.type === 'forbidden' ? ' forbidden' : ''}`;
      element.dataset.id = container.id;
      element.innerHTML = `<div class="shelf-label">${container.label}</div><div class="shelf-items"></div>`;
      fragment.append(element);
    }
    this.elements.containersZone.replaceChildren(fragment);
  }

  moveToContainer(bookElement, containerElement) {
    const items = containerElement.querySelector('.shelf-items');
    if (!items) return;
    const svg = bookElement.querySelector('svg');
    if (!svg) return;
    const mini = document.createElement('div');
    mini.append(svg.cloneNode(true));
    mini.style.width = '28px';
    items.append(mini);
  }

  showFail() { this.elements.failOverlay.classList.add('active'); }
  hideFail() { this.elements.failOverlay.classList.remove('active'); }
  showPauseMenu() { this.elements.pauseOverlay.classList.add('active'); }
  hidePauseMenu() { this.elements.pauseOverlay.classList.remove('active'); }

  showCombo(combo) {
    this.elements.comboDisplay.textContent = `КОМБО x${combo}`;
    this.elements.comboDisplay.classList.add('show');
  }

  hideCombo() { this.elements.comboDisplay.classList.remove('show'); }

  showPopup(x, y, text) {
    const element = document.createElement('div');
    element.className = 'score-popup';
    element.textContent = text;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    document.body.append(element);
    setTimeout(() => element.remove(), 1000);
  }

  destroy() {
    this.elements.failOverlay?.remove();
    this.elements.pauseOverlay?.remove();
    this.elements = {};
  }
}
