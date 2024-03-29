const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  poster_url: {
    type: String,
  },
  year: {
    type: String,
  },
  runtime: {
    type: String,
  },
  genre: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  summary_text: {
    type: String,
  },
  ImdbId: {
    type: String,
  },
  cast: {
    type: [String],
  },
  director: {
    type: String,
  },
  ordered: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
  },
  stock: {
    type: Number,
    required: true,
  },
  buy_price: {
    type: Number,
    required: true,
  },
  rent_price: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
