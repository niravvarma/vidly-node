const mongoose = require("mongoose");

function isObjectId(value) {
  try {
    const { ObjectId } = mongoose.Types;
    const asString = value.toString(); // value is either ObjectId or string or anything
    const asObjectId = new ObjectId(asString);
    const asStringifiedObjectId = asObjectId.toString();
    return asString === asStringifiedObjectId;
  } catch (error) {
    return false;
  }
}

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send(`Invalid id: ${req.params.id}`);

  next();
};
