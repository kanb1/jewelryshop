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
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
