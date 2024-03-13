const Staff = require("../models/staffModel");
const mongoose = require("mongoose");

// POST a new staff
const createStaff = async (req, res) => {
  try {
    const staff = await Staff.create({ ...req.body });
    res.status(200).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all staffs
const getStaffs = async (req, res) => {
  const staffs = await Staff.find({});

  res.status(200).json(staffs);
};

// GET a staff
const getStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findById(id);
  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff);
};

// DELETE a staff
const deleteStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findOneAndDelete({ _id: id });
  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff);
};

// UPDATE a staff
const updateStaff = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such staff found" });
  }

  const staff = await Staff.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!staff) {
    return res.status(400).json({ error: "No such staff found" });
  }

  res.status(200).json(staff); // staff before update
};

module.exports = {
  createStaff,
  getStaffs,
  getStaff,
  deleteStaff,
  updateStaff,
};
