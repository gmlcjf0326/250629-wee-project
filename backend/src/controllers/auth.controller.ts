import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { LoginRequest, RegisterRequest, EPKILoginRequest } from '../types/auth.types';

export const authController = {
  // Register new user
  async register(req: Request, res: Response) {
    try {
      const data: RegisterRequest = req.body;
      
      console.log('Registration attempt:', { 
        email: data.email, 
        hasPassword: !!data.password,
        passwordLength: data.password?.length,
        fullName: data.fullName,
        phone: data.phone,
        organization: data.organization,
        position: data.position,
        purpose: data.purpose
      });

      // Validate required fields
      if (!data.email || !data.password || !data.fullName) {
        console.error('Missing required fields:', { 
          hasEmail: !!data.email, 
          hasPassword: !!data.password, 
          hasFullName: !!data.fullName 
        });
        return res.status(400).json({
          success: false,
          message: 'Email, password, and full name are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Validate password strength
      if (data.password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      const result = await authService.register(data);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('already registered') ||
          error.message?.includes('Email already registered') ||
          error.message?.includes('duplicate key') ||
          error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  },

  // Login with email and password
  async login(req: Request, res: Response) {
    try {
      const data: LoginRequest = req.body;

      // Validate required fields
      if (!data.email || !data.password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(data);

      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      return res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message?.includes('Invalid login credentials')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  },

  // Login with EPKI certificate
  async loginWithEPKI(req: Request, res: Response) {
    try {
      const data: EPKILoginRequest = req.body;

      // Validate required fields
      if (!data.certData || !data.signature) {
        return res.status(400).json({
          success: false,
          message: 'Certificate data and signature are required'
        });
      }

      const result = await authService.loginWithEPKI(data);

      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Invalid certificate'
        });
      }

      return res.json({
        success: true,
        message: 'EPKI login successful',
        data: result
      });
    } catch (error: any) {
      console.error('EPKI login error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'EPKI login failed'
      });
    }
  },

  // Logout
  async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.substring(7);
      
      if (req.user && token) {
        await authService.logout(req.user.id, token);
      }

      return res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      console.error('Logout error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Logout failed'
      });
    }
  },

  // Get current user profile
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const user = await authService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: user
      });
    } catch (error: any) {
      console.error('Get profile error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  },

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      const { fullName, phone, organization, department, position } = req.body;

      // Update user profile in database
      const updatedUser = await authService.updateProfile(req.user.id, {
        fullName,
        phone,
        organization,
        department,
        position
      });

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile'
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error: any) {
      console.error('Update profile error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  },

  // Verify token
  async verifyToken(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const user = await authService.getUserById(req.user.id);

      return res.json({
        success: true,
        data: {
          valid: true,
          user
        }
      });
    } catch (error: any) {
      console.error('Verify token error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Token verification failed'
      });
    }
  },

  // Check email availability
  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.query;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const isAvailable = await authService.checkEmailAvailability(email);

      return res.json({
        success: true,
        data: {
          available: isAvailable,
          message: isAvailable ? 'Email is available' : 'Email is already registered'
        }
      });
    } catch (error: any) {
      console.error('Check email error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check email availability'
      });
    }
  }
};