// The hosted checkout runs in an iframe and reports back with postMessage. The
// handler is a named function with its own name for the event, and it checks
// the sender's origin before reading anything from the message.

const CHECKOUT_ORIGIN = "https://checkout.examplepay.com";

type CheckoutResult =
  | { type: "checkout_complete"; orderId: string }
  | { type: "checkout_cancelled" };

export function listenForCheckout(onResult: (result: CheckoutResult) => void) {
  function onCheckoutMessage(incoming: MessageEvent) {
    if (incoming.origin !== CHECKOUT_ORIGIN) return;
    const data = incoming.data as CheckoutResult;
    if (data?.type === "checkout_complete" || data?.type === "checkout_cancelled") onResult(data);
  }
  window.addEventListener("message", onCheckoutMessage);
  return () => window.removeEventListener("message", onCheckoutMessage);
}
