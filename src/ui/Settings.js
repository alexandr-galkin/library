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
                <button class="language-option ${locale === 'ru' ? 'active' : ''}" data-locale="ru">${t('settings.russian')}</button>
                <button class="language-option ${locale === 'en' ? 'active' : ''}" data-locale="en">${t('settings.english')}</button>
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
