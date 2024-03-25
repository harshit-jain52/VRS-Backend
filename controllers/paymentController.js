const crypto = require("crypto");
const Transaction = require("../models/transactionModel");
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

const checkout = async (req, res) => {
  const { _id } = req.user;
  const { amount } = req.body;

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const payment = await razorpay.orders.create(options);

  const transaction = await Transaction.create({
    customerID: _id,
    amount: amount,
    transactionID: payment.id,
  });

  res.status(200).json({ transaction, payment });
};

const paymentSuccess = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const transaction = await Transaction.findOneAndUpdate(
    { transactionID: razorpay_order_id },
    {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }
  );

  if (!transaction) {
    return res.status(400).json({ message: "Invalid transaction" });
  }

  res.status(200).json({ message: "Payment successful", transaction });
};

module.exports = { checkout, paymentSuccess };
