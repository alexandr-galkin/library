import { t } from '../i18n/index.js';

export class LevelComplete {
  constructor({ onNextLevel } = {}) {
    this.onNextLevel = onNextLevel; this.nextTimeout = null;
    this.overlay = document.createElement('div'); this.overlay.className = 'modal-overlay'; this.overlay.id = 'level-complete-overlay'; this.overlay.hidden = true;
    this.overlay.addEventListener('click', event => { const button = event.target.closest?.('#btn-next-level'); if (!button || !this.overlay.contains(button)) return; this.hide(); this.nextTimeout = setTimeout(() => { this.nextTimeout = null; this.onNextLevel?.(); }, 300); }); document.body.appendChild(this.overlay);
  }
  show(level, score, timeBonus, stars = 1, remaining = 0) {
    const baseScore = score - timeBonus; const starCount = Math.max(1, Math.min(3, Number(stars) || 1));
    this.overlay.innerHTML = `<div class="modal-card level-complete-card"><div class="complete-header"><div class="complete-icon">✦</div><div class="complete-kicker">${t('complete.kicker')}</div><div class="complete-title">${t('complete.title')}</div><div class="complete-level">${t('complete.levelComplete',{level})}</div></div><div class="stars-container" aria-label="${t('complete.stars')}">${this.generateStars(starCount)}</div><div class="score-breakdown"><div class="score-row"><span><b>01</b> ${t('complete.baseScore')}</span><strong>${baseScore}</strong></div><div class="score-row"><span><b>02</b> ${t('complete.timeBonus')}</span><strong>+${timeBonus}</strong></div><div class="score-row"><span><b>03</b> ${t('complete.timeLeft')}</span><strong>${this.formatTime(remaining)}</strong></div><div class="score-total"><span>${t('complete.total')}</span><strong>${score}</strong></div></div><button id="btn-next-level" type="button" class="menu-btn menu-btn-primary"><span>${t('complete.next')}</span><span>→</span></button></div>`;
    this.overlay.hidden = false; this.overlay.classList.add('active');
  }
  generateStars(count) { return Array.from({length:3},(_,index)=>`<div class="complete-star ${index<count?'filled':''}">${index<count?'✦':'◇'}</div>`).join(''); }
  formatTime(seconds) { const value=Math.max(0,Math.floor(Number(seconds)||0)); return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`; }
  hide(){this.overlay.classList.remove('active');this.overlay.hidden=true;}
  destroy(){if(this.nextTimeout)clearTimeout(this.nextTimeout);this.nextTimeout=null;this.overlay.remove();this.onNextLevel=null;}
}
