// Mongo $where with a user-controlled expression string. $where takes
// a JavaScript predicate; attackers can inject arbitrary JS that runs
// server-side. VC048 must fire.

async function searchUsers(db, req) {
  const predicate = req.body.predicate;
  return db
    .collection("users")
    .find({ $where: predicate })
    .toArray();
}

module.exports = { searchUsers };
