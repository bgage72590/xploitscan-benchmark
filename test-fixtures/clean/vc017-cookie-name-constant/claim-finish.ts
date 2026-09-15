// This module never sets a cookie. It reads one, validates it, and clears it.
//
// The only thing here that resembles an assignment to one is the constant that
// NAMES it: an UPPER_SNAKE identifier ending in the word, followed by `=`.
// Because the preceding character is an underscore there is no word boundary,
// so the rule's anchored pattern correctly ignores it, while the real sinks
// (document- and response-level writes, where the preceding character is a dot)
// still match. VC017 must not fire here: there are no flags to be missing, and
// the finding would point at a string constant.
//
// NOTE FOR THE NEXT PERSON: VC017 reads raw file content, comments included.
// An earlier draft of this comment quoted the identifier suffix immediately
// followed by an equals sign, in quotes — which supplied the very word boundary
// the code lacks and made this fixture fail against a rule that was working
// correctly. Describe the pattern; do not spell it.

import { cookies } from "next/headers";

const CLAIM_COOKIE = "xs_pending_claim";
const SESSION_COOKIE = "xs_session";

export async function readPendingClaim(): Promise<{ slug: string } | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CLAIM_COOKIE)?.value;
  if (!raw) return null;

  let parsed: { slug?: unknown };
  try {
    parsed = JSON.parse(raw) as { slug?: unknown };
  } catch {
    return null;
  }

  // Clear it regardless of outcome — a stale claim cookie would otherwise
  // survive into the next signup.
  cookieStore.delete(CLAIM_COOKIE);

  return typeof parsed.slug === "string" ? { slug: parsed.slug } : null;
}

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(SESSION_COOKIE));
}
