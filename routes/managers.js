const express = require("express");
const router = express.Router();
const {
  logInManager,
  getManager,
  updateManager,
  getMovies,
  getMovie,
  addMovie,
  updateMovie,
  disableMovie,
  recruitStaff,
  deleteStaff,
  deleteCustomer,
  getAllOrders,
  changeOrderStatus,
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
router.get("/movies", getMovies);
router.get("/movie/:id", getMovie);
router.post("/movie", addMovie);
router.put("/movie/:id", updateMovie);
router.put("/movie/:id", disableMovie);
router.get("/orders", getAllOrders);
router.put("/orders/:id", changeOrderStatus);

module.exports = router;
