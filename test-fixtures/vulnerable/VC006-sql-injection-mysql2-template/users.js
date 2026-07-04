// mysql2 with a template-literal interpolated LIKE query. The Cursor/Lovable
// default output when asked for "search users by name". VC006 must fire.

import mysql from "mysql2/promise";
const conn = await mysql.createConnection({ host: "localhost" });

export async function searchUsers(searchTerm) {
  // Template literal with user input inside the SQL string.
  const [rows] = await conn.query(
    `SELECT id, email FROM users WHERE name LIKE '%${searchTerm}%'`
  );
  return rows;
}
