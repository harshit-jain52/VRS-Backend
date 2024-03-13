const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
