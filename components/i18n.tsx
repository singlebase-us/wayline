"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useGlobalTransition } from "./global-loading";
import { messages } from "@/lib/messages";

import { isLocale, localizedHref, storageKey, locales, type Locale } from "@/lib/locales";
export { locales, languageNames, type Locale } from "@/lib/locales";
const Context = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "en", setLocale: () => {} });

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  // The route supplies the same language for static HTML and hydration.
  const [locale, update] = useState<Locale>(initialLocale);
  const runTransition = useGlobalTransition();
  const setLocale = useCallback(async (next: Locale) => {
    if (next === locale) return;
    const translate = (text: string) => locale === "en" ? text : messages[text]?.[locales.indexOf(locale) - 1] ?? text;
    await runTransition(async () => {
      const url = new URL(window.location.href);
      url.pathname = localizedHref(url.pathname, next);
      window.history.replaceState(null, "", url);
      flushSync(() => update(next));
      document.documentElement.lang = next;
      try { localStorage.setItem(storageKey, next); } catch { /* Storage is optional. */ }
      // Wait for the committed translations, their fonts and the next paint.
      await document.fonts.ready;
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    }, {
      loading: translate("Switching language"), failed: translate("Language change failed. Please try again."),
      retry: translate("Try again"), cancel: translate("Cancel"),
    });
  }, [locale, runTransition]);
  useEffect(() => {
    // An explicit locale URL always wins over a previous preference.
    try { localStorage.setItem(storageKey, initialLocale); } catch {}
  }, [initialLocale]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey && isLocale(event.newValue)) setLocale(event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [setLocale]);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function LocaleLink({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { locale } = useLocale();
  return <a {...props} href={localizedHref(href, locale)} />;
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
