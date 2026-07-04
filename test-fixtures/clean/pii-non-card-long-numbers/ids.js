// Long numeric identifiers that look card-ish in length but are NOT cards.
// None start with a real issuer prefix (4 / 51-55 / 2-series / 34,37 / 6011,65),
// so VC211 must NOT fire.
const tweetId = "1530000000000000000";   // 19-digit snowflake id, starts with 1
const orderNumber = "1002003004005006";  // 16-digit internal order id, starts with 1
const unixNanos = "1718000000000000000"; // nanosecond timestamp
const accountRef = "9876543210987654";   // 16 digits, starts with 9 — no issuer
const phone = "+1-800-555-0100";          // too short once stripped

module.exports = { tweetId, orderNumber, unixNanos, accountRef, phone };
