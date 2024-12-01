import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../models/User";
import authenticateJWT from "../authMiddleware";
import nodemailer from "nodemailer";


// Extend the Request type to include user details from the JWT
interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

// GET /users/me - Fetch user details
router.get("/me", authenticateJWT, async (Request: AuthenticatedRequest, Response) => {
  try {
    const userId = Request.user?.userId;

    if (!userId) {
       Response.status(400).json({ message: "User ID not found in request" });
       return;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
       Response.status(404).json({ message: "User not found" });
       return;
    }

     Response.status(200).json(user);
     return;
  } catch (err) {
    console.error("Error fetching user details:", err);
     Response.status(500).json({ message: "Server error" });
     return;
  }
});

// PUT /users/:id - Update user info
router.put("/:id", authenticateJWT, async (Request: AuthenticatedRequest, Response) => {
  try {
    const userId = Request.user?.userId;
    const updates = Request.body;

    if (!userId || userId !== Request.params.id) {
       Response.status(403).json({ message: "Unauthorized to update this user" });
       return;
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
       Response.status(404).json({ message: "User not found" });
       return;
    }

     Response.status(200).json({ message: "User updated successfully", user });
     return;
  } catch (err) {
    console.error("Error updating user:", err);
     Response.status(500).json({ message: "Server error" });
     return;
  }
});




// ****************************************************************PASSWORD CHANGE

  

  export default router;


