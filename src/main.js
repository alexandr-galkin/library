import { Game } from './game/Game.js';
import { initYandexSDK } from './platform/YandexSDK.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

// Keep the browser/loading metadata in sync with the published game title.
document.title = 'Библиотека: Книжный порядок';
const loadingText = document.querySelector('[data-i18n="loading"]');
if (loadingText) loadingText.textContent = 'Библиотека: Книжный порядок';

async function bootstrap() {
  // Initialize the platform before constructing the UI so the first render
  // already uses the locale selected by Yandex Games.
  await initYandexSDK();
  new Game({ app });
}

void bootstrap();
