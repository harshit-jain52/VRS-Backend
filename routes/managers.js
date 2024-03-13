const express = require("express");
const router = express.Router();
const {
  createManager,
  getManagers,
  getManager,
  deleteManager,
  updateManager,
} = require("../controllers/managerController");

// POST a new manager
router.post("/", createManager);

// GET all managers
router.get("/", getManagers);

// GET a manager
router.get("/:id", getManager);

// DELETE a manager
router.delete("/:id", deleteManager);

// UPDATE a manager
router.patch("/:id", updateManager);

module.exports = router;
