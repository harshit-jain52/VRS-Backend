const express = require("express");
const router = express.Router();
const {
  signUpCustomer,
  logInCustomer,
  newOrder,
  getOrders,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  getCart,
  updateCart,
} = require("../controllers/customerController");
const customerAuth = require("../middleware/customerAuth");

// Sign Up a new customer
router.post("/signup", signUpCustomer);

// Log In a customer
router.post("/login", logInCustomer);

router.use(customerAuth);
router.get("/auth", (req, res) => {
  res.status(200).json({ message: "Authorized" });
});
router.get("/profile", getCustomer);
router.patch("/editprofile", updateCustomer);
router.post("/neworder", newOrder);
router.get("/myorders", getOrders);
router.delete("/deleteaccount", deleteCustomer);
router.get("/cart", getCart);
router.patch("/updatecart", updateCart);

module.exports = router;
