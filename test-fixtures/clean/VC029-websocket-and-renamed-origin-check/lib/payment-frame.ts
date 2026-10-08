// Receives the result from the hosted payment page embedded in checkout. The
// listener destructures the MessageEvent and checks the sender's origin
// before trusting anything in the payload.

const PAYMENT_ORIGIN = "https://pay.examplepay.com";

type PaymentStatus = "succeeded" | "failed";

export function onPaymentResult(callback: (status: PaymentStatus) => void) {
  const listener = ({ origin, data }: MessageEvent) => {
    if (origin !== PAYMENT_ORIGIN) return;
    if (data?.type === "payment_result" && (data.status === "succeeded" || data.status === "failed")) {
      callback(data.status);
    }
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
