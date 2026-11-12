"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Phase = "idle" | "covering" | "loading" | "complete" | "leaving" | "error";
type Labels = { loading: string; failed: string; retry: string; cancel: string };
type RunTransition = (change: () => Promise<void>, labels: Labels) => Promise<void>;
const Context = createContext<RunTransition | null>(null);
// Matches the global loader in front-wayline-user (admin.wayline.studio).
const timing = { cover: 420, loading: 1250, complete: 450, leave: 500 };
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve,
  matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms));

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [labels, setLabels] = useState<Labels>({ loading: "", failed: "", retry: "", cancel: "" });
  const running = useRef(false);
  const retry = useRef<(() => Promise<void>) | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dismiss = useCallback(() => {
    setPhase("idle");
    running.current = false;
    previousFocus.current?.focus();
  }, []);
  const run = useCallback<RunTransition>(async (change, nextLabels) => {
    if (running.current) return;
    running.current = true;
    previousFocus.current = document.activeElement as HTMLElement;
    setLabels(nextLabels);
    retry.current = () => run(change, nextLabels);
    try {
      setPhase("covering");
      await wait(timing.cover);
      setPhase("loading");
      await Promise.all([change(), wait(timing.loading)]);
      setPhase("complete");
      await wait(timing.complete);
      setPhase("leaving");
      await wait(timing.leave);
      dismiss();
    } catch {
      // Do not show a completed bar for an unsuccessful language change.
      running.current = false;
      setPhase("error");
    }
  }, [dismiss]);
  return <Context.Provider value={run}>
    {children}
    {phase !== "idle" && createPortal(<LoadingScreen phase={phase} labels={labels}
      onRetry={() => { void retry.current?.(); }} onCancel={dismiss} />, document.body)}
  </Context.Provider>;
}

export function useGlobalTransition() {
  const run = useContext(Context);
  if (!run) throw new Error("GlobalLoadingProvider is required");
  return run;
}

function LoadingScreen({ phase, labels, onRetry, onCancel }: {
  phase: Phase; labels: Labels; onRetry: () => void; onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const done = phase === "complete" || phase === "leaving";
  useLayoutEffect(() => {
    const element = dialog.current!;
    element.showModal();
    element.focus();
    return () => element.close();
  }, []);
  return <dialog ref={dialog} tabIndex={-1} className="wl-global-loading" data-phase={phase}
    aria-label={labels.loading} onCancel={event => event.preventDefault()}>
    <div className="wl-global-loading__content" aria-busy={!done && phase !== "error"}>
      <LoadingWordmark />
      <div className="wl-global-loading__bar" role="progressbar" aria-label={labels.loading}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={done ? 100 : undefined}><span /></div>
      {phase === "error" && <div className="wl-global-loading__error">
        <p role="alert">{labels.failed}</p>
        <button type="button" onClick={onRetry}>{labels.retry}</button>
        <button type="button" onClick={onCancel}>{labels.cancel}</button>
      </div>}
    </div>
  </dialog>;
}

/** Outlined from public/fonts/dm-sans-700.ttf so the loading logo never swaps fonts. */
function LoadingWordmark() {
  return (
    <svg className="wl-global-loading__logo" viewBox="0 0 254 34" role="img" aria-label="Wayline" focusable="false" fill="currentColor">
      <path transform="translate(0 -5.2)" d="M7.14 34 .884 10.2H5.78L9.928 28.798L14.824 10.2H19.89L24.65 28.798L28.832 10.2H33.762L27.336 34H21.862L17.306 16.66L12.58 34Z M41.36 34 50.064 10.2H55.266L63.936 34H59.074L52.648 15.436L46.188 34ZM45.202 28.594 46.426 25.024H58.53L59.72 28.594Z M79.218 34V25.636L71.194 10.2H76.396L82.006 21.964H81.088L86.664 10.2H91.832L83.808 25.636V34Z M100.654 34V10.2H105.244V30.43H115.682V34Z M125.626 34V10.2H130.216V34Z M140.874 34V10.2H145.464L156.412 26.622V10.2H161.002V34H156.412L145.464 17.612V34Z M171.66 34V10.2H187.3V13.906H176.25V20.128H186.28V23.698H176.25V30.294H187.3V34Z" />
      <path d="M219 9h34l-1.732 3h-34zM211.494 22h34l-1.732 3h-34z" />
    </svg>
  );
}
