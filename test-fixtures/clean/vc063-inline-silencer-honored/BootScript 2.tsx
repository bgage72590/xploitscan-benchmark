// Intentional dangerouslySetInnerHTML sites that should be silenceable
// via the inline marker.
import React from "react";

const STORAGE_KEY = "app-theme";

export function ThemeBootScript({ nonce }: { nonce?: string }) {
  const code = `(function(){var t=localStorage.getItem('${STORAGE_KEY}');})();`;
  return (
    // VC063-OK: code is a const-bound template literal with no user input
    <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />
  );
}

export function ServerBuiltPreview({ previewHtml }: { previewHtml: string }) {
  return (
    // VC063-OK: previewHtml is server-built from controlled templates
    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
  );
}
