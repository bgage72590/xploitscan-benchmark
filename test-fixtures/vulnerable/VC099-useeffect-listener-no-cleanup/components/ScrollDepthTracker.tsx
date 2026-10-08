"use client";

import { useEffectOnce } from "react-use";
import posthog from "posthog-js";

const MILESTONES = [25, 50, 75, 100];

// Reports how far down the landing page visitors scroll.
export function ScrollDepthTracker() {
  useEffectOnce(() => {
    const reached = new Set<number>();
    window.addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const depth = max > 0 ? Math.round((window.scrollY / max) * 100) : 100;
      for (const m of MILESTONES) {
        if (depth >= m && !reached.has(m)) {
          reached.add(m);
          posthog.capture("scroll_depth", { percent: m });
        }
      }
    });
  });

  return null;
}
