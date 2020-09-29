const express = require("express");
//const genresNoDB = require("../routes/genresNoDB");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const customers = require("../routes/customers");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const returns = require("../routes/returns");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  //middleware functions
  //express.json returns middleware which needs to be used for POST request
  app.use(express.json());
  //app.use("/api/genres", genresNoDB);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  // Express has its own middleware function to handle errors
  // Note: it is called after all the above middleware functions are executed
  app.use(error); //NOTE: Not calling the function, just passing a reference to the function
};
