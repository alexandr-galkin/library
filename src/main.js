import { Game } from './game/Game.js';
import { initYandexSDK } from './platform/YandexSDK.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

// SDK is optional outside Yandex Games, so the game remains fully playable locally.
initYandexSDK();

new Game({ app });
