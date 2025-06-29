import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Consumer, Vendor } from '@/types/user';
import { useLocation } from '@/contexts/LocationContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string, role: 'consumer' | 'vendor') => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isConsumer: () => boolean;
  isVendor: () => boolean;
}

interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'consumer' | 'vendor';
  businessInfo?: {
    businessName: string;
    category: string;
    description: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Simulate checking stored auth state
      const storedUser = localStorage.getItem('hawky_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string, role: 'consumer' | 'vendor') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName: role === 'consumer' ? 'Arjun Patel' : 'Rajesh Kumar',
        phone: '+91 98765 43210',
        role,
        avatar: role === 'consumer' 
          ? 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg'
          : 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: null, // Will be updated when location is available
      };

      setUser(mockUser);
      localStorage.setItem('hawky_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: null, // Will be updated when location is available
      };

      setUser(newUser);
      localStorage.setItem('hawky_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('hawky_user');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('hawky_user', JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error('Failed to update user');
    }
  };

  const isConsumer = () => user?.role === 'consumer';
  const isVendor = () => user?.role === 'vendor';

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    isConsumer,
    isVendor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}