const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: {
    type: Boolean,
  },
});

/*
  Information Expert Principle
  -----------------------------
  1. We may need token at various API for authentication so we generate JWT token
     This JWT token should be generated in User model according to Information Expert Principle as
     User should generate the token 
  
  Analogy: 
    - Think of a chef and waiter example. 
    - Chef needs to prepare the dish where as waiter will simply take the order

  2. Also, we don't have to change at various places whenever we need token
     and if any code changes required
*/
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  // here 'this' refers to the object which is passed in order to get the token
  // so we cannot use arrow function
  return token;
};

const User = new mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
