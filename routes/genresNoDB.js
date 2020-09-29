const express = require("express");
const router = express.Router();
const Joi = require("joi"); //in order to ease the input validation

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horor" },
  { id: 3, name: "Comedy" },
];

//GET
router.get("/", (req, res) => {
  res.send(genres);
});

//POST
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);

  res.send(genre);
});

//PUT
router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`no such id: ${req.params.id} found`);

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

//DELETE
router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`no such id: ${req.params.id} found`);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
