const Manager = require("../models/managerModel");
const mongoose = require("mongoose");

// POST a new manager
const createManager = async (req, res) => {
  try {
    const manager = await Manager.create({ ...req.body });
    res.status(200).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all managers
const getManagers = async (req, res) => {
  const managers = await Manager.find({});

  res.status(200).json(managers);
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

// GET a manager by username
const getManagerByUsername = async (req, res) => {
  const username = req.query.user;

  const manager = await Manager.findOne({ username: username });
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

module.exports = {
  createManager,
  getManagers,
  getManager,
  getManagerByUsername,
  deleteManager,
  updateManager,
};
