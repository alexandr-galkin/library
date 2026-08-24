export class LevelComplete {
  constructor(game) {
    this.game = game;
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'level-complete-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 200;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(26,18,12,0.85);
      backdrop-filter: blur(12px);
      padding: 20px;
    `;
    document.body.appendChild(this.overlay);
  }

  show(level, score, combo, mistakes, timeBonus, accuracyBonus, stars) {
    const baseScore = score - timeBonus - accuracyBonus;
    
    this.overlay.innerHTML = `
      <div class="modal-card" style="
        background: linear-gradient(180deg, #4a3525, #3d2b1f);
        border: 2px solid #5c4033;
        border-radius: 20px;
        padding: 28px;
        max-width: 360px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        text-align: center;
      ">
        <div class="complete-header" style="margin-bottom: 20px;">
          <div class="complete-icon" style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
          <div class="complete-title" style="
            font-size: 1.6rem;
            font-weight: 800;
            color: #e8d48b;
            margin-bottom: 8px;
          ">КНИГИ РАЗЛОЖЕНЫ!</div>
          <div class="complete-level" style="font-size: 0.9rem; color: #8b7b6b;">
            Уровень ${level} пройден
          </div>
        </div>
        
        <div class="stars-container" style="
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 24px;
        ">
          ${this.generateStars(stars)}
        </div>
        
        <div class="score-breakdown" style="margin-bottom: 24px;">
          <div class="score-row" style="
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(139,105,20,0.2);
          ">
            <span class="score-label" style="font-size: 0.9rem; color: #b8a88a;">📚 Базовые очки</span>
            <span class="score-value" style="font-size: 0.9rem; font-weight: 700; color: #e8d48b;">${baseScore}</span>
          </div>
          
          <div class="score-row" style="
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(139,105,20,0.2);
          ">
            <span class="score-label" style="font-size: 0.9rem; color: #b8a88a;">⏱ Бонус времени</span>
            <span class="score-value" style="font-size: 0.9rem; font-weight: 700; color: #4ecca3;">+${timeBonus}</span>
          </div>
          
          <div class="score-row" style="
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(139,105,20,0.2);
          ">
            <span class="score-label" style="font-size: 0.9rem; color: #b8a88a;">🎯 Бонус точности</span>
            <span class="score-value" style="font-size: 0.9rem; font-weight: 700; color: #4ecca3;">+${accuracyBonus}</span>
          </div>
          
          <div class="score-row" style="
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(139,105,20,0.2);
          ">
            <span class="score-label" style="font-size: 0.9rem; color: #b8a88a;">🔥 Комбо</span>
            <span class="score-value" style="font-size: 0.9rem; font-weight: 700; color: #e8d48b;">x${combo}</span>
          </div>
          
          <div class="score-row" style="
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: none;
          ">
            <span class="score-label" style="font-size: 0.9rem; color: #b8a88a;">❌ Ошибок</span>
            <span class="score-value" style="
              font-size: 0.9rem;
              font-weight: 700;
              color: ${mistakes === 0 ? '#4ecca3' : '#e8d48b'};
            ">${mistakes}</span>
          </div>
          
          <div class="score-total" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: rgba(201,162,39,0.1);
            border: 1px solid rgba(201,162,39,0.3);
            border-radius: 12px;
            margin-top: 16px;
            font-weight: 800;
            color: #e8d48b;
          ">
            <span>ИТОГО</span>
            <span class="total-value" style="font-size: 1.4rem; color: #e8d48b;">${score}</span>
          </div>
        </div>
        
        <button id="btn-next-level" style="
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #c9a227 0%, #b8860b 100%);
          color: #2a1f15;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <span>СЛЕДУЮЩИЙ УРОВЕНЬ</span>
          <span style="font-size: 1.2rem;">→</span>
        </button>
      </div>
    `;
    
    this.overlay.querySelector('#btn-next-level').addEventListener('click', () => {
      this.hide();
      setTimeout(() => this.game.nextLevel(), 300);
    });
    
    // Show overlay
    this.overlay.style.display = 'flex';
    
    // Add hover effect to button
    const nextBtn = this.overlay.querySelector('#btn-next-level');
    nextBtn.addEventListener('mouseenter', () => {
      nextBtn.style.transform = 'translateY(-2px)';
      nextBtn.style.boxShadow = '0 8px 24px rgba(201,162,39,0.4)';
    });
    nextBtn.addEventListener('mouseleave', () => {
      nextBtn.style.transform = 'translateY(0)';
      nextBtn.style.boxShadow = 'none';
    });
  }

  generateStars(count) {
    let stars = '';
    for (let i = 0; i < 3; i++) {
      const filled = i < count;
      stars += `
        <div style="
          font-size: 2.5rem;
          opacity: 1;
          transform: scale(1);
          ${filled ? 'filter: drop-shadow(0 0 10px rgba(255,215,0,0.5));' : ''}
        ">${filled ? '⭐' : '☆'}</div>
      `;
    }
    return stars;
  }

  hide() {
    this.overlay.style.display = 'none';
  }

  destroy() {
    if (this.overlay.parentNode) {
      this.overlay.remove();
    }
  }
}