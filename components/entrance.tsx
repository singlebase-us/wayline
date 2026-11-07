"use client";

import { useEffect, useRef } from "react";
import { startEntrance } from "@/lib/entrance";

export function Entrance() {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = element.current?.closest<HTMLElement>(".experience");
    if (root) return startEntrance(root, () => {});
  }, []);
  return (
    <div ref={element} className="entrance" hidden>
      <div className="entrance-backdrop" aria-hidden="true" />
      <canvas aria-hidden="true" />
      <div className="entrance-copy" aria-hidden="true">
        <div className="entrance-name">
          <span className="entrance-outline">WAYLINE</span>
          <span className="entrance-fill">WAYLINE</span>
        </div>
        <p className="entrance-note">Built with you, for the long run.</p>
        <i className="entrance-progress" />
      </div>
      <button type="button" className="entrance-skip">
        SKIP INTRO ↗
      </button>
    </div>
  );
}
