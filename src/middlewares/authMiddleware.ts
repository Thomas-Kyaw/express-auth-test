import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface UserPayload {
  id: string;
  role: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // can define a more specific type here if needed
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const roleMiddleware = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== requiredRole) {
    res.status(403).json({ message: 'Access forbidden' });
    return;
  }
  next();
};
