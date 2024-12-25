import { Request, Response, NextFunction } from 'express';
// JwtPayload --> represents the decoded payload of valid JWT
// VerifyErrors --> Errors that can occur when verifying a JWT
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// The environment variable that holds the secret key used to sign and verify JWT's --> makes sure only my server can generate valid JWT's
// Ensure the environment variable exists at runtime
// This prevents the application from starting if the JWT_SECRET is missing, making it safer and more predictable.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment. Check your .env file.");
}

require("dotenv").config();

// Extending the Request interface locally
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { userId: string; username: string; role?: string };
}


// ********************************************************************************************** Middleware for authenticating JWT

// The authenticateJWT middleware verifies if a request has a valid JWT in the Authorization header
  // if valid --> allows the request to proceed

// next --> a function to pass control to the next middleware or route handler (middleware job is finished, ex validating a JWT token) (express)
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Reads the authorization header
  // Removes the "Bearer" prefix to get the raw token
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Token received in middleware:", token);

  // if token is missing --> respons with 401 unauthorized
  if (!token) {
    console.error("No token provided in the request.");
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  // verifies the JWT token's validity using the secret key
  //  decoded --> The decoded payload if the token is valid.
  jwt.verify(
    token,
    JWT_SECRET,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      // callback --> Invoked with errors during verification
      // if it's invalid or expired, or if decoded is undefined
      if (err || !decoded) {
        console.log("Token verification failed:", err);
        res.status(403).json({ error: 'Forbidden: Invalid token' });
        return;
      }

      console.log('Decoded token:', decoded);
      // If valid --> Attach the decoded payload (eg userId or role) to the request object, so we can use it in route handlers

      // Ensures the decoded payload is an object (e.g., { userId: '12345', role: 'user' }).
      // Decoded JWTs can sometimes be strings, so this check ensures it's safe to use.
      // Attaches the decoded payload (e.g., userId and role) to req.user.
      // Extends the req object with custom properties (user) for subsequent middlewares or route handlers.
      if (typeof decoded === 'object' && decoded !== null) {
        req.user = {
          userId: decoded.userId, // Assuming this exists in your JWT payload
          username: decoded.username, // Assuming this exists in your JWT payload
          role: decoded.role, // Optional
        };
      }

      console.log("Request user data attached to req.user:", req.user);


      // If the token is valid and req.user is populated, control passes to the next middleware or route handler.
      next();
    }
  );
};


// ********************************************************************************************** Middleware for admin authorization

// Restricts access to admin-only routes.

export const adminMiddleware = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void => {
  // If req.user is missing, meaning the user is not authenticated.
  // If the role in req.user is not "admin", meaning the user does not have admin privileges.
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  next();
};

export default authenticateJWT;
