import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// Verify JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const payload = await authService.verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user info to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Check if user has required role
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user has required permission
export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const hasPermission = await authService.hasPermission(
      req.user.id,
      resource,
      action
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: `${action}:${resource}`
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await authService.verifyToken(token);

      if (payload) {
        req.user = {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};