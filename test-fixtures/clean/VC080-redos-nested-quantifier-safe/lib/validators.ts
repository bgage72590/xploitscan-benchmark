// Shared validators for the profile editor. Both run on raw request input
// inside the API route.
//
// Website URLs are checked with the WHATWG URL parser instead of a regex:
// parsing is linear in the input length, and it rejects the malformed hosts
// a hand-written pattern lets through. VC080 must NOT fire.

const MAX_URL_LENGTH = 2048;

export function isValidWebsite(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_URL_LENGTH) return false;
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function normalizeWebsite(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
