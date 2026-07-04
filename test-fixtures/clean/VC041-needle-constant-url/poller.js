// needle fetching a constant, server-configured URL inside an Express
// handler — no user input reaches the request, must not fire VC041.
const needle = require("needle");

const STATUS_ENDPOINT = "https://status.internal.example.com/healthz";

module.exports.statusProxy = function (req, res) {
  needle.get(STATUS_ENDPOINT, (error, response, body) => {
    if (error) return res.status(502).json({ ok: false });
    res.json({ ok: response.statusCode === 200, body });
  });
};
