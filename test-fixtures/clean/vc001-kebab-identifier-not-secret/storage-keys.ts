// These are localStorage / cookie / cache identifier strings — NOT
// credentials. Pattern: SCREAMING_CASE _KEY assigned a lowercase
// slot-identifier value (kebab-case OR snake_case). VC001 used to flag
// these as hardcoded secrets.

// kebab-case identifiers
export const WEBHOOKS_KEY = "xploitscan-webhooks";
export const STORAGE_KEY = "xploitscan-scan-history";
export const COOKIE_KEY = "xploitscan-cookie-consent";
export const CACHE_KEY = "user-preferences-v2";
export const SESSION_KEY = "claim-token-redirect";
export const FEATURE_KEY = "experimental-trust-page-layout";

// snake_case identifiers (the mc_saves_index case from a real scan)
export const INDEX_KEY = "mc_saves_index";
export const DISMISS_KEY = "consent_banner_dismissed";
export const DRAFT_KEY = "editor_draft_autosave_v3";
