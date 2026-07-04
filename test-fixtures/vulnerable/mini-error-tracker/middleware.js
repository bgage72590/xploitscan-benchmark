// Custom error tracker middleware that exposes stack traces in the
// response body (VC037) AND logs unsanitized request input (VC044).

function errorTracker(err, req, res, _next) {
  console.error(`error on ${req.method} ${req.url} body=${JSON.stringify(req.body)} user=${req.user?.email}`);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    request: { url: req.url, body: req.body },
  });
}

module.exports = { errorTracker };
