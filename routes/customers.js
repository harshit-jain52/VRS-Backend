const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomer,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customerController");

// POST a new customer
router.post("/", createCustomer);

// GET all customers
router.get("/", getCustomers);

// GET a customer
router.get("/:id", getCustomer);

// DELETE a customer
router.delete("/:id", deleteCustomer);

// UPDATE a customer
router.patch("/:id", updateCustomer);

module.exports = router;
