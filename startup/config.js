const config = require("config");

module.exports = function () {
  const props = [
    "jwtPrivateKey",
    "dbUser",
    "dbPass",
    "dbName",
    "dbCluster",
    "dbParams",
  ];
  for (const prop of props) {
    if (!config.get(prop)) {
      throw new Error(
        `FATAL ERROR: ${prop} is not defined, check your prodenv.sh`
      );
      // console.error("FATAL ERROR: jwtPrivateKey is not defined");
      // process.exit(1);
    }
  }
};
