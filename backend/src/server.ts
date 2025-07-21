import dotenv from "dotenv"; // Import dotenv for environment variables
import express from "express"; // Import express
import mongoose from "mongoose"; // Import mongoose
// **************SECURITY
import cors from "cors"; // Import cors
import helmet from "helmet";
// For at læse certifikatfilerne
import fs from "fs";
// For at oprette en HTTPS-server
import https from "https";
import { Request, Response, NextFunction } from "express";
import path from "path";
import rateLimit from "express-rate-limit"; // Import rate limiting middleware

// Routes
import productsRouter from "./routes/products"; // Use ES6 imports for routes
import authRouter from "./routes/auth";
import forgotPasswordRoutes from "./routes/user/forgotpassword";
import authenticateJWT from "./routes/authMiddleware"; // Importing the middleware
import cartRoutes from "./routes/cart";
import ordersRoutes from "./routes/checkout/orders";
import deliveryRoutes from "./routes/checkout/delivery";
import paymentRoute from "./routes/checkout/payment";
import favouritesRouter from "./routes/user/favorites";
import adminProducts from "./routes/admin/adminProducts";
import adminOrders from "./routes/admin/adminOrders";
import userRouter from "./routes/user/userinfo";
import recycleRoutes from "./routes/recycle";

dotenv.config(); // Load environment variables from .env file

const app = express();

// **********************************//SECURITY MIDDLEWARES//******************************************
// **********************************//SECURITY MIDDLEWARES//******************************************
// **********************************//SECURITY MIDDLEWARES//******************************************
// **********************************//SECURITY MIDDLEWARES//******************************************

//************************************************************************ */ Helmet for security headers

// Helmet is a middleware for express that adds HTTP headers to improve the security of my app
// Helps against attacks like XSS, Clickjacking..

// CSP (Content Security Policy) controls which resources my app is allowed to load
// Prevents XSS and data injection --> No injected JS into my site for example. Only trusted scripts can run.
app.use(
  helmet({
    frameguard: { action: "sameorigin" }, // Prevents clickjacking
    hidePoweredBy: true, // Hides "X-Powered-By: Express"
    hsts: { maxAge: 31536000 }, // Enforce HTTPS for 1 year
    noSniff: true, // Prevents MIME type sniffing
    contentSecurityPolicy: {
      // Your current CSP config
      directives: {
        defaultSrc: ["'self'"],
        // nonce-baseret CSP: Generer en ny tilfældig nonce ved hver request og tilføjer den i inline script
        scriptSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://api.geoapify.com",
        ],
        styleSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://storage.googleapis.com",
          "http://localhost:5001",
        ],
        connectSrc: ["'self'", "https://jewelryshop-8q3d.onrender.com"],
        fontSrc: ["'self'", "https://fonts.googleapis.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Fix for image blocking. In my CSP I'm restricting which domains the cross can happen between
    referrerPolicy: { policy: "no-referrer" }, // Reducer referrer-lækager
  })
);

const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || "";
// checks if the current environment is proudction by the NODE_ENV
const isProduction = process.env.NODE_ENV === "production";
const frontendURL = isProduction
  ? "https://jewelryshop-two.vercel.app" // Deployed frontend
  : "http://localhost:5173"; // Local frontend

//************************************************************************ */ CORS configuration

// Ensureing the backend has CORS enabled to accept requests from my frontend's origin (http://localhost:5173).

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development frontend
      "https://jewelryshop-two.vercel.app", // Deployed frontend
    ],
    credentials: true, // Allowing the cookies and authentication headers
  })
);
app.use(express.json());

// ********************************** Rate Limiting **********************************

// Rate limiting middleware to limit requests from a single IP
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.", // Error message
  headers: true, // Include rate limit info in response headers
});

// Apply the rate limiter globally to all routes
app.use(globalRateLimiter);

// **********************************//GENERAL STUFF//****************************************************
// **********************************//GENERAL STUFF//****************************************************
// **********************************//GENERAL STUFF//****************************************************
// **********************************//GENERAL STUFF//****************************************************
// **********************************//GENERAL STUFF//****************************************************

// Serve static files from the `public/uploads` directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../../public/uploads"))
);
app.use(
  "/uploads_profilepictures",
  express.static(path.join(__dirname, "../../public/uploads_profilepictures"))
);
console.log(
  "Serving static files from:",
  path.join(__dirname, "../../public/uploads_profilepictures")
);

//************************************************************************ */ MongoDB connection
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: unknown) => console.error("Failed to connect to MongoDB", err));

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
app.use("/api/products", productsRouter); //  products router
app.use("/api/auth", authRouter); //  auth router for authentication
app.use("/api/forgotpassword", forgotPasswordRoutes);
app.use("/api", cartRoutes); // Cart routes
app.use("/api/orders", ordersRoutes); // All order routes will now be prefixed with `/api/orders`
app.use("/api/delivery", deliveryRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/favourites", favouritesRouter);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/orders", adminOrders);
app.use("/api/users", userRouter);
app.use("/api/recycle", recycleRoutes);

const staticPath = isProduction
  ? path.join(__dirname, "uploads")
  : path.join(__dirname, "../../public/uploads");

app.use("/uploads", express.static(staticPath));

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${isProduction ? "production" : "development"} mode on ${
      isProduction ? "https" : "http"
    }://localhost:${PORT}`
  );
});

// ***********************PRODUCTION MODE*****************************Create HTTPS server instead of HTTP server
// https.createServer(credentials, app).listen(PORT, () => {
//   console.log(`Server running on https://localhost:${PORT}`);
// });
