const Movie = require("../models/movieModel");
const mongoose = require("mongoose");

// POST a new movie
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({ ...req.body });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all movies
const getMovies = async (req, res) => {
  const movies = await Movie.find({});

  res.status(200).json(movies);
};

// GET movies by genre
const getMoviesByGenre = async (req, res) => {
  const { genre } = req.params;
  const movies = await Movie.find({ genre: { $in: [genre] } });

  res.status(200).json(movies);
};

// GET a movie
const getMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const movie = await Movie.findById(id);
  if (!movie) {
    return res.status(400).json({ error: "No such movie found" });
  }

  res.status(200).json(movie);
};

module.exports = {
  createMovie,
  getMovies,
  getMoviesByGenre,
  getMovie,
};
