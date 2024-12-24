import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../models/User";
import authenticateJWT from "../authMiddleware";
import nodemailer from "nodemailer";
import upload from "../../helpers/multerConfig"; // Import the multer config
import fs from "fs"; // File System module
import path from "path";



// Extend the Request type to include user details from the JWT
interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

//************************************************************** */ GET USER INFO

router.get("/me", authenticateJWT, async (Request: AuthenticatedRequest, Response) => {
  try {
    const userId = Request.user?.userId;

    if (!userId) {
       Response.status(400).json({ message: "User ID not found in request" });
       return;
    }

    // Fetches the user’s information from the database and excludes the password field for security.
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

//************************************************************** */ UPDATE USER INFO

router.put("/:id", authenticateJWT, async (Request: AuthenticatedRequest, Response) => {
  const nameRegex = /^[A-Za-z]+$/;
  const { name, surname } = Request.body;


  try {
    const userId = Request.user?.userId;
    const updates = Request.body;

    // VALIDATION
    if (!userId || userId !== Request.params.id) {
      Response.status(403).json({ message: "Unauthorized to update this user" });
      return;
    }

    if (!name || !surname) {
      Response.status(400).json({ message: "First name and last name cannot be empty." });
      return;
    }

    if (name.length < 2 || !nameRegex.test(name)) {
      Response.status(400).json({ message: "First name must be at least 2 characters and cannot contain numbers or special characters." });
      return;
    }

    if (surname.length < 2 || !nameRegex.test(surname)) {
      Response.status(400).json({ message: "Last name must be at least 2 characters and cannot contain numbers or special characters." });
      return;
    }



    if (!userId || userId !== Request.params.id) {
       Response.status(403).json({ message: "Unauthorized to update this user" });
       return;
    }

    // Updates the user's information in the database and validates the input.
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

    // Verifies that the provided current password matches the hashed password stored in the database.
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



//************************************************************** */ UPLOAD PROFILE PICTURE
//Use Multer middleware for single file upload
router.post("/upload-profile-picture", authenticateJWT, upload.single("profilePicture"), async (Request, Response) => {
    try {
      // Ensure the file is uploaded
      if (!Request.file) {
         Response.status(400).json({ message: "No file uploaded" });
         return;
      }

      // Get user ID from the authenticated JWT
      const userId = (Request as any).user?.userId; // Assuming your `authMiddleware` adds `userId` to `req.user`

      if (!userId) {
         Response.status(401).json({ message: "Unauthorized" });
        return;

      }
      

      // Fetch the user to get the current profile picture path
      const user = await User.findById(userId);
      if (!user) {
        Response.status(404).json({ message: "User not found" });
        return;
      }

          // Save the relative file path of the new profile picture
          const relativeFilePath = `uploads_profilepictures/${Request.file.filename}`;

          // Delete the old profile picture if it exists
      if (user.profilePicture) {
        const oldFilePath = path.join(
          __dirname,
          "../../../../public",
          user.profilePicture
        ); // Resolve relative path to absolute path

        try {
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        } catch (err) {
          console.error(`Failed to delete old file: ${oldFilePath}`, err);
        }
      }
    
          // Update the user's profile picture path in the database
          user.profilePicture = relativeFilePath;
          await user.save();

      Response.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePicture: relativeFilePath, // Return relative path for frontend usage
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Response.status(500).json({ message: "Server error" });
    }
  }
);


  

  export default router;


