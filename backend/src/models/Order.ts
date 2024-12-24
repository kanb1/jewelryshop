// mongoose to define a schema for mongodb
import mongoose from "mongoose";

// defiens a schema for the Order collection
const orderSchema = new mongoose.Schema({
  // links each order to a specific user (foreign key ref to User)
  // order can't be created wtihout a user ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      // references the Product model to fetch product details
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
    enum: ["home", "parcel-shop"], // Restrict delivery method to "home" or parcel-shop
    required: true,
  },
  // unique order numer generated during order creation
  orderNumber: { type: String, required: true },
  // Stripe Payment Intent ID, for tracking payments
  paymentIntentId: { type: String, required: true }, 
  // paymentStatus is default set to pending
  paymentStatus: { type: String, default: "Pending" },
  // trakcs the order status trhough various stages
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Return", "Return Initiated"], // Updated order status options
    default: "In Progress", // Default status for a new order
  },
  // return logic
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
