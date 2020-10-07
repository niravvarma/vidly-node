const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

// GET
router.get('/', auth, async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// POST
router.post('/', auth, async (req, res) => {
  //validate if Genre exists
  const genreObj = await Genre.findById(req.body.genreId).exec();
  if (!genreObj)
    return res.status(404).send(`no such genre id: ${req.body.genreId} found`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /*
    we don't need to use let movie here, because Mongoose generates the unique id 
    with MongoDB driver thus, we replace let with const. 
    Check objectid.txt document for more details.
  */
  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genreObj._id,
      name: genreObj.name,
    },
  });

  /*
    movie = await movie.save(); 
    above line is commented because id is already generated 
    so not required to set the object after save
  */
  await movie.save();

  res.send(movie);
});

// PUT
router.put('/:id', auth, async (req, res) => {
  //validate if Genre exists
  const genreObj = await Genre.findById(req.body.genreId).exec();
  if (!genreObj)
    return res.status(404).send(`no such genre id: ${req.body.genreId} found`);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // findbyid
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: {
        _id: genreObj._id,
        name: genreObj.name,
      },
    },
    { new: true }
  ).exec();
  if (!movie) return res.status(404).send(`no such id: ${req.params.id} found`);

  res.send(movie);
});

// DELETE
router.delete('/:id', [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id).exec();
  if (!movie) return res.status(404).send(`no such id: ${req.params.id} found`);

  res.send(movie);
});

// GET MOVIE by id
router.get('/:id', validateObjId, async (req, res) => {
  const movie = await Movie.findById(req.params.id).exec();
  if (!movie)
    return res
      .status(404)
      .send(`The movie with the given ID: ${req.params.id} was not found.`);

  res.send(movie);
});

module.exports = router;
