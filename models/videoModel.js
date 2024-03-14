const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
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
    type: String,
  },
  summary_text: {
    type: String,
  },
  ImdbId: {
    type: String,
  },
  cast: {
    type: [{ name: String, name_id: String }],
  },
  rented: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
