// Client-side navigation to hardcoded destinations — relative and absolute
// string literals. These are developer-written targets, not untrusted-input
// redirects, so VC016 must NOT fire. (Regression for the backtracking-
// lookahead bug that flagged every window.location assignment, including
// safe internal links.)

export function goDashboard() {
  window.location.href = "/dashboard";
}

export function goHome() {
  window.location = "/";
}

export function goExternalDocs() {
  // A hardcoded absolute URL the developer chose — not user input.
  window.location.href = "https://docs.example.com/guide";
}

export function replaceWithSettings() {
  window.location.replace("/settings");
}

export function assignBilling() {
  window.location.assign("/billing");
}
