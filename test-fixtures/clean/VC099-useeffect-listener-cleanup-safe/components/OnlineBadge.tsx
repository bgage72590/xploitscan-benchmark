"use client";

import { useEffect, useState } from "react";

// Shows a small "offline" pill when the browser loses its connection.
export function OnlineBadge() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const controller = new AbortController();
    window.addEventListener("online", () => setOnline(true), { signal: controller.signal });
    window.addEventListener("offline", () => setOnline(false), { signal: controller.signal });
    return () => controller.abort();
  }, []);

  if (online) return null;

  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Offline — changes will sync when you reconnect
    </span>
  );
}
