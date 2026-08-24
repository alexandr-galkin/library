import { CleanupManager } from '../core/CleanupManager.js';

/** DOM renderer. It consumes game data but never decides whether a move is valid. */
export class GameRenderer {
  constructor({ app, theme, documentRef = document, actions = {} } = {}) {
    if (!app) throw new Error('GameRenderer requires an app element');
    this.app = app; this.theme = theme; this.document = documentRef; this.actions = actions;
    this.elements = {}; this.cleanup = new CleanupManager(); this.timeouts = new Set(); this.build();
  }

  /** Build the complete game DOM. */
  build() { this.app.replaceChildren(); this.buildBackground(); this.buildTable(); this.buildHUD(); this.buildRuleBanner(); this.buildGameZones(); this.buildOverlays(); }
  /** Render the visual background. */
  buildBackground() { const background = this.document.createElement('div'); background.className = 'library-bg'; this.elements.bg = background; this.theme.renderBackground(background); this.app.append(background); }
  /** Create the fixed game field root. */
  buildTable() { const table = this.document.createElement('div'); table.className = 'game-table'; table.dataset.layoutManaged = 'true'; this.elements.table = table; this.app.append(table); }

  /** Build HUD controls and register their listeners with cleanup. */
  buildHUD() {
    const hud = this.document.createElement('div'); hud.className = 'hud-bar';
    const items = [['УРОВЕНЬ', 'hud-level', '1'], ['СЛОЖНОСТЬ', 'hud-diff', '1'], ['ХОДЫ', 'hud-moves', '0'], ['ОЧКИ', 'hud-score', '0']];
    for (const [label, id, value] of items) { const item = this.document.createElement('div'); item.className = 'hud-item'; item.append(`${label} `); const valueElement = this.document.createElement('span'); valueElement.id = id; valueElement.textContent = value; item.append(valueElement); hud.append(item); }
    const undo = this.document.createElement('button'); undo.className = 'menu-button undo-button'; undo.type = 'button'; undo.append('↶ ', 'Назад'); this.cleanup.listen(undo, 'click', () => this.actions.onUndo?.()); hud.append(undo);
    const menu = this.document.createElement('button'); menu.className = 'menu-button'; menu.type = 'button'; menu.append('☰ ', 'Меню'); this.cleanup.listen(menu, 'click', () => this.actions.onPause?.()); hud.append(menu);
    this.elements.hud = hud; this.elements.hudLevel = hud.querySelector('#hud-level'); this.elements.hudDiff = hud.querySelector('#hud-diff'); this.elements.hudMoves = hud.querySelector('#hud-moves'); this.elements.hudScore = hud.querySelector('#hud-score'); this.app.append(hud);
  }

  /** Build rule banner. */
  buildRuleBanner() { const banner = this.document.createElement('div'); banner.className = 'rule-banner'; const title = this.document.createElement('h2'); title.id = 'rule-text'; const subtitle = this.document.createElement('div'); subtitle.className = 'sub'; subtitle.id = 'rule-sub'; banner.append(title, subtitle); this.elements.ruleText = title; this.elements.ruleSub = subtitle; this.app.append(banner); }

  /** Build puzzle zones inside the game field so LayoutManager owns their coordinate system. */
  buildGameZones() {
    this.elements.objectsZone = this.document.createElement('div');
    this.elements.objectsZone.className = 'objects-zone';
    this.elements.objectsZone.hidden = true;
    this.elements.containersZone = this.document.createElement('div');
    this.elements.containersZone.className = 'containers-zone';
    this.elements.table.append(this.elements.objectsZone, this.elements.containersZone);
  }

  /** Build pause/fail overlays. */
  buildOverlays() { this.elements.failOverlay = this.createOverlay('fail-overlay', 'НЕТ ХОДОВ', 'Откати решение или начни уровень заново', [['retry', '↻ НАЧАТЬ ЗАНОВО', 'menu-btn-primary'], ['menu', '← В МЕНЮ', 'menu-btn-secondary']]); this.elements.pauseOverlay = this.createOverlay('pause-overlay', '⏸ ПАУЗА', 'Головоломка приостановлена', [['resume', '▶ ПРОДОЛЖИТЬ', 'menu-btn-primary'], ['settings', '⚙ НАСТРОЙКИ', 'menu-btn-secondary'], ['menu', '← В МЕНЮ', 'menu-btn-secondary']]); }

  /** @param {string} id @param {string} title @param {string} text @param {string[][]} buttons @returns {HTMLElement} */
  createOverlay(id, title, text, buttons) {
    const overlay = this.document.createElement('div'); overlay.className = 'modal-overlay'; overlay.id = id;
    const card = this.document.createElement('div'); card.className = 'modal-card'; const heading = this.document.createElement('div'); heading.className = 'modal-title'; heading.textContent = title; const description = this.document.createElement('p'); description.textContent = text; card.append(heading, description);
    for (const [action, label, className] of buttons) { const button = this.document.createElement('button'); button.className = `menu-btn ${className}`; button.type = 'button'; button.dataset.action = action; button.textContent = label; this.cleanup.listen(button, 'click', () => { this.hideOverlay(overlay); this.actions[`on${action[0].toUpperCase()}${action.slice(1)}`]?.(); }); card.append(button); }
    overlay.append(card); this.app.append(overlay); return overlay;
  }

  /** Update HUD values. */
  updateHUD(level, difficulty, score, moves = 0) { this.elements.hudLevel.textContent = String(level); this.elements.hudDiff.textContent = String(difficulty); this.elements.hudScore.textContent = String(score); this.elements.hudMoves.textContent = String(moves); }
  /** Set current puzzle rule text. */
  setRule(text, sub) { this.elements.ruleText.textContent = text ?? ''; this.elements.ruleSub.textContent = sub ? `${sub} · Берём только верхнюю книгу` : 'Берём только верхнюю книгу'; }

  /** Render all shelves from the current level model. */
  renderContainers(containers, objects = []) {
    const byId = new Map(objects.map(object => [object.uid, object])); const fragment = this.document.createDocumentFragment();
    for (const container of containers) {
      const element = this.document.createElement('div'); element.className = 'shelf-container'; if (container.type === 'empty') element.classList.add('empty-shelf'); element.dataset.id = container.id; element.dataset.capacity = String(container.capacity);
      const header = this.document.createElement('div'); header.className = 'shelf-header'; const label = this.document.createElement('div'); label.className = 'shelf-label'; label.textContent = container.type === 'empty' ? 'СВОБОДНАЯ ПОЛКА' : `ПОЛКА ${container.index + 1}`; const count = this.document.createElement('span'); count.className = 'shelf-count'; count.textContent = `${container.items.length}/${container.capacity}`; header.append(label, count);
      const items = this.document.createElement('div'); items.className = 'shelf-items';
      for (const [index, uid] of container.items.entries()) { const object = byId.get(uid); if (!object) continue; const book = this.theme.renderBook(object); book.classList.toggle('top-book', index === 0); items.append(book); }
      element.append(header, items); fragment.append(element);
    }
    this.elements.containersZone.replaceChildren(fragment);
  }

  /** Show a short move popup. */
  showPopup(x, y, text) { const element = this.document.createElement('div'); element.className = 'score-popup'; element.textContent = text; element.style.left = `${x}px`; element.style.top = `${y}px`; this.app.append(element); const timeout = this.document.defaultView?.setTimeout?.(() => { this.timeouts.delete(timeout); element.remove(); }, 700) ?? setTimeout(() => element.remove(), 700); this.timeouts.add(timeout); }
  /** @param {HTMLElement} overlay */ hideOverlay(overlay) { overlay?.classList.remove('active'); }
  /** Show failure overlay. */ showFail() { this.elements.failOverlay.classList.add('active'); }
  /** Hide failure overlay. */ hideFail() { this.hideOverlay(this.elements.failOverlay); }
  /** Show pause overlay. */ showPauseMenu() { this.elements.pauseOverlay.classList.add('active'); }
  /** Hide pause overlay. */ hidePauseMenu() { this.hideOverlay(this.elements.pauseOverlay); }

  /** Remove all DOM and event resources owned by the renderer. */
  destroy() { for (const timeout of this.timeouts) clearTimeout(timeout); this.timeouts.clear(); this.cleanup.cleanup(); this.elements = {}; this.app.replaceChildren(); }
}
