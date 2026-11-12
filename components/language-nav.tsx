"use client";

import { useEffect, useId, useRef, useState } from "react";
import { languageNames, locales, useLocale } from "./i18n";

export function LanguageNav({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>(`[lang="${locale}"]`)?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, locale]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return (
    <div className="language-nav" ref={root} data-open={open} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
    }}>
      <div className="language-nav-stage t-page-slide" data-page={open ? "1" : "2"}>
        <div className="nav-group t-page" data-page-id="2" inert={open} aria-hidden={open}>{children}</div>
        <div id={id} className="language-options t-page" data-page-id="1" inert={!open} aria-hidden={!open} role="group" aria-label={t("Choose language")}
          onKeyDown={(event) => {
            const buttons = Array.from(event.currentTarget.querySelectorAll("button"));
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            const next = event.key === "ArrowRight" ? (index + 1) % buttons.length : event.key === "ArrowLeft" ? (index + buttons.length - 1) % buttons.length : event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : -1;
            if (next >= 0) { event.preventDefault(); buttons[next].focus(); }
          }}>
          {locales.map((value, i) => <button key={value} type="button" lang={value} aria-pressed={locale === value} onClick={() => { setLocale(value); close(); }}>{languageNames[i]}</button>)}
        </div>
      </div>
      <button ref={trigger} className="language-trigger" type="button" aria-label={t("Choose language")} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5c4 2 10 2 14 0M5 17.5c4-2 10-2 14 0"/></svg>
      </button>
    </div>
  );
}
