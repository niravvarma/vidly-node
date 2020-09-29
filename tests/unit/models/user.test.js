const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

// NOTE: we are only testing generateAuthToken function because
// others required req, res, db etc. and for that we write INTEGRATION TESTs

// for algorithm based functions or very simply calculations, we write unit test and thus,
// we wrote UNIT test for generateAuthToken
