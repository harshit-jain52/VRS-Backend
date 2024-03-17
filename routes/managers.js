const express = require("express");
const router = express.Router();
const {
  signUpManager,
  logInManager,
  getManager,
  deleteManager,
  updateManager,
  addVideo,
  getAllOrders,
} = require("../controllers/managerController");
const managerAuth = require("../middleware/managerAuth");

// Sign Up a new manager
router.post("/signup", signUpManager);

// Log In a manager
router.post("/login", logInManager);

router.use(managerAuth);
router.get("/profile", getManager);
router.patch("/editprofile", updateManager);
router.delete("/deleteaccount", deleteManager);
router.post("/addvideo", addVideo);
router.get("/allorders", getAllOrders);

module.exports = router;
