import { Request, Response, NextFunction } from 'express';

export function checkPermission(requiredPermission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      // Get user permissions from Supabase
      const { data: userPermissions, error } = await req.supabase
        .from('user_permissions_view')
        .select('permission_name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to check permissions' 
        });
      }

      const permissions = userPermissions?.map(p => p.permission_name) || [];
      
      // Check if user has required permission or is admin
      const hasPermission = permissions.includes(requiredPermission) || 
                           permissions.includes('admin') ||
                           permissions.includes('manage_all');

      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }

      return next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Permission check failed' 
      });
    }
  };
}

// Common permission sets
export const Permissions = {
  MANAGE_CONTENT: 'manage_content',
  MANAGE_USERS: 'manage_users',
  MANAGE_SURVEYS: 'manage_surveys',
  VIEW_ANALYTICS: 'view_analytics',
  ADMIN: 'admin',
} as const;