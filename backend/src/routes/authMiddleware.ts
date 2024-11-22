// src/routes/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token);

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err || !decoded) {
      console.log('Token decoding failed:', err);
      res.status(403).json({ error: 'Forbidden: Invalid token' });
      return;
    }

    console.log('Decoded token:', decoded);
    (req as Request & { user?: any }).user = decoded;

    next();
  });
};


export default authenticateJWT;
