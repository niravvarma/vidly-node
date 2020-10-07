const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const fawn = require('fawn');
const mongoose = require('mongoose');
fawn.init(mongoose);

router.get('/', auth, async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId).exec();
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId).exec();
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  /*
    - We cannot do the following because rental.save and movie.save 
      both should be either be successful or failed together as a batch;
      in order to be in sync which is obvious.
    - Thus, we have to save them as one unit operation called as transactions
    - There are 2 ways: either use "two phase commit" or npm module - fawn

    rental = await rental.save();
    movie.numberInStock--;
    movie.save();
  */

  // Using fawn for saving rental and movie as single unit - transaction
  try {
    new fawn.Task()
      .save('rentals', rental) // collection_name, object
      .update(
        'movies',
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    /*
      new collection is created called as "ojlinttaskcollections" which keeps
      track of intermediate step of what needs to be saved in mongodb. 
      After the collection is saved, it deletes the data from the collection. 
      It is something like keeping temp data.
    */

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed.');
  }

  res.send(rental);
});

router.get('/:id', auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id).exec();

  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router;
