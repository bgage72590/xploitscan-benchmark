"use client";

import { HighlightInit } from "@highlight-run/next/client";

// The project ID is a public client-side identifier (it ships in the
// browser bundle by design) — it is not the secret here.
export function Highlight() {
  return (
    <HighlightInit
      projectId="1jdkoe52"
      serviceName="web-frontend"
      tracingOrigins
      networkRecording={{ enabled: true, recordHeadersAndBody: true }}
    />
  );
}
