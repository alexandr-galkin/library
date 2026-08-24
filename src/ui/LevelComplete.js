import { t } from '../i18n/index.js';

const STYLE_ID = 'library-level-complete-theme';

export class LevelComplete {
  constructor({ onNextLevel } = {}) {
    this.onNextLevel = onNextLevel;
    this.nextTimeout = null;
    this.style = document.getElementById(STYLE_ID) ?? document.createElement('style');
    this.style.id = STYLE_ID;
    this.style.textContent = `
      #level-complete-overlay { display:none; align-items:center; justify-content:center; padding:24px; }
      #level-complete-overlay .level-complete-card { width:min(430px, calc(100vw - 32px)); padding:34px 34px 28px; text-align:center; background:linear-gradient(180deg,#f3e7ce 0%,#e2d1ae 100%); border:1px solid #a88958; border-radius:7px; box-shadow:0 35px 90px rgba(0,0,0,.72),inset 0 1px rgba(255,248,224,.75),0 0 0 6px rgba(54,31,16,.24); position:relative; overflow:hidden; }
      #level-complete-overlay .level-complete-card::before { content:''; position:absolute; inset:9px; border:1px solid rgba(126,91,48,.22); border-radius:4px; pointer-events:none; }
      #level-complete-overlay .complete-header { position:relative; z-index:1; }
      #level-complete-overlay .complete-icon { width:44px; height:44px; margin:0 auto 9px; display:grid; place-items:center; border:1px solid rgba(159,121,65,.45); border-radius:50%; color:#9a7139; font-size:22px; box-shadow:inset 0 1px rgba(255,255,255,.55); }
      #level-complete-overlay .complete-kicker { margin-bottom:8px; color:#92754c; font:600 9px/1.2 Georgia,serif; letter-spacing:3px; text-transform:uppercase; }
      #level-complete-overlay .complete-title { color:#3b2819; font:700 25px/1.15 Georgia,'Times New Roman',serif; letter-spacing:2px; text-shadow:0 1px rgba(255,255,255,.65); }
      #level-complete-overlay .complete-level { margin-top:8px; color:#806646; font:italic 15px/1.4 Georgia,serif; }
      #level-complete-overlay .stars-container { display:flex; justify-content:center; gap:10px; margin:23px 0 20px; padding:11px 0; border-top:1px solid rgba(130,96,53,.2); border-bottom:1px solid rgba(130,96,53,.2); }
      #level-complete-overlay .complete-star { width:38px; height:38px; display:grid; place-items:center; color:#9a815d; font-size:24px; }
      #level-complete-overlay .complete-star.filled { color:#b58a42; text-shadow:0 2px 8px rgba(137,91,25,.25); }
      #level-complete-overlay .score-breakdown { position:relative; z-index:1; margin:0 0 22px; padding:3px 0; }
      #level-complete-overlay .score-row { display:flex; align-items:center; justify-content:space-between; padding:11px 4px; color:#745b3c; font:14px Georgia,serif; border-bottom:1px solid rgba(130,96,53,.14); }
      #level-complete-overlay .score-row span { display:flex; align-items:center; gap:10px; }
      #level-complete-overlay .score-row b { color:#a78a61; font:600 9px Georgia,serif; letter-spacing:1px; }
      #level-complete-overlay .score-row strong { color:#3f2b1b; font:700 15px Georgia,serif; }
      #level-complete-overlay .score-total { display:flex; justify-content:space-between; align-items:center; margin-top:13px; padding:14px 10px; border:1px solid rgba(164,125,66,.3); border-radius:4px; background:rgba(255,248,228,.34); color:#604729; font:700 11px Georgia,serif; letter-spacing:2px; }
      #level-complete-overlay .score-total strong { color:#9a7139; font-size:22px; letter-spacing:0; }
      #level-complete-overlay #btn-next-level { position:relative; z-index:1; width:100%; min-height:46px; display:flex; align-items:center; justify-content:space-between; padding:0 18px 0 20px; }
      @media (max-width:520px) { #level-complete-overlay .level-complete-card { padding:27px 22px 22px; } #level-complete-overlay .complete-title { font-size:21px; } }
    `;
    if (!this.style.parentNode) document.head.appendChild(this.style);

    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'level-complete-overlay';
    this.overlay.hidden = true;
    this.overlay.addEventListener('click', event => {
      const button = event.target.closest?.('#btn-next-level');
      if (!button || !this.overlay.contains(button)) return;
      this.hide();
      this.nextTimeout = setTimeout(() => { this.nextTimeout = null; this.onNextLevel?.(); }, 300);
    });
    document.body.appendChild(this.overlay);
  }

  show(level, score, timeBonus) {
    const baseScore = score - timeBonus;
    this.overlay.innerHTML = `
      <div class="modal-card level-complete-card">
        <div class="complete-header">
          <div class="complete-icon" aria-hidden="true">✦</div>
          <div class="complete-kicker">${t('complete.kicker')}</div>
          <div class="complete-title">${t('complete.title')}</div>
          <div class="complete-level">${t('complete.levelComplete', { level })}</div>
        </div>
        <div class="stars-container" aria-label="${t('complete.stars')}">${this.generateStars(3)}</div>
        <div class="score-breakdown">
          <div class="score-row"><span><b>01</b> ${t('complete.baseScore')}</span><strong>${baseScore}</strong></div>
          <div class="score-row"><span><b>02</b> ${t('complete.timeBonus')}</span><strong>+${timeBonus}</strong></div>
          <div class="score-total"><span>${t('complete.total')}</span><strong>${score}</strong></div>
        </div>
        <button id="btn-next-level" type="button" class="menu-btn menu-btn-primary">
          <span>${t('complete.next')}</span><span aria-hidden="true">→</span>
        </button>
      </div>
    `;
    this.overlay.hidden = false;
    this.overlay.style.display = 'flex';
  }

  generateStars(count) {
    return Array.from({ length: 3 }, (_, index) => `<div class="complete-star ${index < count ? 'filled' : ''}">${index < count ? '✦' : '◇'}</div>`).join('');
  }

  hide() { this.overlay.hidden = true; this.overlay.style.display = 'none'; }

  destroy() {
    if (this.nextTimeout) clearTimeout(this.nextTimeout);
    this.nextTimeout = null; this.overlay.remove(); this.onNextLevel = null;
    if (this.style?.parentNode) this.style.remove(); this.style = null;
  }
}
