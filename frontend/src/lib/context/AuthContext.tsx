import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import { clearApolloCache } from '../apollo/client';

// User type based on your GraphQL schema
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
};

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterInput) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  // Query to get current user if token exists
  const { data: userData, loading: userLoading } = useQuery(GET_ME, {
    skip: !localStorage.getItem('token'), // Only run if token exists
    onCompleted: (data) => {
      if (data.me) {
        setUser(data.me);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Failed to get user:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
      setIsLoading(false);
    },
    errorPolicy: 'all'
  });

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
    }
    // If token exists, the GET_ME query will handle loading the user
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data } = await loginMutation({
        variables: {
          input: { email, password }
        }
      });

      if (data?.login) {
        const { token, user: loggedInUser } = data.login;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set user in state
        setUser(loggedInUser);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsLoading(false);
      
      // Extract meaningful error message from GraphQL error
      const errorMessage = error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterInput): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data } = await registerMutation({
        variables: {
          input: userData
        }
      });

      if (data?.register) {
        const { token, user: registeredUser } = data.register;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set user in state
        setUser(registeredUser);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      
      // Extract meaningful error message from GraphQL error
      const errorMessage = error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user state
    setUser(null);
    
    // Clear Apollo cache to remove all cached data
    clearApolloCache();
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    isLoading: isLoading || userLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};