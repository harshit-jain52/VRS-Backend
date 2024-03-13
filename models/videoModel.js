const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  rented: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
  },
});

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
