// Fastify proxy with hostname allowlist — no SSRF surface. VC041 must NOT fire.

const fastify = require("fastify")();

const ALLOWED_HOSTS = new Set(["api.partner.com", "cdn.partner.com"]);

fastify.get("/proxy", async (request, reply) => {
  const parsed = new URL(request.query.url);
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return reply.code(403).send({ error: "host not allowed" });
  }
  const response = await fetch(parsed.toString());
  return response.text();
});

module.exports = fastify;
