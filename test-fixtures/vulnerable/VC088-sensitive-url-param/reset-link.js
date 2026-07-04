// Building password-reset URLs with the token in the query string. URLs
// end up in server access logs, browser history, Referer headers of any
// outbound link on the confirmation page. VC088 must fire.

function buildResetLink(user, token) {
  return `https://app.example.com/reset?token=${token}&userId=${user.id}&email=${user.email}`;
}

module.exports = { buildResetLink };
