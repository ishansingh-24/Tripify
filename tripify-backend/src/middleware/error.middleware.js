function notFoundHandler(req, res) {
  return res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  return res.status(500).json({ message: "Internal server error." });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
