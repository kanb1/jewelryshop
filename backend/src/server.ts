import dotenv from 'dotenv'; // Import dotenv for environment variables
import express from 'express'; // Import express
import mongoose from 'mongoose'; // Import mongoose
import cors from 'cors'; // Import cors
import fs from 'fs'; // For at læse certifikatfilerne
import https from 'https'; // For at oprette en HTTPS-server
import { Request, Response, NextFunction } from 'express';



// Routes
import productsRouter from './routes/products'; // Use ES6 imports for routes
import authRouter from './routes/auth'; // Import the new authentication routes
import authenticateJWT from './routes/authMiddleware';  // Import the middleware



// import categoriesRouter from './routes/categories';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || '';

// Middleware
// Ensureing the backend has CORS enabled to accept requests from my frontend's origin (http://localhost:5173).
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); // Parse JSON from requests

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
app.use('/api/products', productsRouter); // Attach products router
app.use('/api/auth', authRouter); // Attach auth router for authentication









// ***********************************************************API's not used so far
// app.use('/api/categories', categoriesRouter);

// Testing the middleware
// app.get('/test-middleware', authenticateJWT, (req: Request & { user?: any }, res: Response) => {
//   if (!req.user) {
//     res.status(401).json({ error: 'Unauthorized: No user found' });
//     return;
//   }
//   res.json({
//     message: 'Middleware is working!',
//     user: req.user, // Display the decoded JWT payload here
//   });
// });




// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ***********************PRODUCTION MODE*****************************Create HTTPS server instead of HTTP server
// https.createServer(credentials, app).listen(PORT, () => {
//   console.log(`Server running on https://localhost:${PORT}`);
// });
