import dotenv from 'dotenv'; // Import dotenv for environment variables
import express from 'express'; // Import express
import mongoose from 'mongoose'; // Import mongoose
import cors from 'cors'; // Import cors
import fs from 'fs'; // For at læse certifikatfilerne
import https from 'https'; // For at oprette en HTTPS-server
import { Request, Response, NextFunction } from 'express';
import path from "path"; // Import the 'path' module if not already imported




// Routes
import productsRouter from './routes/products'; // Use ES6 imports for routes
import authRouter from './routes/auth'; 
import forgotPasswordRoutes from "./routes/user/forgotpassword";
import authenticateJWT from './routes/authMiddleware';  // Importing the middleware
import cartRoutes from './routes/cart';
import ordersRoutes from "./routes/checkout/orders"; 
import deliveryRoutes from "./routes/checkout/delivery";
import paymentRoute from './routes/checkout/payment';
import favouritesRouter from "./routes/user/favorites";
import adminProducts from "./routes/admin/adminProducts";
import adminOrders from "./routes/admin/adminOrders";
import userRouter from "./routes/user/userinfo";


dotenv.config(); // Load environment variables from .env file


const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || '';
const isProduction = process.env.NODE_ENV === "production";
const frontendURL = isProduction
  ? "https://jewelryshop-two.vercel.app" // Deployed frontend
  : "http://localhost:5173"; // Local frontend





// Middleware
// Ensureing the backend has CORS enabled to accept requests from my frontend's origin (http://localhost:5173).
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development frontend
      "https://jewelryshop-two.vercel.app", // Deployed frontend
    ],
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.json()); // Parse JSON from requests





// Serve static files from the `public/uploads` directory
app.use("/uploads", express.static(path.join(__dirname, "../../public/uploads")));





// MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: unknown) => console.error('Failed to connect to MongoDB', err));

// ***************************************HTTPS*********************************************************
// HTTPS-server opsætning
// Læser indholdet af filen private.key synkront vha fs (file system) modulet i nodeJS 
// private key er stien til filen, som indeholder den private nøgle til SSL certifikatet
// utf8 er filens indhold som skal læses som en streng i UTF-8 kodning, så den privat enøgle returneres som almindelig tekst
// Resultatet er den private nøgle for SSL certifikatet som er nødvendig for at kryptere/dekryptere den sikre kommunikation mellem serveren og klienten

// const privateKey = fs.readFileSync('./new-private.key', 'utf8');

// Det samme som den første, men læses ikke den private nøgle men derimod den offentlige del af SSL certifiktatet. Den beviser serverens ægthed og gør det mulgit at oprette krypteret kommunikationen

// const certificate = fs.readFileSync('./new-certificate.crt', 'utf8');
// const passphrase = process.env.PRIVATE_KEY_PASSPHRASE || ''; // Retrieve passphrase from .env file

// objekt med private nøgle og cerifiktatet
// key: indeholder den private nøgle (som serveren bruger til at dekryptere data).
// cert: indeholder den offentlige nøgle (som serveren bruger til at kryptere data

// const credentials = { key: privateKey, cert: certificate, passphrase: passphrase};


// **********************************************************************Adding the routes to the server:
app.use('/api/products', productsRouter); //  products router
app.use('/api/auth', authRouter); //  auth router for authentication
app.use("/api/forgotpassword", forgotPasswordRoutes);
app.use('/api', cartRoutes); // Cart routes
app.use("/api/orders", ordersRoutes); // All order routes will now be prefixed with `/api/orders`
app.use("/api/delivery", deliveryRoutes);
app.use('/api/payment', paymentRoute);
app.use("/api/favourites", favouritesRouter);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/orders", adminOrders);
app.use('/api/users', userRouter);



const staticPath = isProduction
  ? path.join(__dirname, "uploads") 
  : path.join(__dirname, "../../public/uploads");

app.use("/uploads", express.static(staticPath));



// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      isProduction ? "production" : "development"
    } mode on ${isProduction ? "https" : "http"}://localhost:${PORT}`
  );
});
// ***********************PRODUCTION MODE*****************************Create HTTPS server instead of HTTP server
// https.createServer(credentials, app).listen(PORT, () => {
//   console.log(`Server running on https://localhost:${PORT}`);
// });
