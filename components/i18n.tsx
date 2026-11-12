"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { messages } from "@/lib/messages";

export const locales = ["en", "zh-CN", "zh-TW", "ja", "ru"] as const;
export type Locale = typeof locales[number];
export const languageNames = ["English", "简体中文", "繁體中文", "日本語", "Русский"];
const storageKey = "wayline.locale.v1";
const isLocale = (value: string | null): value is Locale => locales.includes(value as Locale);
const Context = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, update] = useState<Locale>("en");
  const setLocale = useCallback((next: Locale) => {
    update(next);
    document.documentElement.lang = next;
    try { localStorage.setItem(storageKey, next); } catch { /* Storage can be unavailable in private browsing. */ }
  }, []);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch {}
    if (isLocale(saved)) setLocale(saved);
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey && isLocale(event.newValue)) {
        update(event.newValue);
        document.documentElement.lang = event.newValue;
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [setLocale]);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLocale() {
  const context = useContext(Context);
  const t = useCallback((text: string) => {
    if (context.locale === "en") return text;
    return messages[text]?.[locales.indexOf(context.locale) - 1] ?? text;
  }, [context.locale]);
  return { ...context, t };
}

export function T({ children }: { children: string }) {
  const { t } = useLocale();
  return <>{t(children)}</>;
}

/** Localizes accessible labels and responsive table labels without converting pages to client components. */
export function Labelled({ as: Tag, children, ...props }: React.HTMLAttributes<HTMLElement> & { as: "nav" | "ul" | "td"; "data-label"?: string }) {
  const { t } = useLocale();
  return <Tag {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} data-label={props["data-label"] ? t(props["data-label"]) : undefined}>{children}</Tag>;
}
