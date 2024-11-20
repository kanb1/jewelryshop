import dotenv from 'dotenv'; // Import dotenv for environment variables
import express from 'express'; // Import express
import mongoose from 'mongoose'; // Import mongoose
import cors from 'cors'; // Import cors
// Routes
import productsRouter from './routes/products'; // Use ES6 imports for routes

// import categoriesRouter from './routes/categories';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || '';

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON from requests

// MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: unknown) => console.error('Failed to connect to MongoDB', err));



// Adding the routes to the server:
app.use('/api/products', productsRouter); // Attach products router

// API's not used so far
// app.use('/api/categories', categoriesRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
