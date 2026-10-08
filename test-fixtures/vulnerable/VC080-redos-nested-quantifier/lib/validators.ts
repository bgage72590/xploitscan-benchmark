// Website validation for the profile editor. The regex runs on raw request
// input inside the API route, on the single Node event loop.
//
// URL_PATTERN is the widely copied "match a URL" regex. The trailing path
// group ([\/\w .-]*)* is a quantifier nested inside a quantifier, so a
// ~40-character input like "http://a.bc/" followed by spaces and a "!" makes
// V8 backtrack exponentially and freezes the server. VC080 must fire.

export const URL_PATTERN = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

export function isValidWebsite(input: string): boolean {
  return URL_PATTERN.test(input.trim());
}

export function normalizeWebsite(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
