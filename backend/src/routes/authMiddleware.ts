import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// Middleware for authenticating JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded) {
        console.log('Token decoding failed:', err);
        res.status(403).json({ error: 'Forbidden: Invalid token' });
        return;
      }

      console.log('Decoded token:', decoded);
      // Attach user information to the request object (if it's a JwtPayload)
      if (typeof decoded === 'object' && decoded !== null) {
        (req as Request & { user?: JwtPayload }).user = decoded;
      }

      next();
    }
  );
};

// Middleware for admin authorization
export const adminMiddleware = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  next();
};

export default authenticateJWT;
