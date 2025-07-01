import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import { validateRegister, validateLogin, validateProfileUpdate } from '../middleware/validation';

const router = Router();

// Public routes (with rate limiting and validation)
router.post('/register', authLimiter, ...validateRegister, authController.register);
router.post('/login', authLimiter, ...validateLogin, authController.login);
router.post('/login/epki', authLimiter, authController.loginWithEPKI);
router.get('/check-email', authController.checkEmail);

// Test endpoint to check if user exists
router.get('/test-users', async (req, res) => {
  try {
    const { supabaseAdmin } = require('../config/supabase');
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const { data: dbUsers } = await supabaseAdmin.from('users').select('*');
    
    res.json({
      authUsers: authUsers?.users?.map(u => ({ id: u.id, email: u.email })),
      dbUsers: dbUsers
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, ...validateProfileUpdate, authController.updateProfile);
router.get('/verify', authenticate, authController.verifyToken);

export default router;