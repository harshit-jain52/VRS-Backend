const express = require("express");
const router = express.Router();
const {
  signUpStaff,
  logInStaff,
  getStaff,
  deleteStaff,
  updateStaff,
  changeOrderStatus,
  changeVideoStock,
} = require("../controllers/staffController");
const staffAuth = require("../middleware/staffAuth");

// Sign Up a new staff
router.post("/signup", signUpStaff);

// Log In a staff
router.post("/login", logInStaff);

router.use(staffAuth);
router.get("/profile", getStaff);
router.patch("/editprofile", updateStaff);
router.delete("/deleteaccount", deleteStaff);
router.patch("/orderstatus", changeOrderStatus);
router.patch("/stock", changeVideoStock);

module.exports = router;
