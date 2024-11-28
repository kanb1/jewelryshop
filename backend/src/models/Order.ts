import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  deliveryMethod: {
    type: String,
    enum: ["home", "parcel-shop"], // Restrict to valid options
    required: true,
  },
  orderNumber: { type: String, required: true },
  paymentStatus: { type: String, default: "Pending" },
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Return", "Return Initiated"], // Updated order status options
    default: "In Progress", // Default status for a new order
  },
  returnId: {
    type: String, // Unique identifier for tracking the return process
    default: null,
  },
  returnStatus: {
    type: String,
    enum: ["Pending", "Received", "Refunded"], // Track the return process status
    default: null,
  },
  returnInitiated: {
    type: Boolean,
    default: false, // Flag to track if a return is initiated
  },
  returnInitiatedAt: {
    type: Date, // Track the date when the return was initiated
    default: null,
  },
  createdAt: { type: Date, default: Date.now }, // Automatically set creation date
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
