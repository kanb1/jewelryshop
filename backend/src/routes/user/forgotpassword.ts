import express, { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../../models/User";
import transporter from "../../helpers/emailConfig"; // Using centralized transporter
import { FRONTEND_URL } from "../../config";


const router = express.Router();

// POST /forgot-password - Send reset link to user's email
router.post("/forgot-password", async (Request, Response) => {
  // takes the email from the requestbody
  const { email } = Request.body;

  // finds the user with the provided email
  try {
    const user = await User.findOne({ email });
    if (!user) {
      Response.status(404).json({ message: "User with this email does not exist" });
      return;
    }

    // creates a a token using crypto.randomBytes()
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    // saves the token and expiration time in the user's document
    await user.save();

    // Generate the reset link
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    // Send email, I use nodemaielr with the gmail SMTP server. SEnds a personalized email with the passwrod reset link
    try {
      await transporter.sendMail({
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
      });

      Response.status(200).json({ message: "Password reset link sent to your email" });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      Response.status(500).json({ message: "Error sending password reset email" });
    }
  } catch (err) {
    console.error("Error during password reset request:", err);
    Response.status(500).json({ message: "Server error" });
  }
});

// PUT /reset-password - Reset user password
router.put("/reset-password", async (Request, Response) => {
  const { token, id, newPassword } = Request.body;

  try {
    const user = await User.findById(id);

    // Debugging to check what is received
    console.log({
        userExists: !!user,
        resetPasswordToken: user?.resetPasswordToken,
        incomingToken: token,
        resetPasswordExpires: user?.resetPasswordExpires,
        currentTime: Date.now(),
      });

    // ensures: user exists, reset token matches the one stored in db, the token has not expired 

    if (
        !user ||
        !user.resetPasswordToken ||
        !user.resetPasswordExpires ||
        user.resetPasswordToken !== token ||
        user.resetPasswordExpires.getTime() < Date.now()
      ) {
        console.log("Debugging reset-password:", {
          userExists: !!user,
          resetPasswordToken: user?.resetPasswordToken,
          incomingToken: token,
          resetPasswordExpires: user?.resetPasswordExpires,
          currentTime: Date.now(),
        });
        Response.status(400).json({ message: "Invalid or expired reset token" });
        return;
      }
      

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user with the new password
    user.password = hashedPassword;
    // make sure the token can't be used again to change the password, after one time use
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the token expiration
    await user.save();

    Response.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error during password reset:", err);
    Response.status(500).json({ message: "Server error" });
  }
});

export default router;
