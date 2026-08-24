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
    this.container.innerHTML = `
      <div class="menu-container">
        <div class="menu-background"><div class="menu-particles"></div></div>
        <div class="settings-content entered">
          <div class="settings-header"><h2 class="settings-title">⚙ НАСТРОЙКИ</h2><div class="settings-subtitle">Настрой игру под себя</div></div>
          <div class="settings-list">
            ${this.renderToggle('sound', '🔊', 'Звук', 'Звуковые эффекты', settings.sound)}
            ${this.renderToggle('anim', '✨', 'Анимации', 'Визуальные эффекты', settings.anim)}
            ${this.renderToggle('reduced', '🎯', 'Уменьшенная анимация', 'Для слабых устройств', settings.reduced)}
          </div>
          <button class="back-button" id="settings-back"><span class="back-icon">←</span><span>${this.fromGame ? 'Вернуться в игру' : 'Назад в меню'}</span></button>
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
