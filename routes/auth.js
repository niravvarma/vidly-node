const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash"); //lodash is extension of underscore js library and has various functions
const router = express.Router();
const { User } = require("../models/user");

//GET
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user is registered already
  let user = await User.findOne({ email: req.body.email }).exec();
  if (!user)
    return res.status(400).send(`Invalid: ${req.body.email} or password`);

  // simply compares and let us know if the password was encrypted using bcrypt or not
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send(`Invalid: ${req.body.email} or password`);

  res.send(user.generateAuthToken());
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
