const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const customerRoutes = require("./routes/customers");
const app = express();

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));

// Global Middleware
app.use(cors());
app.use(express.json());

// register view engines
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/custlog", (req, res) => {
  res.render("customer_login", { title: "Customer" });
});

app.get("/custsign", (req, res) => {
  res.render("customer_signup", { title: "Customer" });
});

app.get("/staff", (req, res) => {
  res.render("staff_login", { title: "Staff" });
});

app.get("/manager", (req, res) => {
  res.render("manager_login", { title: "Manager" });
});
