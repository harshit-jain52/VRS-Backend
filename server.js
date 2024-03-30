const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

const customerRoutes = require("./routes/customers");
const movieRoutes = require("./routes/movies");
const staffRoutes = require("./routes/staffs");
const managerRoutes = require("./routes/managers");
const paymentRoutes = require("./routes/payment");

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
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/recommend/:title", async (req, res) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/recommend/${req.params.title}`,
    );
    // console.log(response);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from Python API" });
  }
});
