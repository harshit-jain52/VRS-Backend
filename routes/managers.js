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
router.patch("/editprofile", updateManager);
router.delete("/deletestaff", deleteStaff);
router.delete("/deletecustomer", deleteCustomer);
router.post("/addvideo", addVideo);
router.get("/allorders", getAllOrders);
router.post("/createStaff", recruitStaff);

module.exports = router;
