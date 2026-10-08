import { useEffect, useState } from "react";

type Status = "loading" | "ready" | "error";

// Loads a third-party script (Stripe.js, Google Maps) once and reports when it's ready.
export function useScript(src: string): Status {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => setStatus("ready"));
    script.addEventListener("error", () => setStatus("error"));
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return status;
}
