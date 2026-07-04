// A one-time, server-verified reference (Stripe checkout session_id) in a URL
// query to our own verify endpoint — the standard Stripe success pattern, not
// a credential leak. Annotated with the inline silencer; VC088 must NOT fire.
export async function verify(sessionId: string) {
  // VC088-OK: Stripe checkout session_id — one-time, server-verified ref
  const res = await fetch(`/api/billing/verify-session?session_id=${sessionId}`);
  return res.json();
}
