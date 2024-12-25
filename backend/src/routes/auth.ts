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

// creates a new instance of an express router to define API endpoints
const router = express.Router();
require("dotenv").config();


// We receive the form data via a POST request to /api/auth/users
// ******************************************************************************************* REGISTER
// POST /users - Register a new user
router.post("/users", async (Request, Response) => {
  // extracts form data, destructs the form data sent in the request body
  const { username, email, password, name, surname } = Request.body;
  const nameRegex = /^[A-Za-z]+$/;


  // *************VALIDERING
  // Validate input
  if (!username || !email || !password || !name || !surname) {
    Response.status(400).json({ error: "All fields are required. Please complete the form." });
    return;

  }

  if (username.length < 3) {
    Response.status(400).json({ error: "Username must be at least 3 characters long." });
     return;

  }

  if (!nameRegex.test(name)) {
     Response
      .status(400)
      .json({ error: "First name cannot contain numbers or special characters." });
      return;
  }

  if (!nameRegex.test(surname)) {
     Response
      .status(400)
      .json({ error: "Last name cannot contain numbers or special characters." });
      return;
  }

  if (name.length < 2) {
    Response.status(400).json({ error: "First name must be at least 2 characters long." });
    return;

  }

  if (surname.length < 2) {
    Response.status(400).json({ error: "Last name must be at least 2 characters long." });
     return;

  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Response.status(400).json({ error: "Invalid email format. Please enter a valid email." });
     return;

  }

  if (password.length < 6) {
    Response.status(400).json({ error: "Password must be at least 6 characters long." });
    return;

  }

  // Check for existing username or email
  //searches the database for an existing user with the same username or email
  // returns error if dubplicate is found
  // $or is a query operator used to match documents that satisfy at least one of multiple conditions.
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    const errorMessage =
      existingUser.username === username
        ? "Username already exists. Please choose a different one."
        : "Email already exists. Please use a different email.";
        Response.status(400).json({ error: errorMessage });
     return;
  }
  

  // Hash password using bcrypt with a salt round of 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB interaction --> Save the new user to the database (default role is 'user')
  // this creates a new user document with the hashed pass and saves it to the db
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    surname,
    role: "user", // Default role
  });
  await newUser.save(); //.save, mongoose method 

  Response.status(201).json({ message: "User created successfully" });
});



// ******************************************************************************************************** LOGIN

// POST /auth/login - User login
router.post("/login", async (req: Request, res: Response) => {
  // extracting the login data (username pass)
  const { username, password } = req.body;

  try {
    // Find the user by username (looking up in the database User.findOne)
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    // Compare provided password (plain text) with the stored hash pass stored in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    // checks if the environment variable is defined
    // prevents the app from running without a secret key
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment. Check your .env file.");
    }
    
    // generate a token --> creates a JSON Web Token with userId and role
      // signs the token using a secret JWT secret and sets it to expire in 1 hour
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role }, // Payload containing the userId and role from the authenticated user
      process.env.JWT_SECRET, // Environment variable for the secret, used to sign the token. to ensure the token can't be tampered with
      // expiration instead of session management
      { expiresIn: "1h" }
    );
    console.log("JWT_SECRET is:", process.env.JWT_SECRET);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



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
