// Run the following command in the `backend` directory: npx ts-node src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Products';
import Category from './models/Category';

// Load environment variables from the .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Sample data
    const products = [
      { name: 'Gold Ring', type: 'rings', productCollection: 'Love', price: 299 },
      { name: 'Diamond Necklace', type: 'necklaces', productCollection: 'Luxury', price: 1299 },
    ];
    const categories = [
      { name: 'Rings' },
      { name: 'Necklaces' },
      { name: 'Earrings' },
      { name: 'Bracelets' },
    ];

    // Insert data (without deleting existing)
    await Product.insertMany(products);
    await Category.insertMany(categories);

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
