const jwt = require("jsonwebtoken");
const Staff = require("../models/staffModel");

const staffAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await Staff.findOne({ _id }).select("_id");
    if (!req.user) {
      return res.status(403).json({ error: "Authorization token is invalid" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = staffAuth;
