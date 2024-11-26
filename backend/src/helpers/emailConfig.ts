import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAILPASS:", process.env.EMAILPASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Use 465 for secure SSL/TLS
  secure: true, // SSL connection
  auth: {
    user: process.env.EMAIL_USER, // Use the email address from .env
    pass: process.env.EMAILPASS, // Use the app-specific password from .env
  },
});

export default transporter;
