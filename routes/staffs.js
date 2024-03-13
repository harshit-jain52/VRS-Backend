const express = require("express");
const router = express.Router();
const {
  createStaff,
  getStaffs,
  getStaff,
  getStaffByUsername,
  deleteStaff,
  updateStaff,
} = require("../controllers/staffController");

// POST a new staff
router.post("/", createStaff);

// GET all staffs
router.get("/", getStaffs);

// GET a staff by ID
router.get("/:id", getStaff); //request URL: /staffs/<_id>

// GET a staff by username
router.get("/:name", getStaffByUsername); // request URL: /staffs/?user=<username>

// DELETE a staff
router.delete("/:id", deleteStaff);

// UPDATE a staff
router.patch("/:id", updateStaff);

module.exports = router;
