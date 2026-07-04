// User lookup that builds a SQL query with a template literal containing
// user-controlled input. VC006 must fire.

export async function getUserByEmail(db, email) {
  // Template literal with ${email} — classic injection.
  const result = await db.query(
    `SELECT * FROM users WHERE email = '${email}'`
  );
  return result.rows[0];
}

export async function searchUsers(db, searchTerm) {
  // String concatenation with user input — also injection.
  const result = await db.execute(
    "SELECT * FROM users WHERE name LIKE '%" + searchTerm + "%'"
  );
  return result.rows;
}
