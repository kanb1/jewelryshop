import mongoose from 'mongoose';

// Jeg har ikke en interface fordi jeg bruger ikke så meget kode hvor der er brug for at TS skal validere strukturen
// Mongoose skal stadig nok sørge for at alle dokumenterne følger skema-reglerne during runtime

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
