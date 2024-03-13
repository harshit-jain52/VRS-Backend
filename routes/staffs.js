const express = require("express");
const router = express.Router();
const {
  createStaff,
  getStaffs,
  getStaff,
  deleteStaff,
  updateStaff,
} = require("../controllers/staffController");

// POST a new staff
router.post("/", createStaff);

// GET all staffs
router.get("/", getStaffs);

// GET a staff
router.get("/:id", getStaff);

// DELETE a staff
router.delete("/:id", deleteStaff);

// UPDATE a staff
router.patch("/:id", updateStaff);

module.exports = router;
