"use client";

// Runs inside the support-chat iframe that customers embed on their sites. It
// announces itself to the host page, then obeys the host's commands, from ANY
// sender: the listener never checks event.origin, so any page that frames the
// widget can post { type: "open-url", url } and send the widget wherever it
// likes. The `origin` key in the ready message is data being SENT, not a
// check of who sent a received message.

import { useEffect } from "react";

export function ChatWidgetBridge({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const { type, payload } = event.data ?? {};
      if (type === "open") onOpen();
      if (type === "open-url") window.location.href = payload.url;
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "widget-ready", origin: window.location.origin }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, [onOpen]);

  return null;
}
