const config = require("config");

module.exports = function (req, res, next) {
  if (!config.get("requireAuth")) return next();

  // 401 Unauthorized - user sent invalid web token
  // 403 Forbidden - user is logged in, valid web token but does not have particular role
  // req.user from auth middleware
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
