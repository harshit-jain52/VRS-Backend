const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customerModel");

const forgotPassword = async (req, res) => {
  try {
    const user = await Customer.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "10m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS_EMAIL,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
          <p>Hello ${user.name}</p>
          <p>Click on the following link to reset your password:</p>
          <a href="http://localhost:${process.env.REACT_PORT}/resetpass/${token}">Reset Password</a>
          <p>The link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "Email Sent" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await Customer.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).json({ message: "No User found" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };
