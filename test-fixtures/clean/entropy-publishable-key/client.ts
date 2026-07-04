// Stripe / Clerk publishable keys are designed to ship to the browser —
// they appear in bundled client code. High-entropy but not secrets.
// ENTROPY and VC132-family rules must not flag these.

import { loadStripe } from "@stripe/stripe-js";
import { Clerk } from "@clerk/clerk-js";

// Stripe publishable (client-facing) key — pk_live_ / pk_test_ format.
const stripePromise = loadStripe(
  "pk_live_51Hq8vBxKjXnNfRtYpMzL3wGdCaV7EoBfUsTqRnWhYmXcKjDlPbQaAfEdHnZjGkMxVrSoLpCtYnBrTvMqPyZxKdJeIoPw00aBcDefGh"
);

// Clerk publishable key — shipped in every Next.js build.
const clerkPub = "pk_test_Y2xlcmstdGVzdC1rZXktZm9yLWRlbW8tcHVycG9zZXMtb25seS1ub3Qtc2VjcmV0";

// Build-time public env var — explicitly public by Next.js convention.
const supabaseUrl = "NEXT_PUBLIC_SUPABASE_URL_placeholder_value_for_env";

export { stripePromise, clerkPub, supabaseUrl };
