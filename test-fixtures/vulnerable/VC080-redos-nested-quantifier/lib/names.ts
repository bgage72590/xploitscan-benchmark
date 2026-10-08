// Display-name validation for the signup and profile forms.
//
// "Letters, optionally separated by single spaces" written as
// ([a-zA-Z]+\s?)* — the textbook ReDoS shape from the OWASP
// catastrophic-backtracking page: the space is optional, so a long run of
// letters ending in a symbol ("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!") is split every
// possible way before the match fails. VC080 should fire.

const DISPLAY_NAME_PATTERN = /^([a-zA-Z]+\s?)*$/;

export function isValidDisplayName(name: string): boolean {
  if (name.length === 0) return false;
  return DISPLAY_NAME_PATTERN.test(name);
}
