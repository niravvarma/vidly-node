const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) res.status(404).send('rental not found');

  if (rental.dateReturned) res.status(400).send('rental is already processed');

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  // return res.status(200).send(rental);
  // below is same as above, express automatically add 200 if nothing provided
  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req);
}

module.exports = router;
