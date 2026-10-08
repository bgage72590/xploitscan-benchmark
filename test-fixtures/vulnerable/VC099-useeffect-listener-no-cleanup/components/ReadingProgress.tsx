"use client";

import { useEffect, useState } from "react";

// Thin progress bar at the top of a blog post.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-indigo-500 transition-[width]" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
