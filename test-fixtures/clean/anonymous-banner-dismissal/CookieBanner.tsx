"use client";
import { useState } from "react";

// No auth anywhere in this file. "I closed this box" is genuinely per-device,
// and localStorage is exactly the right place for it. VC214 must not fire.
export function CookieBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("cookie-banner-dismissed") === "true",
  );
  if (dismissed) return null;
  return (
    <button onClick={() => { localStorage.setItem("cookie-banner-dismissed", "true"); setDismissed(true); }}>
      Got it
    </button>
  );
}
