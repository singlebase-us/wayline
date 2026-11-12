"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "./i18n";
import { email } from "@/lib/content";

/** Clicking copies the address and shows a small confirmation.
 *  If the clipboard is unavailable, it falls back to opening mail. */
export function CopyEmailLink({
  className,
  label = email,
  subject,
}: {
  className?: string;
  label?: string;
  subject?: string;
}) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  return (
    <span className="copy-link-wrap">
      <a
        className={className}
        href={href}
        onClick={async (event) => {
          if (!navigator.clipboard) return;
          event.preventDefault();
          try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
          } catch {
            location.href = href;
          }
        }}
      >
        {label}{" "}
        <span aria-hidden="true" className="copy-icon">
          {copied ? "✓" : "↗"}
        </span>
      </a>
      <span className={`copy-pop${copied ? " is-visible" : ""}`} aria-hidden="true">
        {t("Copied to clipboard")}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? t("Email address copied to clipboard") : ""}
      </span>
    </span>
  );
}
