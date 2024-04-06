const mongoose = require("mongoose");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Movie = require("../models/movieModel");
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

    res.status(201).json({
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
    res.status(401).json({ error: error.message });
  }
};

// GET a customer by ID
const getCustomer = async (req, res) => {
  const { _id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findById(_id, { _id: 0, password: 0 });
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
  const { movieID, quantity, duration, transactionID } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(400).json({ error: "No such movie found" });
    }
    const movie = await Movie.findById(movieID);
    if (!movie) {
      return res.status(400).json({ error: "No such movie found" });
    }

    const customer = await Customer.findById(_id);
    const order = await Order.create({
      movieID: movieID,
      quantity: quantity,
      duration: duration,
      price:
        quantity *
        (duration === 100 ? movie.buy_price : movie.rent_price * duration),
      customerID: _id,
      transactionID: transactionID,
      status: duration === 100 ? "bought" : "rented",
    });
    movie.ordered.push(order._id);
    movie.stock -= quantity;
    customer.orders.push(order._id);
    await movie.save();
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
      path: "movieID",
      select: "-ordered -stock -createdAt -updatedAt -__v",
    },
    select: "movieID quantity duration status price createdAt updatedAt",
  });

  res.status(200).json(customer.orders);
};

// GET cart
const getCart = async (req, res) => {
  const { _id } = req.user;
  const customer = await Customer.findById(_id);
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }
  res.status(200).json(customer.cart);
};

// UPDATE cart
const updateCart = async (req, res) => {
  const { _id } = req.user;
  const customer = await Customer.findById(_id);
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const { cart } = req.body;

  cart.forEach((item) => {
    if (!mongoose.Types.ObjectId.isValid(item.id)) {
      return res.status(400).json({ error: "No such movie found" });
    }
  });

  customer.cart = cart;
  await customer.save();
  res.status(200).json(customer.cart);
};

module.exports = {
  signUpCustomer,
  logInCustomer,
  newOrder,
  getOrders,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  getCart,
  updateCart,
};
