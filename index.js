const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.listen(process.env.PORT);

// register view engines
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/customer", (req, res) => {
  res.render("customer_login", { title: "Customer" });
});

app.get("/staff", (req, res) => {
  res.render("staff_login", { title: "Staff" });
});

app.get("/manager", (req, res) => {
  res.render("manager_login", { title: "Manager" });
});
