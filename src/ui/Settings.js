export class Settings {
  constructor(game) {
    this.game = game;
    this.container = document.createElement('div');
    this.container.className = 'menu-overlay';
    this.eventListeners = [];
    this.fromGame = false;
    this.render();
  }

  render() {
    const s = this.game.state.data.settings;
    
    this.cleanupListeners();
    
    this.container.innerHTML = `
      <div class="menu-container">
        <div class="menu-background">
          <div class="menu-particles"></div>
        </div>
        
        <div class="settings-content entered">
          <div class="settings-header">
            <h2 class="settings-title">⚙ НАСТРОЙКИ</h2>
            <div class="settings-subtitle">Настрой игру под себя</div>
          </div>
          
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon">🔊</div>
                <div class="setting-text">
                  <div class="setting-name">Звук</div>
                  <div class="setting-desc">Звуковые эффекты</div>
                </div>
              </div>
              <div class="toggle-switch ${s.sound ? 'active' : ''}" data-key="sound">
                <div class="toggle-slider"></div>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon">✨</div>
                <div class="setting-text">
                  <div class="setting-name">Анимации</div>
                  <div class="setting-desc">Визуальные эффекты</div>
                </div>
              </div>
              <div class="toggle-switch ${s.anim ? 'active' : ''}" data-key="anim">
                <div class="toggle-slider"></div>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-icon">🎯</div>
                <div class="setting-text">
                  <div class="setting-name">Уменьшенная анимация</div>
                  <div class="setting-desc">Для слабых устройств</div>
                </div>
              </div>
              <div class="toggle-switch ${s.reduced ? 'active' : ''}" data-key="reduced">
                <div class="toggle-slider"></div>
              </div>
            </div>
          </div>
          
          <button class="back-button" id="settings-back">
            <span class="back-icon">←</span>
            <span>${this.fromGame ? 'Вернуться в игру' : 'Назад в меню'}</span>
          </button>
        </div>
      </div>
    `;
    
    // Add toggle listeners
    this.container.querySelectorAll('.toggle-switch').forEach(toggle => {
      const toggleHandler = () => {
        const key = toggle.dataset.key;
        const isOn = toggle.classList.toggle('active');
        
        // Update game state
        this.game.state.data.settings[key] = isOn;
        this.game.state.save();
        
        // Apply settings immediately
        this.applySetting(key, isOn);
        
        // Add animation
        toggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
          toggle.style.transform = 'scale(1)';
        }, 150);
      };
      
      toggle.addEventListener('click', toggleHandler);
      this.eventListeners.push({ element: toggle, handler: toggleHandler });
    });
    
    // Add back button listener
    const backBtn = this.container.querySelector('#settings-back');
    if (backBtn) {
      const backHandler = () => {
        if (this.fromGame) {
          this.fromGame = false;
          this.hide();
          this.game.resumeGame();
        } else {
          this.game.showMenu();
        }
      };
      backBtn.addEventListener('click', backHandler);
      this.eventListeners.push({ element: backBtn, handler: backHandler });
    }
  }

  applySetting(key, value) {
    switch (key) {
      case 'sound':
        this.game.sound.enabled = value;
        if (value) {
          this.game.sound.init();
          this.game.sound.playPick();
        }
        break;
      case 'anim':
        this.game.animations = value;
        break;
      case 'reduced':
        document.body.classList.toggle('reduced-motion', value);
        break;
    }
  }

  cleanupListeners() {
    this.eventListeners.forEach(({ element, handler }) => {
      if (element) {
        element.removeEventListener('click', handler);
      }
    });
    this.eventListeners = [];
  }

  show() {
    this.container.style.display = 'flex';
    const content = this.container.querySelector('.settings-content');
    if (content) {
      content.classList.add('entered');
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
    setTimeout(() => {
      this.container.style.display = 'none';
    }, 300);
  }

  destroy() {
    this.cleanupListeners();
    if (this.container.parentNode) {
      this.container.remove();
    }
  }
}