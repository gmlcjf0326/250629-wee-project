import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  organization?: string;
  position?: string;
  purpose?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const result = await authAPI.verifyToken();
      if (result.valid && result.user) {
        setUser(result.user);
      } else {
        localStorage.removeItem('accessToken');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authAPI.login({ email, password });
      localStorage.setItem('accessToken', result.accessToken);
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };


  const register = async (data: RegisterData) => {
    try {
      const result = await authAPI.register(data);
      localStorage.setItem('accessToken', result.accessToken);
      setUser(result.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      await authAPI.updateProfile(data);
      const updatedUser = await authAPI.getProfile();
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};