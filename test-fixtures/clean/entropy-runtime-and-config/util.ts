// High-entropy-looking strings that are NOT secrets. The ENTROPY scanner
// must NOT flag any of these:
//   - runtime-assembled template-literal IDs (built at runtime; can't be a
//     hardcoded secret)
//   - a Sentry DSN (publishable client-side ingest key, ships to the browser)
//   - HTTP security-header directive values (config a scanner encourages)
//   - a custom nanoid/ID alphabet

export function newTeamId() {
  return `team_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function newInviteToken(teamId: string) {
  return `invite_${teamId}_${Math.random().toString(36).slice(2, 10)}`;
}

export const SENTRY_DSN =
  "https://d0054e75f6d9a475afb7eabbdb0396af@o4511112311799808.ingest.us.sentry.io/4511112313700352";

export const HSTS_VALUE = "max-age=63072000; includeSubDomains; preload";

// Custom alphabet for short, unambiguous IDs (no 0/O/1/I).
export const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
