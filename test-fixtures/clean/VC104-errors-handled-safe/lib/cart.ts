export type CartItem = { productId: string; name: string; price: number; quantity: number };

const CART_KEY = "cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch (e) {
    console.warn("Discarding unreadable saved cart", e);
    localStorage.removeItem(CART_KEY);
  }
  return [];
}

export function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    // Storage full or blocked (Safari private mode): the cart still works in memory.
    console.warn("Could not persist cart", e);
  }
}

export function trackAddToCart(item: CartItem) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "add_to_cart", productId: item.productId }),
  }).catch((err) => console.debug("analytics event dropped", err));
}
