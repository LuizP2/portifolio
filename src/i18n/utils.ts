import { defaultLocale, locales, ui, type Locale, type UIKey } from './ui';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Narrows Astro.currentLocale, which is typed as `string | undefined`. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Translator for one locale. A missing key is a compile error — there is no
 * runtime fallback to English, because a half-translated screen is exactly what
 * the brief forbids.
 */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key];
  };
}

/**
 * Turns a locale-independent path ("/", "/work/speake/") into the real URL for
 * one locale. The default locale carries no prefix, so existing English URLs
 * never move.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}
