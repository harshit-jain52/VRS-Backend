const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cosineSimSchema = new Schema({
  videoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
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

const CosineSim = mongoose.model("CosineSim", cosineSimSchema);
module.exports = CosineSim;
