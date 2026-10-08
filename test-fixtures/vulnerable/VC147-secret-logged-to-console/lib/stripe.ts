import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
// Debugging the "Invalid API Key provided" error on Vercel
console.log("Stripe key being used:", stripeSecretKey);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});
