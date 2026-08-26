import './styles/main.css';
import { Game } from './game/Game.js';
import { getLocale, onLocaleChanged, t } from './i18n/index.js';
import { initYandexSDK } from './platform/YandexSDK.js';

const app = document.getElementById('app');
const PLATFORM_LOCALE_WAIT_MS = 2500;

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
  const loadingStatus = document.querySelector('[data-i18n="loadingStatus"]');
  if (loadingStatus) loadingStatus.textContent = t('page.loadingStatus');
}

syncDocumentLocale();
onLocaleChanged(syncDocumentLocale);

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;
  loadingScreen.classList.add('is-hidden');
  window.setTimeout(() => loadingScreen.remove(), 300);
}

async function waitForPlatformLocale() {
  await Promise.race([
    initYandexSDK(),
    new Promise(resolve => window.setTimeout(resolve, PLATFORM_LOCALE_WAIT_MS)),
  ]);
}

async function bootstrap() {
  await waitForPlatformLocale();
  syncDocumentLocale();
  new Game({ app });
  hideLoadingScreen();
}

bootstrap().catch((error) => {
  console.error('[Game] bootstrap failed:', error);
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const text = loadingScreen.querySelector('[data-i18n="loadingStatus"]') ?? loadingScreen.querySelector('.loading-text');
    if (text) text.textContent = t('page.error');
  }
});
