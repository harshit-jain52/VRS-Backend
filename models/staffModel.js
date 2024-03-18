const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

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
staffSchema.statics.signUp = async function (
  username,
  password,
  name,
  email,
  phone
) {
  // check if username exists
  let exists = await this.findOne({ username });
  if (exists) {
    throw new Error("Username already in use");
  }

  // validate email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email already in use");
  }

  // validate phone
  if (!validator.isMobilePhone(phone)) {
    throw new Error("Invalid phone number");
  }
  exists = await this.findOne({ phone });
  if (exists) {
    throw new Error("Phone number already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const staff = this.create({
    username,
    password: hashedPassword,
    name,
    email,
    phone,
  });
  return staff;
};

staffSchema.statics.logIn = async function (username, password) {
  if (!username || !password) throw new Error("Enter username and password");

  const staff = await this.findOne({ username });
  if (!staff) {
    throw new Error("Invalid username or password");
  }

  const match = await bcrypt.compare(password, staff.password);
  if (!match) {
    throw new Error("Invalid username or password");
  }

  return staff;
};

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
