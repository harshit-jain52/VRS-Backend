const mongoose = require("mongoose");
const Staff = require("../models/staffModel");
const Order = require("../models/orderModel");
const Movie = require("../models/movieModel");
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
    .populate("movieID")
    .populate("customerID");

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
    order.returnHandledModel = "Staff";
    order.returnHandledBy = _id;
  }
  order.status = status;
  await order.save();

  res.status(200).json(order);
};

// Change Stock
const changeMovieStock = async (req, res) => {
  const { id: movieID } = req.params;
  const { stock } = req.body;
  if (!mongoose.Types.ObjectId.isValid(movieID)) {
    return res.status(400).json({ error: "No such movie found" });
  }

  const movie = await Movie.findOneAndUpdate(
    { _id: movieID },
    { stock: stock }
  );
  if (!movie) {
    return res.status(400).json({ error: "No such movie found" });
  }

  res.status(200).json(movie);
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

module.exports = {
  logInStaff,
  getStaff,
  updateStaff,
  getAllOrders,
  changeOrderStatus,
  changeMovieStock,
  getMovies,
  getMovie,
};
