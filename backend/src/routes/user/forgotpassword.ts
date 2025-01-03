import express, { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../../models/User";
import transporter from "../../helpers/emailConfig";
import { FRONTEND_URL } from "../../config";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

const router = express.Router();

// **************SECURITY
// Rate limiter for forgot-password to prevent brute-force or spam attacks
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP
  message: "Too many password reset requests from this IP, please try again later.",
});

// Rate limiter for reset-password to limit password reset attempts
const resetPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per IP
  message: "Too many reset password attempts from this IP, please try again later.",
});

// ******************************************************************************** FORGOT PASS
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter, // Apply rate limiting
  [
    // Validate and sanitize email input
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  ],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
       return;
    }

    const { email } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      const genericResponse = { message: "If an account exists, you will receive a reset email shortly." };

      if (!user) {
        // Generic response to prevent user enumeration attacks
         res.status(200).json(genericResponse);
        return;

      }

      // Generate a secure, random token for password reset
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // Hash token for storage
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // Set token expiry to 1 hour

      await user.save();

      // Construct secure reset link
      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

      // Send reset email with the token
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>
        `,
      });

      // Send generic success message to user
       res.status(200).json(genericResponse);
       return;

    } catch (err) {
      console.error("Error during forgot password request:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ******************************************************************************** RESET PASS
router.put(
  "/reset-password",
  resetPasswordRateLimiter, // Apply rate limiting
  [
    // Validate and sanitize inputs
    body("token").notEmpty().trim().escape().withMessage("Token is required"),
    body("id").notEmpty().trim().escape().withMessage("User ID is required"),
    body("newPassword")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain a lowercase letter")
      .matches(/\d/).withMessage("Password must contain a number")
      .matches(/[@$!%*?&#]/).withMessage("Password must contain a special character"),
  ],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
      return;

    }

    const { token, id, newPassword } = req.body;

    try {
      // Find user by ID
      const user = await User.findById(id);

      if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
        // Reject if user doesn't exist or token is missing
         res.status(400).json({ message: "Invalid or expired reset token" });
        return;

      }

      // Hash the incoming token to compare securely
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      // Validate token and expiry time
      if (hashedToken !== user.resetPasswordToken || user.resetPasswordExpires.getTime() < Date.now()) {
         res.status(400).json({ message: "Invalid or expired reset token" });
        return;

      }

      // Hash the new password securely
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined; // Clear token after use
      user.resetPasswordExpires = undefined;

      await user.save();

      // Notify user of successful password reset
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Successful",
        html: `<p>Your password has been reset successfully. If you didn't initiate this request, please contact support immediately.</p>`,
      });

       res.status(200).json({ message: "Password reset successful" });
       return;

    } catch (err) {
      console.error("Error during password reset:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
