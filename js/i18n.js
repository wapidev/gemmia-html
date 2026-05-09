// Tiny i18n engine.
// On language change: scans the DOM for [data-i18n] elements and swaps their text/innerHTML
// to the matching key in the active language's content map.
//
// Use [data-i18n-html] to mark elements whose translation contains markup (default: text-only).

import { CONTENT } from './content.js';

const STORAGE_KEY = 'gemmia.lang';
const DEFAULT_LANG = 'en';
const subscribers = new Set();

let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY))
  || (navigator.language?.startsWith('es') ? 'es' : DEFAULT_LANG);

export function getLang() {
  return currentLang;
}

export function t(key) {
  return CONTENT[currentLang]?.[key] ?? CONTENT[DEFAULT_LANG]?.[key] ?? key;
}

/** Subscribe to language changes. Returns an unsubscribe function. */
export function onLangChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function setLang(lang) {
  if (!CONTENT[lang] || lang === currentLang) return;
  currentLang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  document.documentElement.lang = lang;
  applyTranslations(document);
  subscribers.forEach((fn) => fn(lang));
}

/** Walk the given root and apply translations to every [data-i18n] element. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (el.hasAttribute('data-i18n-html')) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  // Sync the language toggle UI
  root.querySelectorAll('.lang-btn').forEach((btn) => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

export function initI18n() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  applyTranslations(document);
}
