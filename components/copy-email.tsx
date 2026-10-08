"use client";
import { useEffect, useRef, useState } from "react";
import { email } from "@/lib/content";
export function CopyEmail() {
  const [status, setStatus] = useState("COPY EMAIL");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("EMAIL COPIED ✓");
    } catch {
      setStatus("OPEN YOUR EMAIL ↗");
      window.location.href = `mailto:${email}`;
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus("COPY EMAIL"), 2400);
  }
  return (
    <button className="copy-email" onClick={copy} aria-live="polite">
      {status}
    </button>
  );
}
