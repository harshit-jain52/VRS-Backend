const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => app.listen(process.env.PORT))
  .catch((err) => console.log(err));

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

app.post("/signup", (req, res) => {
  const user = new User(req.body);
  User.find({ username: user.username })
    .then((result) => {
      if (result.length != 0) {
        console.log("already exists");
      } else {
        user
          .save()
          .then((result) => {
            res.redirect("/?user=" + encodeURIComponent(user.username));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

app.post("/login", (req, res) => {
  const user = new User(req.body);
  User.find({ username: user.username })
    .then((result) => {
      if (result.length == 0) {
        console.log("doesn't exist");
      } else if (user.password != result[0].password) {
        console.log("incorrect password");
      } else {
        res.redirect("/?user=" + encodeURIComponent(user.username));
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
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
