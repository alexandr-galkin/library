import { Game } from './game/Game.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

new Game({ app });
