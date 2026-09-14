// Vercel serverless function: api/<name>.ts with a default export.
// No session check before reading a record by a caller-supplied id.
export default async function handler(req, res) {
  const { id } = req.query;
  const row = await db.user.findUnique({ where: { id } });
  res.json(row);
}
