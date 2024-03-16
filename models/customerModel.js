const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Order",
  },
  address: {
    type: String,
  },
});

// static methods
customerSchema.statics.signUp = async function (
  username,
  password,
  name,
  email,
  phone,
  address
) {
  // check if username exists
  const exists = await this.findOne({ username });
  if (exists) {
    throw new Error("Username already in use");
  }

  // validate email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  // validate phone
  if (!validator.isMobilePhone(phone)) {
    throw new Error("Invalid phone number");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const customer = this.create({
    username,
    password: hashedPassword,
    name,
    email,
    phone,
    address,
  });
  return customer;
};

customerSchema.statics.logIn = async function (username, password) {
  if (!username || !password) throw new Error("Enter username and password");

  const customer = await this.findOne({ username });
  if (!customer) {
    throw new Error("Invalid username or password");
  }

  const match = await bcrypt.compare(password, customer.password);
  if (!match) {
    throw new Error("Invalid username or password");
  }

  return customer;
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
