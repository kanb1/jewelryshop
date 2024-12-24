import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAILPASS:", process.env.EMAILPASS);

// nodemailer transporter for sending emails
// uses the env.variables, emailuser, email pass to configure the gmail SMTP server

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Using 465 for secure SSL/TLS
  secure: true, // SSL connection
  auth: {
    user: process.env.EMAIL_USER, // Using the email address from .env
    pass: process.env.EMAILPASS, // Using the app-specific password from .env
  },
});

// we use the transporter.sendMail to send an email, fx in the reset link

export default transporter;
