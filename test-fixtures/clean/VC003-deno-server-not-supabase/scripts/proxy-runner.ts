// A local development proxy. Binds to loopback, forwards to an upstream, and
// is never deployed anywhere.
const UPSTREAM = "http://127.0.0.1:5173";

Deno.serve({ hostname: "127.0.0.1", port: 3100 }, (req) => {
  const url = new URL(req.url);
  return fetch(`${UPSTREAM}${url.pathname}${url.search}`, {
    method: req.method,
    body: req.body,
  });
});
