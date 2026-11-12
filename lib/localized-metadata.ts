import type { Metadata } from "next";
import { isLocale, locales, localizedHref } from "./locales";

export function localizedMetadata(metadata: Metadata, path: string, language: string): Metadata {
  if (!isLocale(language)) return {};
  return {
    ...metadata,
    alternates: {
      canonical: localizedHref(path, language),
      languages: Object.fromEntries([
        ...locales.map(locale => [locale, localizedHref(path, locale)]),
        ["x-default", path],
      ]),
    },
    openGraph: {
      ...metadata.openGraph,
      locale: { en: "en_US", "zh-CN": "zh_CN", "zh-TW": "zh_TW", ja: "ja_JP", ru: "ru_RU" }[language],
      url: localizedHref(path, language),
    },
  };
}
