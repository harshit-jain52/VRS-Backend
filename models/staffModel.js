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
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
