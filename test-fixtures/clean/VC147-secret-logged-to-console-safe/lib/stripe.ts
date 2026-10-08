import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
// Debugging the "Invalid API Key provided" error on Vercel: log which mode
// the key is for and its last 4 characters, never the key itself.
console.log("Stripe mode:", stripeSecretKey.startsWith("sk_live_") ? "live" : "test");
console.log("Stripe key ends with:", stripeSecretKey.slice(-4));
console.log("OpenAI key present:", !!process.env.OPENAI_API_KEY);

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});
