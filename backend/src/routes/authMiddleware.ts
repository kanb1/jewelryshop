import { Request, Response, NextFunction } from 'express';
// JwtPayload --> represents the decoded payload of valid JWT
// VerifyErrors --> Errors that can occur when verifying a JWT
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************
// ************************SECURITY*************************// Opretter en session model for at spore aktive sessioner
import Session from "../models/Session"; 


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

interface CustomJwtPayload extends JwtPayload {
  jti?: string; // Tilføjer jti som en valgfri egenskab
}


// ********************************************************************************************** Middleware for authenticating JWT

// The authenticateJWT middleware verifies if a request has a valid JWT in the Authorization header
  // if valid --> allows the request to proceed

// next --> a function to pass control to the next middleware or route handler (middleware job is finished, ex validating a JWT token) (express)
const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  
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

  try {
    
    //  decoded --> The decoded payload if the token is valid.
    const decoded = await new Promise<CustomJwtPayload | undefined>((resolve, reject) => {
      // Verifies the JWT token's validity using the secret key --> Tjekker om token er gyldig og ike er blevet komprimeret
        // dekryptrer tokenents underskrift med den hemmelioge nøgle JWT secret --> Sammenligner underskriften emd payloadens data for at sirke at ingen har ædnret dataene
        // Signaturen er jo genereret vha en algoritme og en hemmelig nøgle, så den bruges til at verificere at serveren selv har genereret tokenet
      jwt.verify(token, JWT_SECRET, (err, payload) => {
        // Callback --> Invoked with errors during verification
        // If it's invalid or expired, or if decoded is undefined
        if (err || !payload) {
          console.log("Token verification failed:", err);
          reject(err || new Error("Invalid token"));
        } else {
          resolve(payload as CustomJwtPayload);
        }
      });
    });

    console.log("Decoded token:", decoded);

    // If valid --> Attach the decoded payload (e.g., userId, role, jti) to the request object, so we can use it in route handlers
    if (!decoded || !decoded.jti) {
      console.error("JTI missing in the token payload.");
      res.status(403).json({ error: "Session is invalid or expired" });
      return;
    }

    // **************SECURITY
    // Gemmer data fra tokenne i anmodningen, så det kan bruges i routes
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      jti: decoded.jti, 
    };

    console.log("Request user data attached to req.user:", req.user);

    // **************SECURITY
    // Sørger for at den tilknyttede session stadig er aktiv
    const sessionExists = await Session.findOne({ jti: decoded.jti });
    if (!sessionExists) {
      console.error("Session does not exist in the database.");
      res.status(403).json({ error: "Session is invalid or expired" });
      return;
    }

    // If the token is valid and req.user is populated, control passes to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error during token validation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
