import { Game } from './game/Game.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

// Keep the browser/loading metadata in sync with the published game title.
document.title = 'Библиотека: Книжный порядок';
const loadingText = document.querySelector('[data-i18n="loading"]');
if (loadingText) loadingText.textContent = 'Библиотека: Книжный порядок';

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  loadingScreen.style.opacity = '0';
  loadingScreen.style.transition = 'opacity 0.25s ease';
  window.setTimeout(() => loadingScreen.remove(), 250);
}

function bootstrap() {
  // Do not block the first render on Yandex SDK/network initialization.
  // Game initializes the platform in the background after mounting the UI.
  new Game({ app });
  hideLoadingScreen();
}

try {
  bootstrap();
} catch (error) {
  console.error('[Game] bootstrap failed:', error);
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const text = loadingScreen.querySelector('.loading-text');
    if (text) text.textContent = 'Не удалось загрузить игру';
  }
}
