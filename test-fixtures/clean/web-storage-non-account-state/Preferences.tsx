"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

// Auth-aware, and reads localStorage — but for genuine per-device preferences.
// Neither an entitlement nor account lifecycle state. Must not fire.
export function Preferences() {
  const { isSignedIn } = useAuth();
  const [theme] = useState(() => localStorage.getItem("theme") ?? "dark");
  const [sidebar] = useState(() => localStorage.getItem("sidebar-width") ?? "260");
  return <div data-theme={theme} data-sidebar={sidebar} data-signed-in={String(isSignedIn)} />;
}
