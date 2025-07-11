import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  roleSelected: boolean;
  profileSetupComplete: boolean;
  currentRole: 'driver' | 'passenger' | null;
  user: any;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<any>;
  selectRole: (role: 'driver' | 'passenger') => void;
  completeProfileSetup: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [currentRole, setCurrentRole] = useState<'driver' | 'passenger' | null>(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('user');
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Assuming role selection and profile setup are stored or derived
          setCurrentRole(parsedUser.user_type);
          setRoleSelected(!!parsedUser.user_type);
          // This might need more specific logic based on your app's flow
          setProfileSetupComplete(true); 
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const data = await api.login(credentials);
      await AsyncStorage.setItem('accessToken', data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      setCurrentRole(data.user.user_type);
      setRoleSelected(true);
      // Logic to determine if profile setup is complete should be added here
      setProfileSetupComplete(true); // Placeholder
    } catch (error) {
      logout()
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const data = await api.register(userData);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (role: 'driver' | 'passenger') => {
    setRoleSelected(true);
    setCurrentRole(role);
    setProfileSetupComplete(false);
  };

  const completeProfileSetup = () => {
    setProfileSetupComplete(true);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
        console.error('Failed to logout', error);
    }
    finally {
        setIsAuthenticated(false);
        setRoleSelected(false);
        setProfileSetupComplete(false);
        setCurrentRole(null);
        setUser(null);
        setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      roleSelected, 
      profileSetupComplete,
      currentRole,
      user,
      isLoading,
      login, 
      signup, 
      selectRole,
      completeProfileSetup,
      logout
    }}>
      {children}
      
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 