// src/routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
// A library for creating and verifying JSON Web Tokens. This is used for authentication and session management.
import jwt from 'jsonwebtoken';
import authenticateJWT from './authMiddleware';
import User from '../models/User'; // Importer din produktmodel
import { Request, Response } from 'express';


// creates an Express router where all the routes (like user registration and login) will be defined
const router = express.Router();

// POST /users - Register a new user
router.post('/users', async (req: Request, res: Response) => {
  const { username, email, password, name, surname } = req.body;

  // Check if the user or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    res.status(400).json({ error: 'User or email already exists' });
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the new user to the database
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    name,
    surname,
  });
  await newUser.save();

  res.status(201).json({ message: 'User created successfully' });
});


// POST /auth/login - User login
// Route for userlogin, it listens for POST request at /auth/login, and it's used for logging in an existing user
router.post('/login', async (Request, Response) => {
    // the username and password are extracted from the request body
  const { username, password } = Request.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
     Response.status(400).json({ error: 'Invalid username or password' });
     return;
  }

  // Compare password
//   bcrypt.compare() compares the plain text password by the user with the hashed password stored in the database (user.password)
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
     Response.status(400).json({ error: 'Invalid username or password' });
     return
  }

  // Generate JWT token --> After a user logs in successfully a token is generated. Denne her token indeholder en unik identifikation af brugeren feks deres brugerID. Den inforation er kodet ii tokenet
//   Når klienten sender en anmodning (fx at hente produkter der er købt), så behøver serveren ikek at søge i en database for at finde ud af hvilken bruger der er logget ind, men det er allerede gemt i JWT'et som følger med anmodningen, så ved serveren hvilken bruger det tilhører. Den sender normalt tokenet med (i HTTP headeren)
    // Whenever the client makes subsequent requests, they can then include the token in the Authorization header as Bearer <token>. The backend then verifies the token to authenticate the user
    // Instead of session-based authentication
  // jwt.sign() creates a JWT tokes. It takes:
    // the payload (userID: user._id), but it can include any data you want tos tore in the token
    // the secret key (process.env.SECRET_KEY), which is used to sign and verify the token. 
    // ***REMEMBER TO REPLACE YOURSECRETKEY WITH A SECRET KEY STORED IN ENVIRONMENT VARIABLES
  const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
  Response.status(200).json({ message: 'Login successful', token });
});


// GET /auth/profile - Protected profile route
router.get('/profile', authenticateJWT, async (req: Request & { user?: any }, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: No user data found' });
    return;
  }

  try {
    const user = await User.findById(req.user.userId).select('username email name surname');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'This is a protected profile route',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});


export default router;
