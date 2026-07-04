// SQL queries using parameterized placeholders. VC006 must NOT fire.

export async function getUserByEmail(db, email) {
  // ? placeholder — safe.
  const result = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );
  return result.rows[0];
}

export async function searchUsers(db, searchTerm) {
  // $1 placeholder (Postgres style) — safe.
  const result = await db.query(
    "SELECT * FROM users WHERE name ILIKE $1",
    [`%${searchTerm}%`],
  );
  return result.rows;
}
