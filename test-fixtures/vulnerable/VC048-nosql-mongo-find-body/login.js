// Login that passes req.body straight into Mongo's find() filter. An
// attacker sending {"password": {"$ne": null}} matches the first user
// whose password is not null — NoSQL auth bypass. VC048 must fire.

async function login(db, req) {
  const user = await db
    .collection("users")
    .findOne(req.body);
  return user;
}

module.exports = { login };
