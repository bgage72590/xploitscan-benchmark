// A real credential that happens to contain a dot. The namespaced-key filter
// must not wave it through: its second segment is a random mixed-case blob,
// not a lowercase or camelCase word.
export const PAYMENT_KEY = "live.aB3dE5fG7hJ9kLmN";

export function charge(amount) {
  return fetch("/charge", { method: "POST", headers: { "x-key": PAYMENT_KEY }, body: String(amount) });
}
