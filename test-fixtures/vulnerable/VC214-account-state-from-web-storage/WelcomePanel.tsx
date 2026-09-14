"use client";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function Onboarding() {
  const { isSignedIn } = useAuth();
  // Per-ACCOUNT state kept per-browser: a fresh login, a cleared cookie, a
  // private window or a second machine all bring this banner back and greet a
  // long-standing customer as brand new.
  const [dismissed] = useState(() => localStorage.getItem("app-onboarded") === "true");

  if (!isSignedIn || dismissed) return null;
  return <div>Welcome! First time here? Try a demo.</div>;
}
