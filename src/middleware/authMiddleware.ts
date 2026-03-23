import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      isAuthenticated?: boolean;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any)?.userId;

  if (!userId) {
    req.isAuthenticated = false;
    return res.status(401).json({ error: 'Unauthorized. Please login first.' });
  }

  req.userId = userId;
  req.isAuthenticated = true;
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any)?.userId;
  if (userId) {
    req.userId = userId;
    req.isAuthenticated = true;
  }
  next();
}
