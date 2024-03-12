const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

router.get("/", () => {});

router.post("/signup", (req, res) => {
  const customer = new Customer(req.body);
  Customer.find({ username: customer.username })
    .then((result) => {
      if (result.length != 0) {
        console.log("already exists");
      } else {
        customer
          .save()
          .then((result) => {
            res.redirect("/?customer=" + encodeURIComponent(customer.username));
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

router.post("/login", (req, res) => {
  const customer = new Customer(req.body);
  Customer.find({ username: customer.username })
    .then((result) => {
      if (result.length == 0) {
        console.log("doesn't exist");
      } else if (customer.password != result[0].password) {
        console.log("incorrect password");
      } else {
        res.redirect("/?customer=" + encodeURIComponent(customer.username));
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

module.exports = router;
