// Try-catch block is removed from each single router to a single factory middleware function
// so that we don't have to repeat it again and again for each router request
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};

//alternative of this is to install express-async-errors module which would automatically do the same
//as above - check genres.js for the GET request
