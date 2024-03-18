const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const managerSchema = new Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
});

// static methods
managerSchema.statics.logIn = async function (username, password) {
  if (!username || !password) throw new Error("Enter username and password");

  const manager = await this.findOne({ username });
  if (!manager) {
    throw new Error("Invalid username or password");
  }

  const match = await bcrypt.compare(password, manager.password);
  if (!match) {
    throw new Error("Invalid username or password");
  }

  return manager;
};

const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;
