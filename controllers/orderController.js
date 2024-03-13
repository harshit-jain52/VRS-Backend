const Order = require("../models/orderModel");
const mongoose = require("mongoose");

// POST a new order
const createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all orders
const getOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(200).json(orders);
};

// GET a order
const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such order found" });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({ error: "No such order found" });
  }

  res.status(200).json(order);
};

// DELETE a order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such order found" });
  }

  const order = await Order.findOneAndDelete({ _id: id });
  if (!order) {
    return res.status(400).json({ error: "No such order found" });
  }

  res.status(200).json(order);
};

// UPDATE a order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such order found" });
  }

  const order = await Order.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!order) {
    return res.status(400).json({ error: "No such order found" });
  }

  res.status(200).json(order); // order before update
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
};
