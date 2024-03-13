const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomer,
  getCustomerByUsername,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customerController");

// POST a new customer
router.post("/", createCustomer);

// GET all customers
router.get("/", getCustomers);

// GET a customer by ID
router.get("/:id", getCustomer); //request URL: /customers/<_id>

// GET a customer by username
router.get("/:name", getCustomerByUsername); // request URL: /customers/?user=<username>

// DELETE a customer
router.delete("/:id", deleteCustomer);

// UPDATE a customer
router.patch("/:id", updateCustomer);

module.exports = router;
