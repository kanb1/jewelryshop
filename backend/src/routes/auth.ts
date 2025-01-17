// express --> framework for building the API
//  NextFunction --> Used for middleware to pass control to the next middleware or route handler
import express, { NextFunction, Request, Response } from "express";
// to hash or compare passwords securely
import bcrypt from "bcrypt";
// used to create and verify JOSN web tokens for authentication
import jwt from "jsonwebtoken";
// Custom middleware to verify jwt tokens for protected routes
import authenticateJWT from "./authMiddleware";
// my mongoose model for interacting with the user colelction in the db
import User from "../models/User";
// **************SECURITY
import { v4 as uuidv4 } from "uuid"; 
import Session from "../models/Session";
import rateLimit from 'express-rate-limit';
import crypto from "crypto"; // Til at generere verifikationstoken
import { body, validationResult } from "express-validator"; 
import transporter from "../helpers/emailConfig"; 
import dotenv from 'dotenv';
import { FRONTEND_URL } from "../config";






dotenv.config();

// creates a new instance of an express router to define API endpoints
const router = express.Router();
require("dotenv").config();



// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************

// Rate limiter for signup (Register)
const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutter
  max: 5, // Max 5 requests pr. IP
  message: "Too many signup attempts from this IP, please try again later.",
});

// Rate limiter for login
const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutter
  max: 10, // Max 10 requests pr. IP
  message: "Too many login attempts from this IP, please try again later.",
});

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment. Check your .env file.");
}

// ******************************************************************************************* REGISTER

// We receive the form data via a POST request to /api/auth/users
router.post(
  "/users",
  [
    // VALIDATION AND SANITIZING RULES
    body("username")
      .trim() // Fjern unødvendige mellemrum fra starten og slutningen
      .escape() // Escape HTML-tegn for at forhindre XSS
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long.")
      .isAlphanumeric() //Kræver kun bogstaver og tal i brugernavnet
      .withMessage("Username can only contain letters and numbers."),
    body("email")
      .trim()
      .escape() // Escape HTML-tegn for at forhindre XSS
      .normalizeEmail() // Normaliserer email (fjerner unødvendige tegn og sikrer korrekt format)
      .isEmail()
      .withMessage("Invalid email format."),
    body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage("Password must be between 8 and 64 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must include at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must include at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must include at least one number.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must include at least one special character."),
    body("name")
      .trim()
      .escape()
      .matches(/^[A-Za-z]+$/)
      .withMessage("First name can only contain letters.")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),
    body("surname")
      .trim()
      .escape()
      .matches(/^[A-Za-z]+$/)
      .withMessage("Last name can only contain letters.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),
  ],
  registerRateLimiter, //Begrænser antallet af signup forsøg
  async (req: Request, res: Response) => {
    // Validér inputtet
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
       return;
    }

    // Inputdata er nu både valideret og saniteret
    // Extract sanitizeret input
    const { username, email, password, name, surname } = req.body;

    try {
      // Tjek hvis user eller email allerede eksisterer
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        res.status(400).json({ error: "Username or email already exists." });
        return;
      }


      // Hash password before saving tot he database
      // Hasher password med en salt round på 10
      const hashedPassword = await bcrypt.hash(password, 10);

      // GEnerate an email verification token med crypto
      // Genrerr 32 random bytes, Konverterer til en hexadecimal streng
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Gem den nye bruger i databasen
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name,
        surname,
        role: "user", //default role
        isVerified: false, //not verified by defailt
        verificationToken,
      });
      await newUser.save();

      // Send verification email der også indeholder en verificationToken
      const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Verify your email address",
        html: `<p>Hi ${name},</p>
               <p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>
               <p>If you didn't request this, please ignore this email.</p>`,
      });

      res.status(201).json({
        message: "User registered successfully. A verification email has been sent.",
      });
    } catch (err) {
      console.error("Error during signup:", err);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  }
);


// ******************************************************************************************************** EMAIL VERIFICATION
router.get("/verify-email", async (req, res) => {
  // Indeholder query-parametrene fra URL'en, hvor vi blandt andet har token
  // Vi trækker token ud som er en del af URL'en --> For at finde den rigtige bruger i databasen
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ error: "Token is required." });
    return;
  }

  // Find bruger med den givne token
  try {
    // Søger efter en bruger i databasen, hvis verificationtoken matcher det token der blev sendt i forespørgslen
    // Hver bruger har en unik verificationToken, som belv genereret og gemt under registrering --> BRgues til at identifcere brugeren
    const user = await User.findOne({ verificationToken: token });

    // Handle already verified users
    if (!user && await User.findOne({ isVerified: true })) {
      res.status(200).json({ message: "If the token is valid, your email will be verified." });
      return;
    }

    // Handle invalid tokens
    if (!user) {
      res.status(400).json({ error: "Invalid or expired token." });
      return;
    }

    // Verify user and remove the token
    user.isVerified = true; //Sætter til true --> Bruger nu verificeret
    user.verificationToken = undefined; //Fjerner token fra db så den ikke kan bruges igen
    await user.save(); //gemmer opdateringerne i db

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});








// ******************************************************************************************************** LOGIN

router.post(
  "/login",
  loginRateLimiter, // Begræns antallet af loginforsøg
  [
    body("username")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Username is required.")
      .isAlphanumeric()
      .withMessage("Username can only contain letters and numbers."),
    body("password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() }); 
      return;
    }

    // Vi har valideret og sanitized inputsene
    const { username, password } = req.body;

    try {
      // Find brugeren i databasen
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ error: "Invalid credentials." });
        return;
      }

      // Tjek om brugeren er verificeret
      if (!user.isVerified) {
        res.status(403).json({ error: "Your account is not verified. Please verify your email." });
        return;
      }

      // Sammenlign hashed pass med den indtastede pass
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).json({ error: "Invalid username or password." });
        return;
      }

      // Kontrollér, at JWT_SECRET er sat
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment. Check your .env file.");
      }

      // Generér JTI (Unique Token ID) for sessions
      const jti = uuidv4();

      // Gem JTI i databasen
      await Session.create({ jti });

      // Opret JWT-token - med jti
      // Signeres med JWT_secret
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
          jti,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Sender token tilbage til frotnend som gemmer den i localstorage
      res.status(200).json({
        message: "Login successful.",
        token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);




// ********************************************************************************************************** FETCHES USERDATA

// The payload from the token generated during login up with login ^ is used later in the /profile route (and any other protected routes) to identify the user and retrieve their data

// GET /auth/profile - Protected profile route

// authenticateJWT --> middleware that verifies the jwt token provided by the client in the request (eg in the authorization header)
// if the middleware is valid it decodes the payload and attacehs it to req-user

  // req: Request & { user?: any } --> extends the default Request object to include user (populated by authenticateJWT)
router.get("/profile", authenticateJWT, async (req: Request & { user?: any }, res: Response) => {

  if (!req.user) {
    res.status(401).json({ error: "Unauthorized: No user data found" });
    return;
  }

  try {
    //Uses the userId field from req.user (populated from the JWT payload) to find the user in the MongoDB database.
    // .select("username email name surname role") --> Retrieves only the specified fields from the user document. This limits the data sent to the client (e.g., it does not include sensitive fields like password
    const user = await User.findById(req.user.userId).select("username email name surname role");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // response data with the user's data and succesful message
    res.status(200).json({
      message: "This is a protected profile route",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching user data" });
  }
});

// ****************************************************************************** LOGOUT 
// *******************************SECURITY*************************************** 

router.post("/logout", async (req: Request, res: Response) => {
  // Hent token fra header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
     res.status(400).json({ error: "No token provided for logout." });
     return;
  }

  try {
    // Decode token og find JTI
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as jwt.JwtPayload;


    // Slet sessionen
    const sessionDeleted = await Session.deleteOne({ jti: decoded.jti });
    if (sessionDeleted.deletedCount === 0) {
      console.warn("No active session found for the provided token.");
    }

     res.status(200).json({ message: "Logout successful. Session invalidated." });
     return;
  } catch (err) {
    console.error("Error during logout:", err);

    // If the token is invalid or expired, still return logout success
     res.status(200).json({ message: "Logout successful. Token was invalid or expired." });
     return;
  }
});

// ****************************************************************************** MIDDLEWARE THAT CHECKS IF THE USER IS ADMIN
// Middleware function that checks if the user is an admin.
// Runs before protected routes that require admin privileges.
export const adminMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

export default router;
