"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { scenes } from "@/lib/content";

export function GalleryPreview({ index }: { index: number }) {
  const rotor = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | null>(null);
  const [initial] = useState(index);
  const previous = useRef(index);
  const angle = useRef(0);
  const scene = scenes[index];

  useLayoutEffect(() => {
    const element = rotor.current;
    if (!element || previous.current === index) return;
    const from = getComputedStyle(element).transform;
    animation.current?.cancel();
    const direction = Math.sign(index - previous.current);
    const start = angle.current;
    angle.current += direction * 180;
    previous.current = index;
    const face = Math.abs(angle.current / 180) % 2;
    const destination = element.children[face] as HTMLElement;
    destination.querySelector("img")!.src = `/intro/desktop-${index}.jpg`;
    destination.style.setProperty("--preview-border", scenes[index].secondary);
    element.style.transform = `rotateX(${angle.current}deg)`;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Reference preview: half-turn, 1 → .78 → 1 scale, 1100ms.
    animation.current = element.animate(
      [
        { transform: from === "none" ? "rotateX(0deg)" : from, offset: 0 },
        {
          transform: `rotateX(${start + direction * 54}deg) scale(.78)`,
          offset: 0.3,
        },
        {
          transform: `rotateX(${start + direction * 126}deg) scale(.78)`,
          offset: 0.7,
        },
        { transform: `rotateX(${angle.current}deg)`, offset: 1 },
      ],
      { duration: 1100, easing: "cubic-bezier(.6, 0, .18, 1)" },
    );
  }, [index]);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (motion.matches) animation.current?.cancel();
    };
    motion.addEventListener("change", stop);
    return () => {
      animation.current?.cancel();
      motion.removeEventListener("change", stop);
    };
  }, []);

  return (
    <a
      className="gallery-preview"
      href={scene.href}
      aria-label={`View ${scene.label}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        event.currentTarget.style.setProperty(
          "--preview-x",
          `${(x - 0.5) * 12}deg`,
        );
        event.currentTarget.style.setProperty(
          "--preview-y",
          `${(0.5 - y) * 10}deg`,
        );
        event.currentTarget.style.setProperty("--light-x", `${x * 100}%`);
        event.currentTarget.style.setProperty("--light-y", `${y * 100}%`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--preview-x", "0deg");
        event.currentTarget.style.setProperty("--preview-y", "0deg");
      }}
    >
      <span className="preview-tilt">
        <span className="preview-rotor" ref={rotor}>
          {[0, 1].map((face) => (
            <span
              className={`preview-face preview-face-${face}`}
              key={face}
              style={
                {
                  "--preview-border": scenes[initial].secondary,
                } as React.CSSProperties
              }
            >
              <img
                src={`/intro/desktop-${initial}.jpg`}
                alt=""
                draggable="false"
                width="518"
                height="440"
              />
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}
