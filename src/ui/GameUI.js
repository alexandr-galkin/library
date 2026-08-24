export class GameUI {
  constructor({ app, theme, documentRef = document, actions = {} } = {}) {
    if (!app) throw new Error('GameUI requires an app element');
    this.app = app;
    this.theme = theme;
    this.document = documentRef;
    this.actions = actions;
    this.elements = {};
    this.timeouts = new Set();
    this.build();
  }

  build() {
    this.app.replaceChildren();
    this.buildBackground();
    this.buildTable();
    this.buildHUD();
    this.buildRuleBanner();
    this.buildGameZones();
    this.buildOverlays();
  }

  buildBackground() {
    const background = this.document.createElement('div');
    background.className = 'library-bg';
    this.elements.bg = background;
    this.app.append(background);
    this.theme.renderBackground(background);
  }

  buildTable() {
    this.elements.table = this.document.createElement('div');
    this.elements.table.className = 'game-table';
    this.app.append(this.elements.table);
  }

  buildHUD() {
    const hud = this.document.createElement('div');
    hud.className = 'hud-bar';
    const items = [
      ['УРОВЕНЬ', 'hud-level', '1'],
      ['СЛОЖНОСТЬ', 'hud-diff', '1'],
      ['ОЧКИ', 'hud-score', '0'],
    ];
    for (const [label, id, value] of items) {
      const item = this.document.createElement('div');
      item.className = 'hud-item';
      item.append(`${label} `);
      const valueElement = this.document.createElement('span');
      valueElement.id = id;
      valueElement.textContent = value;
      item.append(valueElement);
      hud.append(item);
    }

    const timer = this.document.createElement('div');
    timer.className = 'hud-item hud-timer';
    timer.hidden = true;
    timer.append('⏱ ');
    const timerValue = this.document.createElement('span');
    timerValue.textContent = '30';
    timer.append(timerValue);
    hud.append(timer);

    const menu = this.document.createElement('button');
    menu.className = 'menu-button';
    menu.type = 'button';
    menu.append('☰ ', 'Меню');
    menu.addEventListener('click', () => this.actions.onPause?.());
    hud.append(menu);

    this.elements.hud = hud;
    this.elements.hudLevel = hud.querySelector('#hud-level');
    this.elements.hudDiff = hud.querySelector('#hud-diff');
    this.elements.hudScore = hud.querySelector('#hud-score');
    this.elements.hudTimer = timer;
    this.elements.hudTimerSpan = timerValue;
    this.app.append(hud);
  }

  buildRuleBanner() {
    const banner = this.document.createElement('div');
    banner.className = 'rule-banner';
    const title = this.document.createElement('h2');
    title.id = 'rule-text';
    title.textContent = 'РАЗЛОЖИ КНИГИ';
    const subtitle = this.document.createElement('div');
    subtitle.className = 'sub';
    subtitle.id = 'rule-sub';
    banner.append(title, subtitle);
    this.elements.ruleBanner = banner;
    this.elements.ruleText = title;
    this.elements.ruleSub = subtitle;
    this.app.append(banner);
  }

  buildGameZones() {
    this.elements.comboDisplay = this.document.createElement('div');
    this.elements.comboDisplay.className = 'combo-display';
    this.elements.objectsZone = this.document.createElement('div');
    this.elements.objectsZone.className = 'objects-zone';
    this.elements.containersZone = this.document.createElement('div');
    this.elements.containersZone.className = 'containers-zone';
    this.app.append(this.elements.comboDisplay, this.elements.objectsZone, this.elements.containersZone);
  }

  buildOverlays() {
    this.elements.failOverlay = this.createOverlay('fail-overlay', 'ВРЕМЯ ВЫШЛО!', 'Попробуй ещё раз', [
      ['retry', '↻ ПОПРОБОВАТЬ СНОВА', 'menu-btn-primary'],
      ['menu', '← В МЕНЮ', 'menu-btn-secondary'],
    ]);
    this.elements.pauseOverlay = this.createOverlay('pause-overlay', '⏸ ПАУЗА', 'Игра приостановлена', [
      ['resume', '▶ ПРОДОЛЖИТЬ', 'menu-btn-primary'],
      ['settings', '⚙ НАСТРОЙКИ', 'menu-btn-secondary'],
      ['menu', '← В МЕНЮ', 'menu-btn-secondary'],
    ]);
  }

  createOverlay(id, title, text, buttons) {
    const overlay = this.document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = id;
    const card = this.document.createElement('div');
    card.className = 'modal-card';
    const heading = this.document.createElement('div');
    heading.className = 'modal-title';
    heading.textContent = title;
    const description = this.document.createElement('p');
    description.textContent = text;
    card.append(heading, description);
    for (const [action, label, className] of buttons) {
      const button = this.document.createElement('button');
      button.className = `menu-btn ${className}`;
      button.type = 'button';
      button.dataset.action = action;
      button.textContent = label;
      button.addEventListener('click', () => {
        this.hideOverlay(overlay);
        this.actions[`on${action[0].toUpperCase()}${action.slice(1)}`]?.();
      });
      card.append(button);
    }
    overlay.append(card);
    this.app.append(overlay);
    return overlay;
  }

  hideOverlay(overlay) { overlay?.classList.remove('active'); }

  updateHUD(level, difficulty, score) {
    this.elements.hudLevel.textContent = String(level);
    this.elements.hudDiff.textContent = String(difficulty);
    this.elements.hudScore.textContent = String(score);
  }

  showTimer(time) { this.elements.hudTimer.hidden = false; this.updateTimer(time, false); }
  updateTimer(time, warning) {
    this.elements.hudTimerSpan.textContent = String(time);
    this.elements.hudTimer.classList.toggle('warning', Boolean(warning));
  }
  hideTimer() { this.elements.hudTimer.hidden = true; }

  setRule(text, sub) {
    this.elements.ruleText.textContent = text ?? '';
    this.elements.ruleSub.textContent = sub ?? '';
  }

  renderObjects(objects) {
    const fragment = this.document.createDocumentFragment();
    for (const object of objects) fragment.append(this.theme.renderBook(object));
    this.elements.objectsZone.replaceChildren(fragment);
  }

  renderContainers(containers) {
    const fragment = this.document.createDocumentFragment();
    for (const container of containers) {
      const element = this.document.createElement('div');
      element.className = 'shelf-container';
      if (container.type === 'forbidden') element.classList.add('forbidden');
      element.dataset.id = container.id;
      const label = this.document.createElement('div');
      label.className = 'shelf-label';
      label.textContent = container.label ?? '';
      const items = this.document.createElement('div');
      items.className = 'shelf-items';
      element.append(label, items);
      fragment.append(element);
    }
    this.elements.containersZone.replaceChildren(fragment);
  }

  moveToContainer(bookElement, containerElement) {
    const items = containerElement?.querySelector('.shelf-items');
    const svg = bookElement?.querySelector('svg');
    if (!items || !svg) return;
    const mini = this.document.createElement('div');
    mini.append(svg.cloneNode(true));
    mini.style.width = '28px';
    items.append(mini);
  }

  showFail() { this.elements.failOverlay.classList.add('active'); }
  hideFail() { this.hideOverlay(this.elements.failOverlay); }
  showPauseMenu() { this.elements.pauseOverlay.classList.add('active'); }
  hidePauseMenu() { this.hideOverlay(this.elements.pauseOverlay); }

  showCombo(combo) {
    this.elements.comboDisplay.textContent = `КОМБО x${combo}`;
    this.elements.comboDisplay.classList.add('show');
  }
  hideCombo() { this.elements.comboDisplay.classList.remove('show'); }

  showPopup(x, y, text) {
    const element = this.document.createElement('div');
    element.className = 'score-popup';
    element.textContent = text;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    this.app.append(element);
    const timeout = this.windowSetTimeout(() => {
      this.timeouts.delete(timeout);
      element.remove();
    }, 1000);
    this.timeouts.add(timeout);
  }

  windowSetTimeout(callback, delay) {
    return setTimeout(callback, delay);
  }

  destroy() {
    for (const timeout of this.timeouts) clearTimeout(timeout);
    this.timeouts.clear();
    this.elements = {};
    this.app.replaceChildren();
  }
}
