const auth = require("../middleware/auth"); //authorization
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash"); //lodash is extension of underscore js library and has various functions
const router = express.Router();
const { User, validate } = require("../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");

//GET USER - if user is logged in or not
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); //comes from middleware/auth
  res.send(user);
});

// for logout
// simply delete the token at the client in the browser where token was saved
// do not store token in database, others can use it to get sensitive data
// if you want to store token in database, then encrypt it like passwords

//CREATE USER
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user is not registered already
  let user = await User.findOne({ email: req.body.email }).exec();
  if (user)
    return res
      .status(400)
      .send(`User: ${req.body.email} is already registered`);

  //if not, then register
  // user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  // });

  // for password restrictions, check joi-password-complexity

  // we have replaced normal object setting with lodash pick method for ease
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["id", "name", "email"]));
});

module.exports = router;
