// Run the following command in the `backend` directory: npx ts-node src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Products';

// Load environment variables from the .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

// Sizes based on product type
const sizesByType: Record<string, string[]> = {
  rings: ['6', '7', '8', '9', '10'],
  necklaces: ['16"', '18"', '20"', '22"'],
  bracelets: ['Small', 'Medium', 'Large'],
  earrings: ['One Size'], // Earrings typically have one size
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Remove all existing products
    await Product.deleteMany({});
    console.log('All existing products deleted.');

    // Sample data with 20 products
    const products = [
      { name: 'Gold Ring', type: 'rings', productCollection: 'Love', price: 299 },
      { name: 'Diamond Ring', type: 'rings', productCollection: 'Luxury', price: 1299 },
      { name: 'Ruby Ring', type: 'rings', productCollection: 'Classic', price: 999 },
      { name: 'Sapphire Ring', type: 'rings', productCollection: 'Exclusive', price: 1099 },
      { name: 'Emerald Ring', type: 'rings', productCollection: 'Timeless', price: 899 },

      { name: 'Gold Necklace', type: 'necklaces', productCollection: 'Love', price: 499 },
      { name: 'Diamond Necklace', type: 'necklaces', productCollection: 'Luxury', price: 1999 },
      { name: 'Ruby Necklace', type: 'necklaces', productCollection: 'Classic', price: 1299 },
      { name: 'Sapphire Necklace', type: 'necklaces', productCollection: 'Exclusive', price: 1599 },
      { name: 'Emerald Necklace', type: 'necklaces', productCollection: 'Timeless', price: 1199 },

      { name: 'Gold Bracelet', type: 'bracelets', productCollection: 'Love', price: 399 },
      { name: 'Diamond Bracelet', type: 'bracelets', productCollection: 'Luxury', price: 1499 },
      { name: 'Ruby Bracelet', type: 'bracelets', productCollection: 'Classic', price: 899 },
      { name: 'Sapphire Bracelet', type: 'bracelets', productCollection: 'Exclusive', price: 1099 },
      { name: 'Emerald Bracelet', type: 'bracelets', productCollection: 'Timeless', price: 999 },

      { name: 'Gold Earrings', type: 'earrings', productCollection: 'Love', price: 299 },
      { name: 'Diamond Earrings', type: 'earrings', productCollection: 'Luxury', price: 999 },
      { name: 'Ruby Earrings', type: 'earrings', productCollection: 'Classic', price: 599 },
      { name: 'Sapphire Earrings', type: 'earrings', productCollection: 'Exclusive', price: 799 },
      { name: 'Emerald Earrings', type: 'earrings', productCollection: 'Timeless', price: 699 },
    ];

    // Insert products with sizes
    for (const product of products) {
      const sizes = sizesByType[product.type] || []; // Assign sizes based on type
      await Product.create({ ...product, sizes });
    }

    console.log('Database seeded successfully with 20 products.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
