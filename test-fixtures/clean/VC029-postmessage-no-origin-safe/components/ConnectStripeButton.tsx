"use client";

// Same popup OAuth flow, but the listener only trusts messages from our own
// origin and from the popup it opened, and checks the payload shape before
// acting on it. The redirect target is never taken from the message.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type OAuthMessage = {
  type: "oauth:success" | "oauth:error";
  accountId?: string;
};

function isOAuthMessage(value: unknown): value is OAuthMessage {
  if (typeof value !== "object" || value === null) return false;
  const msg = value as Record<string, unknown>;
  return (
    (msg.type === "oauth:success" || msg.type === "oauth:error") &&
    (msg.accountId === undefined || typeof msg.accountId === "string")
  );
}

export function ConnectStripeButton() {
  const router = useRouter();
  const popupRef = useRef<Window | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== popupRef.current) return;
      if (!isOAuthMessage(event.data)) return;

      if (event.data.type === "oauth:success") {
        setStatus("done");
        router.push("/dashboard/billing");
      } else {
        setStatus("error");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  const connect = () => {
    setStatus("pending");
    popupRef.current = window.open("/api/stripe/connect", "stripe-oauth", "width=520,height=720");
  };

  return (
    <button onClick={connect} disabled={status === "pending"}>
      {status === "done" ? "Stripe connected" : "Connect Stripe"}
    </button>
  );
}
