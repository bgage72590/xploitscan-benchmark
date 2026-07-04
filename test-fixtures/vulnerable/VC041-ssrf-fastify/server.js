// Fastify handler that fetches a URL read from the query string. Same SSRF
// class as the Express variant — proves the AST taint tracker recognizes
// request-like objects across frameworks. VC041 must fire.

const fastify = require("fastify")();

fastify.get("/proxy", async (request, reply) => {
  const target = request.query.url;
  const response = await fetch(target);
  return response.text();
});

module.exports = fastify;
