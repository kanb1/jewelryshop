import dotenv from 'dotenv'; // Import dotenv for environment variables
import express from 'express'; // Import express
import mongoose from 'mongoose'; // Import mongoose
import cors from 'cors'; // Import cors

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


// Routes
import productsRouter from './routes/products'; // Use ES6 imports for routes

app.use('/api/products', productsRouter); // Attach products router

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
