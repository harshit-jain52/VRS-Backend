const express = require("express");
const router = express.Router();

const {
  checkout,
  paymentSuccess,
} = require("../controllers/paymentController");
const customerAuth = require("../middleware/customerAuth");

router.post("/checkout", customerAuth, checkout);
router.put("/success", paymentSuccess);

module.exports = router;
