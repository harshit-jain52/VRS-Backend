const mongoose = require("mongoose");
const Manager = require("../models/managerModel");
const Video = require("../models/videoModel");
const Staff = require("../models/staffModel");
const createToken = require("../helpers/createToken");
const Customer = require("../models/customerModel");

// Log In Manager
const logInManager = async (req, res) => {
  const { username, password } = req.body;

  try {
    const manager = await Manager.logIn(username, password);

    // create token
    const token = createToken(manager._id);

    res.status(200).json({
      username,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Sign Up Staff
const recruitStaff = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;

  try {
    const staff = await Staff.signUp(
      username,
      password,
      name,
      email,
      phone,
      address
    );

    // create token
    const token = createToken(staff._id);

    res.status(200).json({
      username,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a manager by ID
const getManager = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such manager found" });
  }

  const manager = await Manager.findById(_id);
  if (!manager) {
    return res.status(400).json({ error: "No such manager found" });
  }

  res.status(200).json(manager);
};

// DELETE a staff
const deleteStaff = async (req, res) => {
  const { staffID } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findOneAndDelete({ _id: staffID });
  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff);
};

// DELETE a customer
const deleteCustomer = async (req, res) => {
  const { customerID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findOneAndDelete({ _id: customerID });
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer);
};

// UPDATE a manager
const updateManager = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such manager found" });
  }

  const manager = await Manager.findOneAndUpdate({ _id: _id }, { ...req.body });

  if (!manager) {
    return res.status(400).json({ error: "No such manager found" });
  }

  res.status(200).json(manager); // manager before update
};

// Add a video
const addVideo = async (req, res) => {
  try {
    const video = await Video.create({ ...req.body });
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(200).json(orders);
};

module.exports = {
  logInManager,
  getManager,
  updateManager,
  addVideo,
  getAllOrders,
  recruitStaff,
  deleteStaff,
  deleteCustomer,
};
