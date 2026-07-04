// Stored XSS via localStorage — user-controlled string stored then rendered
// without sanitization on the next page load. Works as a persistence vector
// from any origin on the same eTLD+1 in many Next.js deployments.
// VC007 must fire.

"use client";
import { useEffect, useState } from "react";

export function ProfileCard() {
  const [bio, setBio] = useState("");

  useEffect(() => {
    // Untrusted data read from localStorage (attacker-controllable).
    setBio(localStorage.getItem("user_bio") || "");
  }, []);

  // Rendering arbitrary HTML from an attacker-controllable source.
  return <section dangerouslySetInnerHTML={{ __html: bio }} />;
}
