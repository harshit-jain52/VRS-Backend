const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    movieID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["rented", "returned", "bought"],
      default: "rented",
    },
    transactionID: {
      type: String,
      required: true,
    },
    returnHandledModel: {
      type: String,
      enum: ["Staff", "Manager"],
      default: null,
    },
    returnHandledBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "returnHandledModel",
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
