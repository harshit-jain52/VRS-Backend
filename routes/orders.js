const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/orderController");

// POST a new order
router.post("/", createOrder);

// GET all orders
router.get("/", getOrders);

// GET a order
router.get("/:id", getOrder);

// DELETE a order
router.delete("/:id", deleteOrder);

// UPDATE a order
router.patch("/:id", updateOrder);

module.exports = router;
