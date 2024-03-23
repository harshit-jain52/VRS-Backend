const mongoose = require("mongoose");
const Staff = require("../models/staffModel");
const Order = require("../models/orderModel");
const Video = require("../models/videoModel");
const createToken = require("../helpers/createToken");

// Log In Staff
const logInStaff = async (req, res) => {
  const { username, password } = req.body;

  try {
    const staff = await Staff.logIn(username, password);

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

// GET a staff by ID
const getStaff = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findById(_id, { _id: 0, password: 0 });
  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff);
};

// UPDATE a staff
const updateStaff = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findOneAndUpdate({ _id: _id }, { ...req.body });

  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff); // staff before update
};

// GET all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("videoID")
    .populate("customerID");

  res.status(200).json(orders);
};

// Change Order Status
const changeOrderStatus = async (req, res) => {
  const { id: orderID } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(orderID)) {
    return res.status(400).json({ error: "No such order found" });
  }
  const order = await Order.findById(orderID);
  if (!order) {
    return res.status(400).json({ error: "No such order found" });
  }

  if (status === "returned") {
    if (!mongoose.Types.ObjectId.isValid(order.videoID)) {
      return res.status(400).json({ error: "No such video found" });
    }
    const video = await Video.findById(order.videoID);
    video.stock += order.quantity;
    await video.save();
  }
  order.status = status;
  await order.save();

  res.status(200).json(order);
};

// Change Stock
const changeVideoStock = async (req, res) => {
  const { videoID, stock } = req.body;
  if (!mongoose.Types.ObjectId.isValid(videoID)) {
    return res.status(400).json({ error: "No such video found" });
  }

  const video = await Video.findOneAndUpdate(
    { _id: videoID },
    { stock: stock }
  );
  if (!video) {
    return res.status(400).json({ error: "No such video found" });
  }

  res.status(200).json(video);
};

module.exports = {
  logInStaff,
  getStaff,
  updateStaff,
  getAllOrders,
  changeOrderStatus,
  changeVideoStock,
};
