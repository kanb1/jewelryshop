import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../../models/User";
import authenticateJWT from "../authMiddleware";
import nodemailer from "nodemailer";
import upload from "../../helpers/multerConfig";
import fs from "fs"; // File System module
import path from "path";
import rateLimit from "express-rate-limit";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************

// Opsætter en virtuel DOM for DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Konfigurerer rate limiting til min upload-rute
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutter
  max: 10, // Maks. 10 uploads pr. IP inden for 15 minutter
  message: {
    message: "Too many uploads from this IP. Please try again after 15 minutes.",
  },
  // Returnerer rate limit info i standard headers
  // ratelimit-limit, ratelimit-remaining osv (det maksimale antal anmodninger der er tilladt og antal af resterende anmodninger)
  standardHeaders: true, 
  // Skjuler "X-RateLimit" headers
  // Fjerner de gamle rate limit-headers, legacyheaders, de er ikke standardiseret og moderne klienter forstår dem ikke
  legacyHeaders: false, 
});

//Konfigurerer rate limiter til chagnepass endpointet for at forhindre brute-force angreb
const passwordChangeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutter
  max: 5, // Maks. 5 forsøg per IP inden for 15 minutter
  message: {
    message: "Too many attempts. Please try again later.",
  },
});
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************



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
  const { name, surname } = Request.body;

  try {
    const userId = Request.user?.userId;

    // Ensure the user is authorized to update this profile
    if (!userId || userId !== Request.params.id) {
      Response.status(403).json({ message: "Unauthorized to update this user" });
      return;
    }

    // Rens input med DOMPurify
    const sanitizedName = DOMPurify.sanitize(name?.trim() || "");
    const sanitizedSurname = DOMPurify.sanitize(surname?.trim() || "");

    // Valider input efter rensning
    if (!sanitizedName || !sanitizedSurname) {
      Response.status(400).json({ message: "First name and last name cannot be empty." });
      return;
    }
    if (sanitizedName.length < 2 || sanitizedSurname.length < 2) {
      Response.status(400).json({ message: "First and last names must be at least 2 characters." });
      return;
    }


    // Opdater brugerdata i databasen
    const user = await User.findByIdAndUpdate(
      userId,
      { name: sanitizedName, surname: sanitizedSurname },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      Response.status(404).json({ message: "User not found" });
      return;
    }

    Response.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    Response.status(500).json({ message: "Server error" });
  }
});





// ****************************************************************PASSWORD CHANGE
// PUT /users/:id/change-password - Change password
router.put("/:id/change-password", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Få bruger-ID fra JWT
    let { currentPassword, newPassword } = req.body;

    // Rens input med DOMPurify
    currentPassword = DOMPurify.sanitize(currentPassword);
    newPassword = DOMPurify.sanitize(newPassword);

    // Valider, at input ikke er tomme
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Current password and new password are required." });
      return;
    }

    // Sikrer, at brugeren kun ændrer deres egen adgangskode
    if (!userId || userId !== req.params.id) {
      res.status(403).json({ message: "Unauthorized to change password for this user" });
      return;
    }

    // Find brugeren baseret på ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Tjek, om den aktuelle adgangskode matcher
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    // Valider styrken af den nye adgangskode (OWASP)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({
        message:
          "New password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      });
      return;
    }

    // Hash og gem den nye adgangskode
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send bekræftelse
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});




//************************************************************** */ UPLOAD PROFILE PICTURE
//Use Multer middleware for single file upload
router.post("/upload-profile-picture", authenticateJWT, uploadRateLimiter, upload.single("profilePicture"), async (Request, Response) => {
    try {
      // Tjekker om der faktisk er en fil uploadet. 
      if (!Request.file) {
         Response.status(400).json({ message: "Upload failed. Please try again." });
         return;
      }

      // Get user ID from the authenticated JWT
      const userId = (Request as any).user?.userId; // Assuming your `authMiddleware` adds `userId` to `req.user`

      // Sørger for at kun den autentificerede bruger kan ændre sin profil. Hvis brguerens JWT mangler eller er ugyldig, returneres en 401 Unauthorized
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

     // Rens metadata eller brugerspecifik input
      // Genererer en relativ filsti til de tuploadede billede for at undgå eksponering af den fulde serversti
      const relativeFilePath = `uploads_profilepictures/${DOMPurify.sanitize(Request.file.filename)}`;


      // Delete the old profile picture if it exists
      if (user.profilePicture) {
        const oldFilePath = path.join(
          __dirname,
          "../../../../public",
          user.profilePicture
        ); 

        try {
          // Sletning af det gamle billede
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


