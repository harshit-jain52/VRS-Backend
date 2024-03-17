const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

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
      name,
      email,
      phone,
      address,
      orders: customer.orders,
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
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      orders: customer.orders,
      _id: customer._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a customer by ID
const getCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findById(id);
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
  const { cart } = req.body;
  try {
    const order = await Order.create({ videos: cart, customer: _id });
    const customer = await Customer.findById(_id);
    customer.orders.push(order._id);
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
      path: "videos.videoId",
      model: "Video",
    },
    select: "videos status createdAt",
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
