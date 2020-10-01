const winston = require("winston");
const express = require("express");
const config = require("config");
const app = express();

const dbName = config.get("dbName");
const username = config.get("dbUser");
const password = encodeURIComponent(config.get("dbPass"));
const user = username + ":" + password;
const dbCluster = config.get("dbCluster");
const dbParams = config.get("dbParams");

//following url not working, thus, using 1.11 version url for MongoDB Cloud (Atlas) connection
let url =
  "mongodb+srv://" +
  user +
  dbCluster +
  dbName +
  "?retryWrites=true&w=majority&authSource=admin";

url = "mongodb://" + user + dbCluster + dbName + dbParams;

require("./startup/logging")(url);
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")(url);
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || config.get("port") || 3000;
const server = app.listen(port, () => {
  winston.info(`listening on port ${port} at ${new Date()}`);
  winston.info(`Trying to connect to db: ${dbName}`);
});

module.exports = server;
