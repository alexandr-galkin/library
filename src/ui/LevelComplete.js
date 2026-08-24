export class LevelComplete {
  constructor({ onNextLevel } = {}) {
    this.onNextLevel = onNextLevel;
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'level-complete-overlay';
    this.overlay.hidden = true;
    this.overlay.addEventListener('click', event => {
      const button = event.target.closest?.('#btn-next-level');
      if (!button || !this.overlay.contains(button)) return;
      this.hide();
      setTimeout(() => this.onNextLevel?.(), 300);
    });
    document.body.appendChild(this.overlay);
  }

  show(level, score, combo, timeBonus, accuracyBonus, stars) {
    const baseScore = score - timeBonus - accuracyBonus;
    this.overlay.innerHTML = `
      <div class="modal-card level-complete-card">
        <div class="complete-header">
          <div class="complete-icon">🎉</div>
          <div class="complete-title">КНИГИ РАЗЛОЖЕНЫ!</div>
          <div class="complete-level">Уровень ${level} пройден</div>
        </div>
        <div class="stars-container">${this.generateStars(stars)}</div>
        <div class="score-breakdown">
          <div class="score-row"><span>📚 Базовые очки</span><strong>${baseScore}</strong></div>
          <div class="score-row"><span>⏱ Бонус времени</span><strong>+${timeBonus}</strong></div>
          <div class="score-row"><span>🎯 Бонус точности</span><strong>+${accuracyBonus}</strong></div>
          <div class="score-row"><span>🔥 Комбо</span><strong>x${combo}</strong></div>
          <div class="score-total"><span>ИТОГО</span><strong>${score}</strong></div>
        </div>
        <button id="btn-next-level" type="button">
          <span>СЛЕДУЮЩИЙ УРОВЕНЬ</span><span>→</span>
        </button>
      </div>
    `;
    this.overlay.hidden = false;
    this.overlay.style.display = 'flex';
  }

  generateStars(count) {
    return Array.from({ length: 3 }, (_, index) =>
      `<div class="complete-star ${index < count ? 'filled' : ''}">${index < count ? '⭐' : '☆'}</div>`
    ).join('');
  }

  hide() {
    this.overlay.hidden = true;
    this.overlay.style.display = 'none';
  }

  destroy() {
    this.overlay.remove();
    this.onNextLevel = null;
  }
}
