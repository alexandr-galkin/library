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
      ['ХОДЫ', 'hud-moves', '0'],
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
    const menu = this.document.createElement('button');
    menu.className = 'menu-button';
    menu.type = 'button';
    menu.append('☰ ', 'Меню');
    menu.addEventListener('click', () => this.actions.onPause?.());
    hud.append(menu);
    this.elements.hud = hud;
    this.elements.hudLevel = hud.querySelector('#hud-level');
    this.elements.hudDiff = hud.querySelector('#hud-diff');
    this.elements.hudMoves = hud.querySelector('#hud-moves');
    this.elements.hudScore = hud.querySelector('#hud-score');
    this.app.append(hud);
  }

  buildRuleBanner() {
    const banner = this.document.createElement('div');
    banner.className = 'rule-banner';
    const title = this.document.createElement('h2');
    title.id = 'rule-text';
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
    this.elements.objectsZone.hidden = true;
    this.elements.containersZone = this.document.createElement('div');
    this.elements.containersZone.className = 'containers-zone';
    this.app.append(this.elements.comboDisplay, this.elements.objectsZone, this.elements.containersZone);
  }

  buildOverlays() {
    this.elements.failOverlay = this.createOverlay('fail-overlay', 'НЕТ ХОДОВ', 'Откати решение или начни уровень заново', [
      ['retry', '↻ НАЧАТЬ ЗАНОВО', 'menu-btn-primary'],
      ['menu', '← В МЕНЮ', 'menu-btn-secondary'],
    ]);
    this.elements.pauseOverlay = this.createOverlay('pause-overlay', '⏸ ПАУЗА', 'Головоломка приостановлена', [
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

  updateHUD(level, difficulty, score, moves = 0) {
    this.elements.hudLevel.textContent = String(level);
    this.elements.hudDiff.textContent = String(difficulty);
    this.elements.hudScore.textContent = String(score);
    this.elements.hudMoves.textContent = String(moves);
  }

  setMoves(moves) { this.elements.hudMoves.textContent = String(moves); }
  showTimer() {}
  updateTimer() {}
  hideTimer() {}

  setRule(text, sub) {
    this.elements.ruleText.textContent = text ?? '';
    this.elements.ruleSub.textContent = sub ? `${sub} · Верхняя книга переносится первой` : 'Верхняя книга переносится первой';
  }

  renderObjects() { this.elements.objectsZone.replaceChildren(); }

  renderContainers(containers, objects = []) {
    const byId = new Map(objects.map(object => [object.uid, object]));
    const fragment = this.document.createDocumentFragment();
    for (const container of containers) {
      const element = this.document.createElement('div');
      element.className = 'shelf-container';
      if (container.type === 'empty') element.classList.add('empty-shelf');
      element.dataset.id = container.id;
      element.dataset.capacity = String(container.capacity);

      const header = this.document.createElement('div');
      header.className = 'shelf-header';
      const label = this.document.createElement('div');
      label.className = 'shelf-label';
      label.textContent = container.type === 'empty' ? 'СВОБОДНАЯ ПОЛКА' : `ПОЛКА ${container.index + 1}`;
      const count = this.document.createElement('span');
      count.className = 'shelf-count';
      count.textContent = `${container.items.length}/${container.capacity}`;
      header.append(label, count);

      const items = this.document.createElement('div');
      items.className = 'shelf-items';
      for (const uid of container.items) {
        const object = byId.get(uid);
        if (object) items.append(this.theme.renderBook(object));
      }
      element.append(header, items);
      fragment.append(element);
    }
    this.elements.containersZone.replaceChildren(fragment);
  }

  moveToContainer(bookElement, containerElement, level) {
    const items = containerElement?.querySelector('.shelf-items');
    if (!items || !bookElement || !level) return;
    const object = level.objects.find(item => item.uid === bookElement.dataset.uid);
    const source = object && level.containers.find(container => container.id === object.shelfId);
    const target = level.containers.find(container => container.id === containerElement.dataset.id);
    if (!object || !source || !target) return;

    source.items = source.items.filter(uid => uid !== object.uid);
    target.items.push(object.uid);
    object.shelfId = target.id;
    object.depth = target.items.length - 1;

    items.append(bookElement);
    bookElement.classList.remove('correct');
    const count = containerElement.querySelector('.shelf-count');
    if (count) count.textContent = `${target.items.length}/${target.capacity}`;
    const sourceElement = this.elements.containersZone.querySelector(`[data-id="${source.id}"]`);
    const sourceCount = sourceElement?.querySelector('.shelf-count');
    if (sourceCount) sourceCount.textContent = `${source.items.length}/${source.capacity}`;
    containerElement.classList.toggle('empty-shelf', target.items.length === 0);
    sourceElement?.classList.toggle('empty-shelf', source.items.length === 0);
  }

  isSolved(level) {
    return level.containers.every(container => {
      if (container.items.length === 0) return true;
      if (container.items.length !== level.capacity) return false;
      const colors = container.items.map(uid => level.objects.find(object => object.uid === uid)?.color);
      return colors.every(color => color && color === colors[0]);
    });
  }

  showFail() { this.elements.failOverlay.classList.add('active'); }
  hideFail() { this.hideOverlay(this.elements.failOverlay); }
  showPauseMenu() { this.elements.pauseOverlay.classList.add('active'); }
  hidePauseMenu() { this.hideOverlay(this.elements.pauseOverlay); }
  showCombo(combo) { this.elements.comboDisplay.textContent = `СЕРИЯ x${combo}`; this.elements.comboDisplay.classList.add('show'); }
  hideCombo() { this.elements.comboDisplay.classList.remove('show'); }

  showPopup(x, y, text) {
    const element = this.document.createElement('div');
    element.className = 'score-popup';
    element.textContent = text;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    this.app.append(element);
    const timeout = setTimeout(() => { this.timeouts.delete(timeout); element.remove(); }, 700);
    this.timeouts.add(timeout);
  }

  destroy() {
    for (const timeout of this.timeouts) clearTimeout(timeout);
    this.timeouts.clear();
    this.elements = {};
    this.app.replaceChildren();
  }
}
