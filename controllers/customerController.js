const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Video = require("../models/videoModel");
const createToken = require("../helpers/createToken");

// Sign Up Customer
const signUpCustomer = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;

  try {
    const customer = await Customer.signUp(
      username,
      password,
      name,
      email,
      phone,
      address
    );

    // create token
    const token = createToken(customer._id);

    res.status(200).json({
      username,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Log In Customer
const logInCustomer = async (req, res) => {
  const { username, password } = req.body;

  try {
    const customer = await Customer.logIn(username, password);

    // create token
    const token = createToken(customer._id);

    res.status(200).json({
      username,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a customer by ID
const getCustomer = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findById(_id);
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer);
};

// DELETE a customer
const deleteCustomer = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findOneAndDelete({ _id: _id });
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer);
};

// UPDATE a customer
const updateCustomer = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findOneAndUpdate(
    { _id: _id },
    { ...req.body }
  );

  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer); // customer before update
};

// POST a new order
const newOrder = async (req, res) => {
  const { _id } = req.user;
  const { videoId, quantity, duration } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ error: "No such video found" });
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ error: "No such video found" });
    }

    if (video.stock < quantity) {
      return res
        .status(400)
        .json({ error: "Not enough stock", video: videoId });
    }

    const customer = await Customer.findById(_id);
    const order = await Order.create({
      video: videoId,
      quantity: quantity,
      duration: duration,
      customer: _id,
      status: duration === 100 ? "bought" : "rented",
    });
    video.ordered.push(order._id);
    video.stock -= quantity;
    customer.orders.push(order._id);
    await video.save();
    await customer.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all orders
const getOrders = async (req, res) => {
  const { _id } = req.user;
  const customer = await Customer.findById(_id).populate({
    path: "orders",
    populate: {
      path: "video",
    },
    select: "video status createdAt",
  });

  res.status(200).json(customer.orders);
};

module.exports = {
  signUpCustomer,
  logInCustomer,
  newOrder,
  getOrders,
  getCustomer,
  deleteCustomer,
  updateCustomer,
};
