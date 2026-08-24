export class LevelComplete {
  constructor({ onNextLevel } = {}) {
    this.onNextLevel = onNextLevel;
    this.nextTimeout = null;
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'level-complete-overlay';
    this.overlay.hidden = true;
    this.overlay.addEventListener('click', event => {
      const button = event.target.closest?.('#btn-next-level');
      if (!button || !this.overlay.contains(button)) return;
      this.hide();
      this.nextTimeout = setTimeout(() => {
        this.nextTimeout = null;
        this.onNextLevel?.();
      }, 300);
    });
    document.body.appendChild(this.overlay);
  }

  show(level, score, timeBonus) {
    const baseScore = score - timeBonus;
    this.overlay.innerHTML = `
      <div class="modal-card level-complete-card">
        <div class="complete-header">
          <div class="complete-icon" aria-hidden="true">✦</div>
          <div class="complete-kicker">LIBRARY • LEVEL COMPLETE</div>
          <div class="complete-title">КНИГИ РАЗЛОЖЕНЫ</div>
          <div class="complete-level">Уровень ${level} пройден</div>
        </div>
        <div class="stars-container" aria-label="Три звезды">${this.generateStars(3)}</div>
        <div class="score-breakdown">
          <div class="score-row"><span><b>01</b> Базовые очки</span><strong>${baseScore}</strong></div>
          <div class="score-row"><span><b>02</b> Бонус времени</span><strong>+${timeBonus}</strong></div>
          <div class="score-total"><span>ИТОГО</span><strong>${score}</strong></div>
        </div>
        <button id="btn-next-level" type="button" class="menu-btn menu-btn-primary">
          <span>СЛЕДУЮЩИЙ УРОВЕНЬ</span><span aria-hidden="true">→</span>
        </button>
      </div>
    `;
    this.overlay.hidden = false;
    this.overlay.style.display = 'flex';
  }

  generateStars(count) {
    return Array.from({ length: 3 }, (_, index) =>
      `<div class="complete-star ${index < count ? 'filled' : ''}">${index < count ? '✦' : '◇'}</div>`
    ).join('');
  }

  hide() {
    this.overlay.hidden = true;
    this.overlay.style.display = 'none';
  }

  destroy() {
    if (this.nextTimeout) clearTimeout(this.nextTimeout);
    this.nextTimeout = null;
    this.overlay.remove();
    this.onNextLevel = null;
  }
}
