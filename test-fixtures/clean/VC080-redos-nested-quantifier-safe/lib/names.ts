// Display-name validation for the signup and profile forms.
//
// A flat character class with a length cap: no group is repeated, so the
// regex engine has exactly one way to match and runs in linear time. The
// single-space rule is a separate string check rather than a nested
// quantifier. VC080 must NOT fire.

const DISPLAY_NAME_CHARS = /^[a-zA-Z ]{1,50}$/;

export function isValidDisplayName(name: string): boolean {
  if (!DISPLAY_NAME_CHARS.test(name)) return false;
  if (name.startsWith(" ") || name.endsWith(" ")) return false;
  return !name.includes("  ");
}
