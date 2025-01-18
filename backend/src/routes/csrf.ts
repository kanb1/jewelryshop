import express from "express";
// Middleware from the csurf package to enable CSRF protection.
import csrf from "csurf";
// Middleware to parse cookies in incoming requests. This is required because the CSRF token is stored in cookies.
import cookieParser from "cookie-parser";

const router = express.Router();

// Middleware
// Parses cookies in incoming requests so that the CSRF token (stored as a cookie) can be accessed.
router.use(cookieParser());
// Initializes the CSRF protection middleware and instructs it to store the CSRF token in a cookie.
const csrfProtection = csrf({ cookie: true });

// Route til at hente CSRF-token
// GET /csrf-token: Provides the CSRF token to the client.
// Ensures that this route itself is protected by CSRF.
router.get("/csrf-token", csrfProtection, (req, res) => {
  // req.csrfToken(): Generates a CSRF token that the frontend will use for protected requests.
  // The generated token is included in the response.
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// A protected endpoint that requires a valid CSRF token.
// csrfProtection Middleware. Validates the CSRF token sent by the client. If the token is missing or invalid, the request is blocked, and an error is returned
router.post("/protected-route", csrfProtection, (req, res) => {
  res.status(200).json({ message: "CSRF token validated and request successful!" });
});

export default router;

