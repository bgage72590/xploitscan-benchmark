// Reflected XSS via URL query param rendered into the DOM without
// sanitization. AI coding tools write this shape constantly when asked to
// "echo the search term back to the user". VC007 must fire.

"use client";
import { useSearchParams } from "next/navigation";

export default function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  return (
    <div>
      <h1>Results for:</h1>
      {/* User-controlled string rendered as HTML — ?q=<script>alert(1)</script> executes. */}
      <div dangerouslySetInnerHTML={{ __html: `You searched for: ${q}` }} />
    </div>
  );
}
