const express = require("express");
const router = express.Router();
const {
  logInStaff,
  getStaff,
  deleteStaff,
  updateStaff,
  changeOrderStatus,
  changeVideoStock,
} = require("../controllers/staffController");
const staffAuth = require("../middleware/staffAuth");

// Log In a staff
router.post("/login", logInStaff);

router.use(staffAuth);
router.get("/auth", (req, res) => {
  res.status(200).json({ message: "Authorized" });
});
router.get("/profile", getStaff);
router.patch("/editprofile", updateStaff);
router.delete("/deleteaccount", deleteStaff);
router.patch("/orderstatus", changeOrderStatus);
router.patch("/stock", changeVideoStock);

module.exports = router;
