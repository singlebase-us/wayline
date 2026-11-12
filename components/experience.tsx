"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "./i18n";
import gsap from "gsap";
import { scenes } from "@/lib/content";
import { Entrance } from "@/components/entrance";
import { GalleryPreview } from "@/components/gallery-preview";

export function Experience({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const lockedUntil = useRef(0);
  const reducedMotion = useRef(false);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const select = useCallback((next: number) => {
    if (root.current?.dataset.intro !== "complete") return;
    const clamped = Math.max(0, Math.min(scenes.length - 1, next));
    if (clamped === current.current) return;
    root.current?.style.setProperty(
      "--direction",
      String(clamped > current.current ? 1 : -1),
    );
    current.current = clamped;
    lockedUntil.current =
      performance.now() + (reducedMotion.current ? 200 : 950);
    setIndex(clamped);
    history.replaceState(null, "", `#${scenes[clamped].id}`);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      reducedMotion.current = motionQuery.matches;
    };
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    const initial = scenes.findIndex(
      (scene) => `#${scene.id}` === location.hash,
    );
    const startIndex = Math.max(0, initial);
    // Place every scene at its final position before switching to the
    // enhanced layout, with transitions off, so the cards don't visibly
    // stack and then fly apart (most noticeable when the intro is skipped).
    element.setAttribute("data-settling", "");
    element
      .querySelectorAll<HTMLElement>(".scene")
      .forEach((section, i) =>
        section.style.setProperty("--offset", String(i - startIndex)),
      );
    // Each card drifts on its own: random amplitude, rotation, period and phase.
    element.querySelectorAll<HTMLElement>(".visual-frame").forEach((frame) => {
      const rand = (min: number, max: number) =>
        min + Math.random() * (max - min);
      const sign = () => (Math.random() < 0.5 ? -1 : 1);
      frame.style.setProperty("--fx", `${(sign() * rand(4, 9)).toFixed(1)}px`);
      frame.style.setProperty("--fy", `${(sign() * rand(5, 11)).toFixed(1)}px`);
      frame.style.setProperty(
        "--fr",
        `${(sign() * rand(0.25, 0.7)).toFixed(2)}deg`,
      );
      frame.style.setProperty("--fd", `${rand(7, 12).toFixed(2)}s`);
      frame.style.setProperty("--fdelay", `${rand(0, 1.2).toFixed(2)}s`);
    });
    element.setAttribute("data-enhanced", "true");
    // Scale factor between the fixed card design (519×440) and the live card.
    const firstCard = element.querySelector<HTMLElement>(".visual-link");
    const updateCardScale = () => {
      if (firstCard)
        element.style.setProperty(
          "--card-scale",
          String(firstCard.offsetWidth / 519),
        );
    };
    updateCardScale();
    const cardObserver = new ResizeObserver(updateCardScale);
    if (firstCard) cardObserver.observe(firstCard);
    let settleFrame = requestAnimationFrame(() => {
      settleFrame = requestAnimationFrame(() =>
        element.removeAttribute("data-settling"),
      );
    });
    if (initial > 0) {
      current.current = initial;
      setIndex(initial);
    }
    let wheelSum = 0;
    let lastWheel = 0;
    let start: { x: number; y: number; id: number } | null = null;
    let didDrag = false;
    let frame = 0;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || innerHeight <= 600) return;
      event.preventDefault();
      const now = performance.now();
      if (now < lockedUntil.current) {
        wheelSum = 0;
        return;
      }
      if (now - lastWheel > 180) wheelSum = 0;
      lastWheel = now;
      const delta =
        Math.abs(event.deltaY) > Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      wheelSum += delta * (event.deltaMode === 1 ? 16 : 1);
      if (Math.abs(wheelSum) >= 45) {
        select(current.current + Math.sign(wheelSum));
        wheelSum = 0;
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      if ((event.target as HTMLElement).closest("input,textarea,select,button"))
        return;
      const keys: Record<string, number> = {
        ArrowDown: 1,
        ArrowRight: 1,
        PageDown: 1,
        ArrowUp: -1,
        ArrowLeft: -1,
        PageUp: -1,
      };
      if (keys[event.key]) {
        event.preventDefault();
        select(current.current + keys[event.key]);
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        select(event.key === "Home" ? 0 : scenes.length - 1);
      }
    };
    const onDown = (event: PointerEvent) => {
      if (element.dataset.intro !== "complete") return;
      if (
        event.button !== 0 ||
        (event.target as HTMLElement).closest(
          "button,.site-header,.text-link,.gallery-preview",
        )
      )
        return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      didDrag = false;
    };
    const onMove = (event: PointerEvent) => {
      if (element.dataset.intro !== "complete") return;
      if (
        start &&
        Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12
      ) {
        didDrag = true;
        setDragging(true);
      }
      if (event.pointerType !== "mouse" || reducedMotion.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty(
          "--parallax-x",
          `${(event.clientX / innerWidth - 0.5) * 12}px`,
        );
        element.style.setProperty(
          "--parallax-y",
          `${(event.clientY / innerHeight - 0.5) * 12}px`,
        );
        const cursor = element.querySelector<HTMLElement>(".gallery-cursor");
        if (cursor) {
          cursor.style.transform = `translate3d(${event.clientX - 34}px,${event.clientY - 34}px,0)`;
          cursor.classList.toggle(
            "is-visible",
            !!(event.target as HTMLElement).closest("a.visual-link"),
          );
        }
      });
    };
    const onUp = (event: PointerEvent) => {
      if (!start || start.id !== event.pointerId) return;
      const dx = start.x - event.clientX,
        dy = start.y - event.clientY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 45)
        select(
          current.current + Math.sign(Math.abs(dx) > Math.abs(dy) ? dx : dy),
        );
      start = null;
      setDragging(false);
    };
    const onCancel = () => {
      start = null;
      didDrag = false;
      setDragging(false);
    };
    const onClick = (event: MouseEvent) => {
      if (didDrag) {
        event.preventDefault();
        didDrag = false;
        return;
      }
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a",
      );
      if (
        !link ||
        link.origin !== location.origin ||
        !link.pathname.startsWith("/") ||
        link.pathname === "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      if (reducedMotion.current) return;
      event.preventDefault();
      element.classList.add("is-leaving");
      transitionTimer = setTimeout(() => {
        location.href = link.href;
      }, 450);
    };
    const onHash = () => {
      const next = scenes.findIndex(
        (scene) => `#${scene.id}` === location.hash,
      );
      if (next >= 0) select(next);
    };
    const onPageShow = () => element.classList.remove("is-leaving");
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("click", onClick, true);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
      cardObserver.disconnect();
      element.removeAttribute("data-settling");
      motionQuery.removeEventListener("change", updateMotion);
      clearTimeout(transitionTimer);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("click", onClick, true);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [select]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.style.setProperty("--active-bg", scenes[index].color);
    element.style.setProperty("--active-ink", scenes[index].ink);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", scenes[index].color);
    const sections = Array.from(
      element.querySelectorAll<HTMLElement>(".scene"),
    );
    sections.forEach((section, i) => {
      section.classList.toggle("is-active", i === index);
      section.style.setProperty("--offset", String(i - index));
      section.inert = i !== index;
      section.setAttribute("aria-hidden", String(i !== index));
      section.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        link.tabIndex = i === index ? 0 : -1;
      });
    });
    if (reducedMotion.current || element.dataset.intro !== "complete") return;
    const context = gsap.context(() => {
      gsap.fromTo(
        sections[index].querySelectorAll(
          ".title-line,.scene-description,.text-link",
        ),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          delay: 0.12,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
    }, element);
    return () => context.revert();
  }, [index]);

  return (
    <div ref={root} className={`experience${dragging ? " is-dragging" : ""}`}>
      {children}
      <nav className="scene-nav" aria-label={t("Choose a section")}>
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            aria-label={t(scene.label)}
            aria-current={i === index ? "step" : undefined}
            onClick={() => select(i)}
          >
            <span className="dot-label">{t(scene.label)}</span>
            <span className="nav-dot" />
          </button>
        ))}
      </nav>
      <GalleryPreview index={index} />
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {t(scenes[index].label)}
      </span>
      <div className="gallery-cursor" aria-hidden="true">
        {t(dragging ? "DRAG" : "VIEW")}
        <span>↗</span>
      </div>
      <div className="page-wipe" aria-hidden="true" />
      <Entrance />
    </div>
  );
}
