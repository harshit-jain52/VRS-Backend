const Customer = require("../models/customerModel");
const mongoose = require("mongoose");

// POST a new customer
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({ ...req.body });
    res.status(200).json(customer);
  } catch (error) {
    if (error.name === "ValidationError") {
      let fields = {};

      Object.keys(error.errors).forEach((key) => {
        fields[key] = error.errors[key].message;
      });

      return res.status(400).send(fields);
    }
    res.status(500).json({ error: error.message });
  }
};

// GET all customers
const getCustomers = async (req, res) => {
  const customers = await Customer.find({});

  res.status(200).json(customers);
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

// GET a customer by username
const getCustomerByUsername = async (req, res) => {
  const username = req.query.user;

  const customer = await Customer.findOne({ username: username });
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer);
};

// DELETE a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findOneAndDelete({ _id: id });
  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer);
};

// UPDATE a customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such customer found" });
  }

  const customer = await Customer.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  );

  if (!customer) {
    return res.status(400).json({ error: "No such customer found" });
  }

  res.status(200).json(customer); // customer before update
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  getCustomerByUsername,
  deleteCustomer,
  updateCustomer,
};
