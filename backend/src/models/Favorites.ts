import mongoose from "mongoose";

// Defines the structure of the favorites document in MongoDB.
const favoriteSchema = new mongoose.Schema({
  // references the User collection, indicates which user has favorited the product
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // References the Product collection. This points to the product the user added as a favorite.
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  });
  

  const Favorite = mongoose.model("Favorite", favoriteSchema);
  export default Favorite;