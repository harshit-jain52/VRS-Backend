const express = require("express");
const router = express.Router();
const {
  signUpCustomer,
  logInCustomer,
  getCustomers,
  getCustomer,
  getCustomerByUsername,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customerController");

// Sign Up a new customer
router.post("/signup", signUpCustomer);

// Log In a customer
router.post("/login", logInCustomer);

// GET all customers
router.get("/", getCustomers);

// GET a customer by username
router.get("/query", getCustomerByUsername); // request URL: /customers/query?user=<username>

// GET a customer by ID
router.get("/:id", getCustomer); //request URL: /customers/<_id>

// DELETE a customer
router.delete("/:id", deleteCustomer);

// UPDATE a customer
router.patch("/:id", updateCustomer);

module.exports = router;
