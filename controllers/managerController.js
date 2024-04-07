const mongoose = require("mongoose");
const Manager = require("../models/managerModel");
const Movie = require("../models/movieModel");
const Staff = require("../models/staffModel");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const createToken = require("../helpers/createToken");

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
    res.status(401).json({ error: error.message });
  }
};

// Sign Up Staff
const recruitStaff = async (req, res) => {
  const { username, password, name, email, phone } = req.body;

  try {
    const staff = await Staff.signUp(username, password, name, email, phone);

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

  const manager = await Manager.findById(_id, { _id: 0, password: 0 });
  if (!manager) {
    return res.status(400).json({ error: "No such manager found" });
  }

  res.status(200).json(manager);
};

// GET all staffs
const getStaffs = async (req, res) => {
  const staffs = await Staff.find({}, { password: 0 });

  res.status(200).json(staffs);
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

// GET all customers
const getCustomers = async (req, res) => {
  const customers = await Customer.find({}, { password: 0 }).populate({
    path: "orders",
    populate: {
      path: "movieID",
    },
  });

  res.status(200).json(customers);
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

// GET all movies
const getMovies = async (req, res) => {
  const movies = await Movie.find({}).populate("ordered");

  res.status(200).json(movies);
};

// GET a movie
const getMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const movie = await Movie.findById(id).populate("ordered");
  if (!movie) {
    return res.status(400).json({ error: "No such movie found" });
  }

  res.status(200).json(movie);
};

// Add a movie
const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create({ ...req.body });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DISABLE a movie
const disableMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const movie = await Movie.findById(id);
  if (!movie) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const customers = await Customer.find({ "cart.id": id });
  for (const customer of customers) {
    const cart = customer.cart.filter((item) => item.id.toString() !== id);
    customer.cart = cart;
    await customer.save();
  }

  movie.disabled = true;
  await movie.save();
  res.status(200).json(movie);
};

// UPDATE a movie
const updateMovie = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const movie = await Movie.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!movie) {
    return res.status(400).json({ error: "No such movie found" });
  }

  res.status(200).json(movie); // movie before update
};

// GET all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("movieID")
    .populate("customerID")
    .populate("returnHandledBy");

  res.status(200).json(orders);
};

// Change Order Status
const changeOrderStatus = async (req, res) => {
  const { _id } = req.user;
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
    if (!mongoose.Types.ObjectId.isValid(order.movieID)) {
      return res.status(400).json({ error: "No such movie found" });
    }
    const movie = await Movie.findById(order.movieID);
    movie.stock += order.quantity;
    await movie.save();
    order.returnHandledModel = "Manager";
    order.returnHandledBy = _id;
  }
  order.status = status;
  await order.save();

  res.status(200).json(order);
};

module.exports = {
  logInManager,
  getManager,
  updateManager,
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  disableMovie,
  getStaffs,
  recruitStaff,
  deleteStaff,
  getCustomers,
  deleteCustomer,
  getAllOrders,
  changeOrderStatus,
};
