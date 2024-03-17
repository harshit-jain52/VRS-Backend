const mongoose = require("mongoose");
const Manager = require("../models/managerModel");
const Video = require("../models/videoModel");
const createToken = require("../helpers/createToken");

// Sign Up Manager
const signUpManager = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;

  try {
    const manager = await Manager.signUp(
      username,
      password,
      name,
      email,
      phone,
      address
    );

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

// GET a manager by ID
const getManager = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such manager found" });
  }

  const manager = await Manager.findById(id);
  if (!manager) {
    return res.status(400).json({ error: "No such manager found" });
  }

  res.status(200).json(manager);
};

// DELETE a manager
const deleteManager = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such manager found" });
  }

  const manager = await Manager.findOneAndDelete({ _id: id });
  if (!manager) {
    return res.status(400).json({ error: "No such manager found" });
  }

  res.status(200).json(manager);
};

// UPDATE a manager
const updateManager = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such manager found" });
  }

  const manager = await Manager.findOneAndUpdate({ _id: id }, { ...req.body });

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
  signUpManager,
  logInManager,
  getManager,
  deleteManager,
  updateManager,
  addVideo,
  getAllOrders,
};
