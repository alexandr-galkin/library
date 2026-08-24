import { Game } from './game/Game.js';
import { initYandexSDK, markGameReady } from './platform/YandexSDK.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

const sdkReady = initYandexSDK();
new Game({ app });
sdkReady.then(() => markGameReady());
