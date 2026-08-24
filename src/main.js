import { Game } from './game/Game.js';
import { initYandexSDK } from './platform/YandexSDK.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

async function bootstrap() {
  // Initialize the platform before constructing the UI so the first render
  // already uses the locale selected by Yandex Games.
  await initYandexSDK();
  new Game({ app });
}

void bootstrap();
