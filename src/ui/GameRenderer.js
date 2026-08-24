import { CleanupManager } from '../core/CleanupManager.js';
import { t } from '../i18n/index.js';

export class GameRenderer {
  constructor({ app, theme, documentRef = document, actions = {} } = {}) {
    if (!app) throw new Error('GameRenderer requires an app element');
    this.app = app; this.theme = theme; this.document = documentRef; this.actions = actions;
    this.elements = {}; this.cleanup = new CleanupManager(); this.timeouts = new Set(); this.build();
  }
  build() { this.app.replaceChildren(); this.buildBackground(); this.buildTable(); this.buildHUD(); this.buildRuleBanner(); this.buildGameZones(); this.buildOverlays(); }
  buildBackground() { const background = this.document.createElement('div'); background.className = 'library-bg'; this.elements.bg = background; this.theme.renderBackground(background); this.app.append(background); }
  buildTable() { const table = this.document.createElement('div'); table.className = 'game-table'; table.dataset.layoutManaged = 'true'; this.elements.table = table; this.app.append(table); }
  buildHUD() {
    const hud = this.document.createElement('div'); hud.className = 'hud-bar';
    const items = [[t('hud.level'), 'hud-level', '1'], [t('hud.difficulty'), 'hud-diff', '1'], [t('hud.moves'), 'hud-moves', '0'], [t('hud.score'), 'hud-score', '0']];
    for (const [label, id, value] of items) { const item = this.document.createElement('div'); item.className = 'hud-item'; item.append(`${label} `); const valueElement = this.document.createElement('span'); valueElement.id = id; valueElement.textContent = value; item.append(valueElement); hud.append(item); }
    const undo = this.document.createElement('button'); undo.className = 'menu-button undo-button'; undo.type = 'button'; undo.append('↶ ', t('hud.undo')); this.cleanup.listen(undo, 'click', () => this.actions.onUndo?.()); hud.append(undo);
    const menu = this.document.createElement('button'); menu.className = 'menu-button'; menu.type = 'button'; menu.append('☰ ', t('hud.menu')); this.cleanup.listen(menu, 'click', () => this.actions.onPause?.()); hud.append(menu);
    this.elements.hud = hud; this.elements.hudLevel = hud.querySelector('#hud-level'); this.elements.hudDiff = hud.querySelector('#hud-diff'); this.elements.hudMoves = hud.querySelector('#hud-moves'); this.elements.hudScore = hud.querySelector('#hud-score'); this.app.append(hud);
  }
  buildRuleBanner() { const banner = this.document.createElement('div'); banner.className = 'rule-banner'; const title = this.document.createElement('h2'); title.id = 'rule-text'; const subtitle = this.document.createElement('div'); subtitle.className = 'sub'; subtitle.id = 'rule-sub'; banner.append(title, subtitle); this.elements.ruleText = title; this.elements.ruleSub = subtitle; this.app.append(banner); }
  buildGameZones() { this.elements.objectsZone = this.document.createElement('div'); this.elements.objectsZone.className = 'objects-zone'; this.elements.objectsZone.hidden = true; this.elements.containersZone = this.document.createElement('div'); this.elements.containersZone.className = 'containers-zone'; this.elements.table.append(this.elements.objectsZone, this.elements.containersZone); }
  buildOverlays() {
    this.elements.failOverlay = this.createOverlay('fail-overlay', t('overlays.failTitle'), t('overlays.failText'), [['retry', `↻ ${t('overlays.retry')}`, 'menu-btn-primary'], ['menu', `← ${t('overlays.menu')}`, 'menu-btn-secondary']]);
    this.elements.pauseOverlay = this.createOverlay('pause-overlay', t('overlays.pauseTitle'), t('overlays.pauseText'), [['resume', `▶ ${t('overlays.resume')}`, 'menu-btn-primary'], ['settings', `⚙ ${t('overlays.settings')}`, 'menu-btn-secondary'], ['menu', `← ${t('overlays.menu')}`, 'menu-btn-secondary']]);
  }
  createOverlay(id, title, text, buttons) {
    const overlay = this.document.createElement('div'); overlay.className = 'modal-overlay'; overlay.id = id;
    const card = this.document.createElement('div'); card.className = 'modal-card'; const heading = this.document.createElement('div'); heading.className = 'modal-title'; heading.textContent = title; const description = this.document.createElement('p'); description.textContent = text; card.append(heading, description);
    for (const [action, label, className] of buttons) { const button = this.document.createElement('button'); button.className = `menu-btn ${className}`; button.type = 'button'; button.dataset.action = action; button.textContent = label; this.cleanup.listen(button, 'click', () => { this.hideOverlay(overlay); this.actions[`on${action[0].toUpperCase()}${action.slice(1)}`]?.(); }); card.append(button); }
    overlay.append(card); this.app.append(overlay); return overlay;
  }
  updateHUD(level, difficulty, score, moves = 0) { this.elements.hudLevel.textContent = String(level); this.elements.hudDiff.textContent = String(difficulty); this.elements.hudScore.textContent = String(score); this.elements.hudMoves.textContent = String(moves); }
  setRule(text, sub) { this.elements.ruleText.textContent = text ?? ''; this.elements.ruleSub.textContent = sub ? `${sub} · ${t('hud.topBook')}` : t('hud.topBook'); }
  renderContainers(containers, objects = []) { const byId = new Map(objects.map(object => [object.uid, object])); const fragment = this.document.createDocumentFragment(); for (const container of containers) { const element = this.document.createElement('div'); element.className = 'shelf-container'; if (container.type === 'empty') element.classList.add('empty-shelf'); element.dataset.id = container.id; element.dataset.capacity = String(container.capacity); const items = this.document.createElement('div'); items.className = 'shelf-items'; for (const [index, uid] of container.items.entries()) { const object = byId.get(uid); if (!object) continue; const book = this.theme.renderBook(object); book.classList.toggle('top-book', index === 0); items.append(book); } element.append(items); fragment.append(element); } this.elements.containersZone.replaceChildren(fragment); }
  showPopup(x, y, text) { const element = this.document.createElement('div'); element.className = 'score-popup'; element.textContent = text; element.style.left = `${x}px`; element.style.top = `${y}px`; this.app.append(element); const timeout = this.document.defaultView?.setTimeout?.(() => { this.timeouts.delete(timeout); element.remove(); }, 700) ?? setTimeout(() => element.remove(), 700); this.timeouts.add(timeout); }
  hideOverlay(overlay) { overlay?.classList.remove('active'); }
  showFail() { this.elements.failOverlay.classList.add('active'); }
  hideFail() { this.hideOverlay(this.elements.failOverlay); }
  showPauseMenu() { this.elements.pauseOverlay.classList.add('active'); }
  hidePauseMenu() { this.hideOverlay(this.elements.pauseOverlay); }
  destroy() { for (const timeout of this.timeouts) clearTimeout(timeout); this.timeouts.clear(); this.cleanup.cleanup(); this.elements = {}; this.app.replaceChildren(); }
}
