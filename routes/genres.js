const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjId = require("../middleware/validateObjectId");
//const asyncMiddleware = require("../middleware/async");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

// as we are already using express-async-errors module we don't use the asyncMiddleware error
// handling module

// router.get(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort("name");
//     res.send(genres);
//   })
// );

//GET
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// POST
// NOTE: we are passing auth here because we want certain requests to be authenticated
// before they are called
// this is achieved via middleware function - middleware/auth.js
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

//PUT
router.put("/:id", [auth, validateObjId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // findbyid
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  ).exec();
  if (!genre) return res.status(404).send(`no such id: ${req.params.id} found`);

  res.send(genre);
});

//DELETE
// here, 2 middleware functions are called
// they are called in order - first auth and then admin
// auth valids the token and returns user object
// admin check if the user is admin or not
router.delete("/:id", [auth, admin, validateObjId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id).exec();
  if (!genre) return res.status(404).send(`no such id: ${req.params.id} found`);

  res.send(genre);
});

//Get Single Genre
router.get("/:id", validateObjId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).exec();
  if (!genre) return res.status(404).send(`no such id: ${req.params.id} found`);

  res.send(genre);
});

module.exports = router;
