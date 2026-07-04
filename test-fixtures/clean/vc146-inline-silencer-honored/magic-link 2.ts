// Magic-link / claim-token flows legitimately put a single-use, time-
// limited token in the URL. VC146 should still detect URL-token patterns,
// but respect the `// VC146-OK:` inline silencer added by the developer
// at each intentional site.

// VC146-OK: claim-token is single-use, magic-link flow gates this route
const claimUrl1 = `/free-trust-page/claim/success?token=${token}`;

const claimUrl2 = `/manage?token=${token}`;  // VC146-OK: magic-link token

// Wildcard silencer also works:
// scanner-OK: edge case documented in docs/magic-links.md
const claimUrl3 = `/api/free-trust-page?token=${token}`;
