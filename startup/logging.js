const winston = require("winston");
//require("winston-mongodb");
require("express-async-errors"); //alternative of using a user-defined error middleware function
//check genres.js & async.js for details

module.exports = function (url) {
  // PROCESS has event emitter which can capture exception which cannot be caught using express
  // as express only catches the exceptions which are in request pipeline so we can subscribe to errors
  // using process object
  // following catches only uncaughtException - does not work with rejected promise
  // process.on("uncaughtException", (ex) => {
  //   console.log("we got an uncaught exception");
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });
  //throw new Error('This is some uncaught exception');

  //We can use winston as well in order to catch uncaught exceptions
  // rather than subscribing to uncaughtException process object as shown above
  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
    })
  );

  // there is no way to handle rejections using winston so we simply throw exception rather than
  // catching it separately with last 3 lines for consistency
  process.on("unhandledRejection", (ex) => {
    throw ex;
    // console.log("we got an unhandled rejection");
    // winston.error(ex.message, ex);
    // process.exit(1); -- Exit the process if an error
  });
  // Rejection sample
  // const p = Promise.reject(new Error('Something failed miserably!'));
  // p.then(() => console.log('Done'));

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  //winston.add(new winston.transports.MongoDB({ db: url, level: "error" }));
};
