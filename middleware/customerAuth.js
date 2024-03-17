const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");

const customerAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await Customer.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = customerAuth;
