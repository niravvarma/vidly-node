const winston = require("winston");
const ApiError = require("../error/ApiError");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  if (err instanceof ApiError) {
    res.status(err.code).send(err.message);
    return;
  }
  // Log the exception in the request processing pipeline
  res.status(err.status ? err.status : 500).send("Something failed");
};
