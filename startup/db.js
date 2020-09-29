const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function (url) {
  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info(`Connected to MongoDB`));
  //.catch((err) => console.error("Could not connect to mongodb..", err)); -- automatically catches at index.js
};
