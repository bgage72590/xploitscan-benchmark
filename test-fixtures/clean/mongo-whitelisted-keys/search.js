// Mongo query built from a whitelisted subset of fields, each value
// coerced to a string. No $where and no operator injection surface.
// VC048 must NOT fire.

const ALLOWED_FIELDS = ["email", "username", "status"];

async function searchUsers(db, req) {
  const filter = {};
  for (const field of ALLOWED_FIELDS) {
    if (typeof req.body[field] === "string") {
      filter[field] = String(req.body[field]);
    }
  }
  return db.collection("users").find(filter).toArray();
}

module.exports = { searchUsers };
