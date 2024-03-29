const express = require("express");
const router = express.Router();
const {
  logInStaff,
  getStaff,
  updateStaff,
  getAllOrders,
  changeOrderStatus,
  changeVideoStock,
  getVideos,
  getVideo,
} = require("../controllers/staffController");
const staffAuth = require("../middleware/staffAuth");

// Log In a staff
router.post("/login", logInStaff);

router.use(staffAuth);
router.get("/auth", (req, res) => {
  res.status(200).json({ message: "Authorized" });
});
router.get("/profile", getStaff);
router.put("/profile", updateStaff);
router.get("/orders", getAllOrders);
router.put("/orders/:id", changeOrderStatus);
router.put("/video/:id", changeVideoStock);
router.get("/videos", getVideos);
router.get("/video/:id", getVideo);

module.exports = router;
