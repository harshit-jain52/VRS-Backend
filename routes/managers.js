const express = require("express");
const router = express.Router();
const {
  logInManager,
  getManager,
  updateManager,
  addVideo,
  getAllOrders,
  recruitStaff,
  deleteStaff,
  deleteCustomer,
} = require("../controllers/managerController");
const managerAuth = require("../middleware/managerAuth");

// Log In a manager
router.post("/login", logInManager);

router.use(managerAuth);
router.get("/auth", (req, res) => {
  res.status(200).json({ message: "Authorized" });
});
router.get("/profile", getManager);
router.put("/profile", updateManager);
router.post("/createstaff", recruitStaff);
router.delete("/deletestaff", deleteStaff);
router.delete("/deletecustomer", deleteCustomer);
router.post("/video", addVideo);
router.get("/orders", getAllOrders);

module.exports = router;
