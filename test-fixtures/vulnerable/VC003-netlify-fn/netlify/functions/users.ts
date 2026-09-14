// Netlify function. Returns every user row to any caller.
export const handler = async (event) => {
  const rows = await db.query("SELECT id, email FROM users");
  return { statusCode: 200, body: JSON.stringify(rows) };
};
