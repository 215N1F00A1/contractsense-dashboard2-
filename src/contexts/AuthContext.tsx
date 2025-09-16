import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth_token');
        Cookies.remove('user_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in real app, this would call your backend
      if (username === 'demo@contract.ai' && password === 'demo123') {
        const mockUser: User = {
          id: 'user_123',
          username: 'demo@contract.ai',
          email: 'demo@contract.ai'
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        Cookies.set('auth_token', mockToken, { expires: 7 });
        Cookies.set('user_data', JSON.stringify(mockUser), { expires: 7 });
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Mock signup - in real app, this would call your backend
      const mockUser: User = {
        id: 'user_' + Date.now(),
        username,
        email
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      Cookies.set('auth_token', mockToken, { expires: 7 });
      Cookies.set('user_data', JSON.stringify(mockUser), { expires: 7 });
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};