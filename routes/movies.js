const express = require("express");
const router = express.Router();
const {
  createMovie,
  getMovies,
  getMoviesByGenre,
  getMovie,
} = require("../controllers/movieController");

// POST a new movie
router.post("/", createMovie);

// GET all movies
router.get("/", getMovies);

// GET movies by genre
router.get("/genre/:genre", getMoviesByGenre);

// GET a movie
router.get("/:id", getMovie);

module.exports = router;
