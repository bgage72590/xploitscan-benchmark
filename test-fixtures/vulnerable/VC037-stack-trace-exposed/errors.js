// Global error handler that sends err.stack to the client. Leaks file
// paths, framework versions, and internal logic. VC037 must fire.

function errorHandler(err, req, res, _next) {
  console.error(err);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
}

module.exports = { errorHandler };
