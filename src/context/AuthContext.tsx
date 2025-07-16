import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  roleSelected: boolean;
  profileSetupComplete: boolean;
  vehicleDetailsComplete: boolean;
  currentRole: 'driver' | 'passenger' | null;
  selectedRoleForSignup: 'driver' | 'passenger' | null;
  user: any;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<any>;
  selectRole: (role: 'driver' | 'passenger') => void;
  selectRoleForSignup: (role: 'driver' | 'passenger') => void;
  completeProfileSetup: () => void;
  completeVehicleDetails: () => void;
  skipProfileSetup: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [vehicleDetailsComplete, setVehicleDetailsComplete] = useState(false);
  const [currentRole, setCurrentRole] = useState<'driver' | 'passenger' | null>(null);
  const [selectedRoleForSignup, setSelectedRoleForSignup] = useState<'driver' | 'passenger' | null>(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('user');
        const profileSetup = await AsyncStorage.getItem('profileSetupComplete');
        const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setCurrentRole(parsedUser.user_type);
          setRoleSelected(true);
          setProfileSetupComplete(profileSetup === 'true');
          setVehicleDetailsComplete(vehicleDetails === 'true');
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
      
      // Check if user has completed onboarding
      const profileSetup = await AsyncStorage.getItem('profileSetupComplete');
      const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
      setProfileSetupComplete(profileSetup === 'true');
      setVehicleDetailsComplete(vehicleDetails === 'true');
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
    setVehicleDetailsComplete(false);
  };

  const selectRoleForSignup = (role: 'driver' | 'passenger') => {
    setSelectedRoleForSignup(role);
  };

  const completeProfileSetup = async () => {
    setProfileSetupComplete(true);
    await AsyncStorage.setItem('profileSetupComplete', 'true');
  };

  const completeVehicleDetails = async () => {
    setVehicleDetailsComplete(true);
    await AsyncStorage.setItem('vehicleDetailsComplete', 'true');
  };

  const skipProfileSetup = async () => {
    // Only passengers can skip profile setup
    if (currentRole === 'passenger') {
      setProfileSetupComplete(true);
      await AsyncStorage.setItem('profileSetupComplete', 'true');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('profileSetupComplete');
      await AsyncStorage.removeItem('vehicleDetailsComplete');
    } catch (error) {
        console.error('Failed to logout', error);
    }
    finally {
        setIsAuthenticated(false);
        setRoleSelected(false);
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        setCurrentRole(null);
        setSelectedRoleForSignup(null);
        setUser(null);
        setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      roleSelected, 
      profileSetupComplete,
      vehicleDetailsComplete,
      currentRole,
      selectedRoleForSignup,
      user,
      isLoading,
      login, 
      signup, 
      selectRole,
      selectRoleForSignup,
      completeProfileSetup,
      completeVehicleDetails,
      skipProfileSetup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 