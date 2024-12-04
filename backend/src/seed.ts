import mongoose from "mongoose";
import dotenv from "dotenv";
import Products from "./models/Products"; // Ensure this path is correct

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI as string; // Read MongoDB URI from environment
console.log("MONGO_URI:", process.env.MONGO_URI);


const seedProductImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch all products
    const products = await Products.find();

    // Iterate through products and add images based on their type
    for (const product of products) {
      const type = product.type.toLowerCase();
      const images = [
        `/product_images/${type}_img/${type}1.jpg`,
        `/product_images/${type}_img/${type}2.jpg`,
        `/product_images/${type}_img/${type}3.jpg`,
      ];

      // Update the product with the images
      await Products.findByIdAndUpdate(
        product._id,
        { images },
        { new: true } // Return the updated document
      );
    }

    console.log("Products updated with images successfully");
  } catch (error) {
    console.error("Error updating products with images:", error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Execute the seeding function
seedProductImages();
