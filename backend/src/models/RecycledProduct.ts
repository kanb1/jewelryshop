// models/RecycledProduct.ts
import { Schema, model, Document } from 'mongoose';

const recycledProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    visibility: { type: String, enum: ["public", "private"], default: "private" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }], // Optional: You can store image URLs
    isRecycled: { type: Boolean, default: true }, // A flag to mark recycled products
  },
  { timestamps: true }
);

// Define the RecycledProduct interface
interface RecycledProduct extends Document {
  name: string;
  price: number;
  size: string;
  visibility: string; // public/private visibility
  userId: string;
  images: string[];
  isRecycled: boolean;
}

const RecycledProductModel = model<RecycledProduct>("RecycledProduct", recycledProductSchema);

export default RecycledProductModel;
