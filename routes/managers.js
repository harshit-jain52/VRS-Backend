const express = require("express");
const router = express.Router();
const {
  createManager,
  getManagers,
  getManager,
  getManagerByUsername,
  deleteManager,
  updateManager,
} = require("../controllers/managerController");

// POST a new manager
router.post("/", createManager);

// GET all managers
router.get("/", getManagers);

// GET a manager by ID
router.get("/:id", getManager); //request URL: /managers/<_id>

// GET a manager by username
router.get("/:name", getManagerByUsername); // request URL: /managers/?user=<username>

// DELETE a manager
router.delete("/:id", deleteManager);

// UPDATE a manager
router.patch("/:id", updateManager);

module.exports = router;
