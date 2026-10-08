"use client";

// Embeds the third-party booking widget and listens for its resize and
// "booking complete" messages. Messages are SENT with the right targetOrigin,
// but the listener never checks who sent a message it receives: any page that
// frames this one, or that this page opens, can post `{ type: "navigate" }`
// and send the visitor to a URL of its choosing.

import { useEffect, useRef, useState } from "react";

export function BookingWidget({ src }: { src: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);

  useEffect(() => {
    const widgetUrl = new URL(src);
    const frame = frameRef.current;

    const sendTheme = () =>
      frame?.contentWindow?.postMessage({ type: "theme", value: "dark" }, widgetUrl.origin);
    frame?.addEventListener("load", sendTheme);

    const onMessage = (event: MessageEvent) => {
      const { type, ...payload } = event.data ?? {};
      if (type === "resize") setHeight(Number(payload.height));
      if (type === "navigate") window.location.assign(payload.url);
    };
    window.addEventListener("message", onMessage);

    return () => {
      frame?.removeEventListener("load", sendTheme);
      window.removeEventListener("message", onMessage);
    };
  }, [src]);

  return <iframe ref={frameRef} src={src} title="Book a session" style={{ width: "100%", height }} />;
}
