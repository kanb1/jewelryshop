import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";

const router = express.Router();

// Middleware
router.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Route til at hente CSRF-token
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// Beskytter en POST med CSRF
router.post("/protected-route", csrfProtection, (req, res) => {
  res.status(200).json({ message: "CSRF token validated and request successful!" });
});

export default router;

