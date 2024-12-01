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
// PUT /users/:id/change-password - Change password
router.put("/:id/change-password", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId; // Get user ID from the authenticated JWT
  const { currentPassword, newPassword } = req.body;

  try {
    // Ensure the user is only updating their own password
    if (!userId || userId !== req.params.id) {
      res.status(403).json({ message: "Unauthorized to change password for this user" });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    // Hash and update the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});


  

  export default router;


