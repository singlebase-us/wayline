export const locales = ["en", "zh-CN", "zh-TW", "ja", "ru"] as const;
export type Locale = typeof locales[number];
export const languageNames = ["English", "简体中文", "繁體中文", "日本語", "Русский"];
export const storageKey = "wayline.locale.v1";
export const isLocale = (value: string | null): value is Locale => locales.includes(value as Locale);

/** Keep fragments, queries, mail links and external URLs intact. */
export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const suffixStart = href.search(/[?#]/);
  const path = suffixStart < 0 ? href : href.slice(0, suffixStart);
  const suffix = suffixStart < 0 ? "" : href.slice(suffixStart);
  const parts = path.split("/");
  if (isLocale(parts[1])) parts.splice(1, 1);
  return `/${locale}${parts.join("/") || "/"}${suffix}`;
}
