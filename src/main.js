import './styles/main.css';
import { Game } from './game/Game.js';
import { getLocale, onLocaleChanged, t } from './i18n/index.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Application root #app was not found');
}

function syncDocumentLocale() {
  document.documentElement.lang = getLocale();
  document.title = t('page.title');
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', t('page.description'));
  const loadingText = document.querySelector('[data-i18n="loading"]');
  if (loadingText) loadingText.textContent = t('page.loading');
}

syncDocumentLocale();
onLocaleChanged(syncDocumentLocale);

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  loadingScreen.classList.add('is-hidden');
  window.setTimeout(() => loadingScreen.remove(), 300);
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
    if (text) text.textContent = t('page.error');
  }
}
