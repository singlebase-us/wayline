import { createIntroRenderer, type IntroRenderer } from "./intro-renderer";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
// Source card-position easing: cubic-bezier(.4, 0, .3, 1).
function unfoldEase(value: number) {
  let low = 0,
    high = 1,
    t = value;
  for (let i = 0; i < 12; i++) {
    const x = 3 * (1 - t) ** 2 * t * 0.4 + 3 * (1 - t) * t * t * 0.3 + t ** 3;
    if (x < value) low = t;
    else high = t;
    t = (low + high) / 2;
  }
  return 3 * (1 - t) * t * t + t ** 3;
}

const SEEN_KEY = "wayline:intro-seen";

/** Play the intro on the first visit in a tab and on every refresh;
 *  skip it when returning to the home page from another page. */
function shouldSkipForVisit() {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") return false;
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: intro simply plays again */
  }
}

export function startEntrance(
  root: HTMLElement,
  onComplete: () => void,
  assetBase = "/intro",
) {
  const overlay = root.querySelector<HTMLElement>(".entrance")!;
  const canvas = overlay.querySelector("canvas")!;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false,
    finished = false,
    frame = 0;
  let renderer: IntroRenderer | null = null;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  const content = Array.from(root.children).filter(
    (node): node is HTMLElement =>
      node instanceof HTMLElement && node !== overlay,
  );
  const inertBefore = content.map((node) => node.inert);
  const unlock = () =>
    content.forEach((node, i) => {
      node.inert = inertBefore[i];
    });
  const finish = () => {
    if (disposed || finished) return;
    finished = true;
    markSeen();
    cancelAnimationFrame(frame);
    clearTimeout(deadline);
    renderer?.dispose();
    renderer = null;
    root.dataset.intro = "complete";
    root.style.removeProperty("--intro-ui");
    overlay.hidden = true;
    unlock();
    onComplete();
  };
  const onVisibility = () => {
    if (document.hidden) finish();
  };
  const onMotion = () => {
    if (motion.matches) finish();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    finish();
  };
  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") finish();
  };
  window.addEventListener("resize", finish);
  window.addEventListener("keydown", onEscape);
  document.addEventListener("visibilitychange", onVisibility);
  motion.addEventListener("change", onMotion);
  canvas.addEventListener("webglcontextlost", onContextLost);
  const skip = overlay.querySelector<HTMLButtonElement>(".entrance-skip")!;
  skip.addEventListener("click", finish);

  const run = async () => {
    const skipVisit = shouldSkipForVisit();
    if (
      skipVisit ||
      motion.matches ||
      innerHeight <= 600 ||
      (location.hash && location.hash !== "#overview")
    ) {
      finish();
      return;
    }
    root.dataset.intro = "loading";
    overlay.hidden = false;
    overlay.style.setProperty("--load", "0");
    overlay.style.setProperty("--wipe", "0%");
    overlay.style.setProperty("--canvas-alpha", "1");
    root.style.setProperty("--intro-ui", "0");
    root.style.setProperty("--intro-cards", "0");
    content.forEach((node) => {
      node.inert = true;
    });
    // A failed/slow decorative texture must never keep the page behind a loader.
    deadline = setTimeout(finish, 6500);
    const mobile = innerWidth <= 800;
    const images = Array.from({ length: mobile ? 0 : 6 }, (_, i) => {
      const img = new Image();
      img.src = `${assetBase}/${mobile ? "mobile" : "desktop"}-${i}.jpg`;
      return img;
    });
    let assetTimer: ReturnType<typeof setTimeout> | undefined;
    const ready = await Promise.race([
      Promise.all([
        document.fonts.ready,
        ...images.map((img) => img.decode()),
      ]).then(
        () => true,
        () => false,
      ),
      new Promise<false>((resolve) => {
        assetTimer = setTimeout(() => resolve(false), 1600);
      }),
    ]);
    clearTimeout(assetTimer);
    if (disposed || finished) return;
    if (!ready) {
      finish();
      return;
    }
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".visual-link"),
    );
    renderer = mobile ? null : createIntroRenderer(canvas, cards, images);
    if (!mobile && !renderer) {
      finish();
      return;
    }
    root.dataset.introRenderer = mobile ? "dom" : "webgl";
    // Reduced asset count replaces the original network-dependent readiness.
    const loadingDuration = mobile ? 750 : 2225;
    const origin = performance.now();
    const draw = (now: number) => {
      if (disposed || finished) return;
      const elapsed = now - origin;
      const progress = Math.sin(
        (clamp(elapsed / loadingDuration) * Math.PI) / 2,
      );
      const exit = 1 - (1 - clamp((elapsed - loadingDuration) / 370)) ** 2;
      const unfold = unfoldEase(clamp((elapsed - loadingDuration) / 820));
      const handoff = unfoldEase(
        clamp((elapsed - loadingDuration - 370) / 600),
      );
      // Cross-fade to the DOM cards only once the WebGL cards have fully
      // landed on them (handoff ends at +970ms), so the two never disagree.
      const crossfade = mobile
        ? exit
        : clamp((elapsed - loadingDuration - 990) / 200);
      overlay.style.setProperty("--load", String(progress));
      overlay.style.setProperty("--wipe", `${exit * 100}%`);
      overlay.style.setProperty("--canvas-alpha", String(1 - crossfade));
      root.style.setProperty("--intro-ui", String(exit));
      root.style.setProperty("--intro-cards", String(crossfade));
      renderer?.render(progress, unfold, handoff);
      if (elapsed > loadingDuration + (mobile ? 370 : 1200)) {
        finish();
        return;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  };
  void run().catch(finish);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    clearTimeout(deadline);
    renderer?.dispose();
    unlock();
    window.removeEventListener("resize", finish);
    window.removeEventListener("keydown", onEscape);
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    skip.removeEventListener("click", finish);
  };
}
