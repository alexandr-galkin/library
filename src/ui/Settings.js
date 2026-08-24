import { t, getLocale, setLocale } from '../i18n/index.js';

export class Settings {
  constructor({ getState, sound, onSettingChanged, onBack }) {
    this.getState = getState;
    this.sound = sound;
    this.onSettingChanged = onSettingChanged;
    this.onBack = onBack;
    this.container = document.createElement('div');
    this.container.className = 'menu-overlay';
    this.eventListeners = [];
    this.fromGame = false;
    this.render();
  }

  render() {
    const settings = this.getState().settings;
    this.cleanupListeners();
    const locale = getLocale();
    this.container.innerHTML = `
      <style>
        .language-setting .language-options {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          min-width: 190px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 12px;
          background: rgba(8,10,14,.72);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 6px 20px rgba(0,0,0,.18);
        }
        .language-setting .language-option {
          appearance: none;
          -webkit-appearance: none;
          flex: 1 1 0;
          min-width: 0;
          min-height: 42px;
          padding: 0 14px;
          border: 1px solid transparent;
          border-radius: 9px;
          background: transparent;
          color: rgba(255,255,255,.52);
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .12s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .language-setting .language-option:hover {
          color: rgba(255,255,255,.88);
          background: rgba(255,255,255,.055);
        }
        .language-setting .language-option:active {
          transform: scale(.97);
        }
        .language-setting .language-option.active {
          color: #fff;
          border-color: rgba(56,189,248,.34);
          background: linear-gradient(180deg, rgba(56,189,248,.18), rgba(139,92,246,.13));
          box-shadow: 0 0 18px rgba(56,189,248,.10), inset 0 1px 0 rgba(255,255,255,.10);
        }
        .language-setting .language-option:focus-visible {
          outline: 2px solid rgba(56,189,248,.8);
          outline-offset: 2px;
        }
        @media (max-width: 560px) {
          .language-setting .language-options { min-width: 150px; }
          .language-setting .language-option { min-height: 40px; padding: 0 9px; font-size: 11px; }
        }
      </style>
      <div class="menu-container">
        <div class="menu-background"><div class="menu-particles"></div></div>
        <div class="settings-content entered">
          <div class="settings-header"><h2 class="settings-title">${t('settings.title')}</h2><div class="settings-subtitle">${t('settings.subtitle')}</div></div>
          <div class="settings-list">
            ${this.renderToggle('sound', '🔊', t('settings.sound'), t('settings.soundDescription'), settings.sound)}
            ${this.renderToggle('anim', '✨', t('settings.animations'), t('settings.animationsDescription'), settings.anim)}
            ${this.renderToggle('reduced', '🎯', t('settings.reduced'), t('settings.reducedDescription'), settings.reduced)}
            <div class="setting-item language-setting">
              <div class="setting-info">
                <div class="setting-icon">🌐</div>
                <div class="setting-text">
                  <div class="setting-name">${t('settings.language')}</div>
                  <div class="setting-desc">${t('settings.languageDescription')}</div>
                </div>
              </div>
              <div class="language-options" role="group" aria-label="${t('settings.language')}">
                <button class="language-option ${locale === 'ru' ? 'active' : ''}" data-locale="ru" aria-pressed="${locale === 'ru'}">${t('settings.russian')}</button>
                <button class="language-option ${locale === 'en' ? 'active' : ''}" data-locale="en" aria-pressed="${locale === 'en'}">${t('settings.english')}</button>
              </div>
            </div>
          </div>
          <button class="back-button" id="settings-back"><span class="back-icon">←</span><span>${this.fromGame ? t('settings.backToGame') : t('settings.backToMenu')}</span></button>
        </div>
      </div>
    `;

    this.container.querySelectorAll('.toggle-switch').forEach(toggle => {
      const handler = () => {
        const key = toggle.dataset.key;
        const value = toggle.classList.toggle('active');
        this.onSettingChanged(key, value);
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => { toggle.style.transform = 'scale(1)'; }, 150);
      };
      toggle.addEventListener('click', handler);
      this.eventListeners.push({ element: toggle, handler });
    });

    this.container.querySelectorAll('.language-option').forEach(button => {
      const handler = () => {
        const locale = button.dataset.locale;
        if (!locale || locale === getLocale()) return;
        setLocale(locale);
        this.render();
        this.show();
      };
      button.addEventListener('click', handler);
      this.eventListeners.push({ element: button, handler });
    });

    const backButton = this.container.querySelector('#settings-back');
    const backHandler = () => this.onBack(this.fromGame);
    backButton?.addEventListener('click', backHandler);
    if (backButton) this.eventListeners.push({ element: backButton, handler: backHandler });
  }

  renderToggle(key, icon, name, description, active) {
    return `<div class="setting-item"><div class="setting-info"><div class="setting-icon">${icon}</div><div class="setting-text"><div class="setting-name">${name}</div><div class="setting-desc">${description}</div></div></div><div class="toggle-switch ${active ? 'active' : ''}" data-key="${key}"><div class="toggle-slider"></div></div></div>`;
  }

  cleanupListeners() {
    this.eventListeners.forEach(({ element, handler }) => element?.removeEventListener('click', handler));
    this.eventListeners = [];
  }

  show() {
    this.container.style.display = 'flex';
    const content = this.container.querySelector('.settings-content');
    content?.classList.add('entered');
    if (content) {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }
  }

  hide() {
    const content = this.container.querySelector('.settings-content');
    if (content) {
      content.classList.remove('entered');
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
    }
    setTimeout(() => { this.container.style.display = 'none'; }, 300);
  }

  destroy() {
    this.cleanupListeners();
    this.container.remove();
  }
}
