import ru from './ru.js';
import en from './en.js';

const locales = { ru, en };

function detectLocale() {
  const language = (globalThis.navigator?.language ?? 'en').toLowerCase();
  return language.startsWith('ru') ? 'ru' : 'en';
}

let currentLocale = detectLocale();

export function setLocale(locale) {
  if (locales[locale]) currentLocale = locale;
  return currentLocale;
}

export function getLocale() {
  return currentLocale;
}

export function t(key, variables = {}) {
  const value = key.split('.').reduce((result, part) => result?.[part], locales[currentLocale]);
  if (typeof value !== 'string') return key;
  return value.replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? `{${name}}`));
}
