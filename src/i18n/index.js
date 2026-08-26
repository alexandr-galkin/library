import ru from './ru.js';
import en from './en.js';

const locales = { ru, en };
const STORAGE_KEY = 'library-locale';
const DEFAULT_LOCALE = 'ru';

function normalizeLocale(locale) {
  const language = String(locale ?? '').toLowerCase().split('-')[0];
  return locales[language] ? language : null;
}

function readSavedLocale() {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
    return saved && locales[saved] ? saved : null;
  } catch {
    return null;
  }
}

function writeSavedLocale(locale) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage may be unavailable in embedded/private contexts.
  }
}

function detectLocale() {
  const saved = readSavedLocale();
  if (saved) return saved;
  const language = normalizeLocale(globalThis.navigator?.language);
  return language ?? DEFAULT_LOCALE;
}

let currentLocale = detectLocale();
const listeners = new Set();

export function setLocale(locale) {
  const normalized = normalizeLocale(locale);
  if (!normalized || normalized === currentLocale) return currentLocale;
  currentLocale = normalized;
  writeSavedLocale(normalized);
  listeners.forEach(listener => listener(currentLocale));
  return currentLocale;
}

/**
 * Applies the locale provided by the platform during startup.
 * A locale explicitly selected by the player is kept and has priority.
 */
export function setLocaleFromPlatform(locale) {
  if (readSavedLocale()) return currentLocale;
  const normalized = normalizeLocale(locale) ?? DEFAULT_LOCALE;
  if (normalized === currentLocale) return currentLocale;
  currentLocale = normalized;
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
