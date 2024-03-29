const express = require("express");
const router = express.Router();
const {
  logInStaff,
  getStaff,
  updateStaff,
  getAllOrders,
  changeOrderStatus,
  changeMovieStock,
  getMovies,
  getMovie,
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
router.put("/movie/:id", changeMovieStock);
router.get("/movies", getMovies);
router.get("/movie/:id", getMovie);

module.exports = router;
