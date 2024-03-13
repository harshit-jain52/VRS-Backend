const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const videoRoutes = require("./routes/videos");
const staffRoutes = require("./routes/staffs");
const managerRoutes = require("./routes/managers");

const app = express();

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening to port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));

// Global Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Middleware & static files
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/managers", managerRoutes);
