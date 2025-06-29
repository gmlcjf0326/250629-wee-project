import apiClient from './client';
import { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EPKILoginRequest {
  certData: string;
  signature: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  organization?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  // Login with email and password
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },

  // Login with EPKI certificate
  loginWithEPKI: async (data: EPKILoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login/epki', data);
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<void> => {
    await apiClient.put('/auth/profile', data);
  },

  // Verify token
  verifyToken: async (): Promise<{ valid: boolean; user?: User }> => {
    const response = await apiClient.get('/auth/verify');
    return response.data.data;
  },
};