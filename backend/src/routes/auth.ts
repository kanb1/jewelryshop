import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateJWT from "./authMiddleware";
import User from "../models/User";

const router = express.Router();

// POST /users - Register a new user
router.post("/users", async (Request, Response) => {
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
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    const errorMessage =
      existingUser.username === username
        ? "Username already exists. Please choose a different one."
        : "Email already exists. Please use a different email.";
        Response.status(400).json({ error: errorMessage });
     return;
  }
  

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the new user to the database (default role is 'user')
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    surname,
    role: "user", // Default role
  });
  await newUser.save();

  Response.status(201).json({ message: "User created successfully" });
});

// POST /auth/login - User login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    // Generate JWT with `role` included
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in payload
      process.env.SECRET_KEY || "your-secret-key", // Replace with your actual secret key
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /auth/profile - Protected profile route
router.get("/profile", authenticateJWT, async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized: No user data found" });
    return;
  }

  try {
    const user = await User.findById(req.user.userId).select("username email name surname role");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "This is a protected profile route",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching user data" });
  }
});

// Admin Middleware
export const adminMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

export default router;
