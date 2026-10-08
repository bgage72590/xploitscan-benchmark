"use client";

// Auto-resizes an embedded booking widget. The handler checks the sender's
// origin — it just names its parameter `evt` and destructures nothing.

import { useEffect, useRef, useState } from "react";

const WIDGET_ORIGIN = "https://widgets.calendly-clone.com";

export function EmbedFrame({ src }: { src: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    function onResize(evt: MessageEvent) {
      if (evt.origin !== WIDGET_ORIGIN) return;
      if (typeof evt.data?.height === "number") setHeight(evt.data.height);
    }
    window.addEventListener("message", onResize);
    return () => window.removeEventListener("message", onResize);
  }, []);

  return <iframe ref={frameRef} src={src} style={{ width: "100%", height }} />;
}
