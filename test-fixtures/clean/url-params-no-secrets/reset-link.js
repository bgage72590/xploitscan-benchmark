// Reset link carries only a non-sensitive opaque token lookup id.
// The real token value is stored server-side and resolved by the id.
// VC088 must NOT fire.

function buildResetLink(lookupId) {
  return `https://app.example.com/reset?id=${encodeURIComponent(lookupId)}`;
}

module.exports = { buildResetLink };
