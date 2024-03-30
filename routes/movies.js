const express = require("express");
const router = express.Router();
const {
  createMovie,
  getMovies,
  getMoviesByGenre,
  getMovie,
  getRecommendedMovies,
} = require("../controllers/movieController");

// POST a new movie
router.post("/", createMovie);

// GET all movies
router.get("/", getMovies);

// GET movies by genre
router.get("/genre/:genre", getMoviesByGenre);

// GET a movie
router.get("/:id", getMovie);

// GET recommended movies
router.get("/recommend/:title", getRecommendedMovies);

module.exports = router;
