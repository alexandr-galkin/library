import ru from './ru.js';
import en from './en.js';

const locales = { ru, en };
const STORAGE_KEY = 'library-locale';

function detectLocale() {
  const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
  if (saved && locales[saved]) return saved;
  const language = (globalThis.navigator?.language ?? 'en').toLowerCase();
  return language.startsWith('ru') ? 'ru' : 'en';
}

let currentLocale = detectLocale();
const listeners = new Set();

export function setLocale(locale) {
  if (!locales[locale] || locale === currentLocale) return currentLocale;
  currentLocale = locale;
  globalThis.localStorage?.setItem(STORAGE_KEY, locale);
  listeners.forEach(listener => listener(currentLocale));
  return currentLocale;
}

export function getLocale() {
  return currentLocale;
}

export function onLocaleChanged(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function t(key, variables = {}) {
  const value = key.split('.').reduce((result, part) => result?.[part], locales[currentLocale]);
  if (typeof value !== 'string') return key;
  return value.replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? `{${name}}`));
}
