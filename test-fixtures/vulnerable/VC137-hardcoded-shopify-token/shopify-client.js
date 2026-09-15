// Shopify Admin API client for an order-sync worker. The store access token is
// committed in source instead of being read from the environment.
// This should trigger VC137 (Hardcoded Shopify Access Token).

const SHOPIFY_STORE = "acme-demo-store.myshopify.com";
const SHOPIFY_API_VERSION = "2024-01";
const SHOPIFY_ADMIN_TOKEN = "shpat_0000000000000000000000000000dead";

async function shopifyRequest(path, init = {}) {
  const res = await fetch(
    `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/${path}`,
    {
      ...init,
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Shopify ${path} failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchRecentOrders(limit = 50) {
  const { orders } = await shopifyRequest(`orders.json?status=any&limit=${limit}`);
  return orders.map((o) => ({
    id: o.id,
    email: o.email,
    total: o.total_price,
  }));
}
