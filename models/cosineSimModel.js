const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cosinesimSchema = new Schema({
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  Index: {
    type: Number,
    required: true,
  },
  cosineSim: {
    type: [Number],
    required: true,
  },
});

const Cosinesim = mongoose.model("Cosinesim", cosinesimSchema);
module.exports = Cosinesim;
