// Error handler that logs the full error server-side but returns a
// generic user-facing message. No stack in the response. VC037 must NOT fire.

function errorHandler(err, req, res, _next) {
  console.error({ err, path: req.path, method: req.method });
  const status = err.status && err.status < 500 ? err.status : 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
}

module.exports = { errorHandler };
