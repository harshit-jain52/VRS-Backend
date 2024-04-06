const Movie = require("../models/movieModel");
const mongoose = require("mongoose");
const axios = require("axios");

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
  const movies = await Movie.find(
    {},
    { ordered: 0, __v: 0, createdAt: 0, updatedAt: 0 }
  );

  res.status(200).json(movies);
};

// GET movies by genre
const getMoviesByGenre = async (req, res) => {
  const { genre } = req.params;
  const movies = await Movie.find(
    { genre: { $in: [genre] } },
    { ordered: 0, __v: 0, createdAt: 0, updatedAt: 0 }
  );

  res.status(200).json(movies);
};

// GET a movie
const getMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such movie found" });
  }

  const movie = await Movie.findById(id, {
    ordered: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!movie) {
    return res.status(404).json({ error: "No such movie found" });
  }

  res.status(200).json(movie);
};

// GET recommended movies
const getRecommendedMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:${process.env.PYTHON_PORT}/recommend/${req.params.title}`
    );
    const data = response.data;
    const movies = await Movie.find(
      { name: { $in: data.movies } },
      {
        ordered: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from Python API" });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMoviesByGenre,
  getMovie,
  getRecommendedMovies,
};
