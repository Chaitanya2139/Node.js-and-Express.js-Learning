// Use session-based authentication via passport. Export a middleware that
// ensures the request is authenticated (req.isAuthenticated()).
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { ensureAuthenticated };
