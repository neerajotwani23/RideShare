import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { tokenManager } from '../services/tokenManager';
import { GoogleSignInService } from '../services/googleSignInService';

interface AuthContextType {
  isAuthenticated: boolean;
  roleSelected: boolean;
  profileSetupComplete: boolean;
  vehicleDetailsComplete: boolean;
  currentRole: 'driver' | 'passenger' | null;
  selectedRoleForSignup: 'driver' | 'passenger' | null;
  user: any;
  isLoading: boolean;
  isProcessing: boolean;
  pendingSignupData: any;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<any>;
  loginWithGoogle: () => Promise<void>;
  signupWithGoogle: (role: 'driver' | 'passenger') => Promise<any>;
  selectRole: (role: 'driver' | 'passenger') => void;
  selectRoleForSignup: (role: 'driver' | 'passenger') => void;
  storePendingSignupData: (data: any) => void;
  completeSignup: (role: 'driver' | 'passenger') => Promise<any>;
  completeProfileSetup: () => void;
  completeVehicleDetails: () => void;
  skipProfileSetup: () => void;
  isFirstTimeUser: () => boolean;
  updateCurrentRole: (role: 'driver' | 'passenger') => void;
  logout: () => Promise<void>;
  setProcessing: (processing: boolean) => void;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        const isAuth = await tokenManager.isAuthenticated();
        const userData = await AsyncStorage.getItem('user');
        const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
        
        if (isAuth && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setCurrentRole(parsedUser.user_type);
          setRoleSelected(true);
          
          // Check profile setup completion based on actual user data
          // Profile is complete if user has bio OR profile picture
          const hasBio = !!(parsedUser.bio && parsedUser.bio.trim());
          const hasProfilePicture = !!(parsedUser.profile_picture && parsedUser.profile_picture.trim());
          const isProfileComplete = hasBio || hasProfilePicture;
          
          // Vehicle details completion
          const isVehicleComplete = vehicleDetails === 'true';
          
          setProfileSetupComplete(isProfileComplete);
          setVehicleDetailsComplete(isVehicleComplete);
        } else {
          // Clear any stale data
          setIsAuthenticated(false);
          setRoleSelected(false);
          setProfileSetupComplete(false);
          setVehicleDetailsComplete(false);
          setCurrentRole(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load auth state', error);
        // Clear state on error
        setIsAuthenticated(false);
        setRoleSelected(false);
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        setCurrentRole(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (credentials: any) => {
    console.log('🔐 Starting login process...');
    setIsLoading(true);
    setIsProcessing(true);
    try {
      const data = await api.login(credentials);
      console.log('✅ Login successful, user data:', data.user);
      
      // Tokens are already stored by the API service
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      setCurrentRole(data.user.user_type);
      setRoleSelected(true);
      
      // Check if user has completed onboarding based on actual data
      const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
      
      // Profile is complete if user has bio OR profile picture
      const hasBio = !!(data.user.bio && data.user.bio.trim());
      const hasProfilePicture = !!(data.user.profile_picture && data.user.profile_picture.trim());
      const isProfileComplete = hasBio || hasProfilePicture;
      
      // Vehicle details completion
      const isVehicleComplete = vehicleDetails === 'true';
      
      console.log('📊 User state:', {
        hasBio,
        hasProfilePicture,
        isProfileComplete,
        isVehicleComplete,
        userType: data.user.user_type
      });
      
      setProfileSetupComplete(isProfileComplete);
      setVehicleDetailsComplete(isVehicleComplete);
      
      // Keep processing state true for a moment to show processing screen
      setTimeout(() => {
        console.log('🔄 Setting processing to false');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Login failed:', error);
      setIsProcessing(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      const data = await api.register(userData);
      
      // For new users, set up initial state
      if (data.user) {
        // New users need to complete profile setup
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        
        // Explicitly mark new users as needing profile setup
        await AsyncStorage.setItem('profileSetupComplete', 'false');
        await AsyncStorage.removeItem('vehicleDetailsComplete');
      }
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setIsProcessing(true);
    try {
      const data = await GoogleSignInService.loginWithGoogle();
      
      // Store user data
      if (data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        setCurrentRole(data.user.user_type);
        setRoleSelected(true);
        
        // Check if user has completed onboarding based on actual data
        const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
        
        // Profile is complete if user has bio OR profile picture
        const hasBio = !!(data.user.bio && data.user.bio.trim());
        const hasProfilePicture = !!(data.user.profile_picture && data.user.profile_picture.trim());
        const isProfileComplete = hasBio || hasProfilePicture;
        
        // Vehicle details completion
        const isVehicleComplete = vehicleDetails === 'true';
        
        setProfileSetupComplete(isProfileComplete);
        setVehicleDetailsComplete(isVehicleComplete);
      }
      
      // Keep processing state true for a moment to show processing screen
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGoogle = async (role: 'driver' | 'passenger') => {
    setIsLoading(true);
    try {
      const data = await GoogleSignInService.signUpWithGoogle(role);
      
      // For new users, set up initial state
      if (data.user) {
        // New users need to complete profile setup
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        
        // Explicitly mark new users as needing profile setup
        await AsyncStorage.setItem('profileSetupComplete', 'false');
        await AsyncStorage.removeItem('vehicleDetailsComplete');
      }
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = async (role: 'driver' | 'passenger') => {
    setRoleSelected(true);
    setCurrentRole(role);
    
    // New role selection - reset completion status
    setProfileSetupComplete(false);
    setVehicleDetailsComplete(false);
    
    // Clear vehicle details flag for new role
    await AsyncStorage.removeItem('vehicleDetailsComplete');
  };

  const selectRoleForSignup = (role: 'driver' | 'passenger') => {
    setSelectedRoleForSignup(role);
  };

  const storePendingSignupData = (signupData: any) => {
    setPendingSignupData(signupData);
  };

  const completeSignup = async (role: 'driver' | 'passenger') => {
    if (!pendingSignupData) {
      throw new Error('No pending signup data found');
    }

    const userData = {
      ...(pendingSignupData as any),
      user_type: role.toUpperCase(),
    };

    try {
      const data = await signup(userData);
      setPendingSignupData(null);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const completeProfileSetup = async () => {
    setProfileSetupComplete(true);
    // No need to store flag since we check actual user data
  };

  const isFirstTimeUser = () => {
    // Check if this is a first-time user (needs profile setup)
    return !profileSetupComplete;
  };

  const completeVehicleDetails = async () => {
    setVehicleDetailsComplete(true);
    await AsyncStorage.setItem('vehicleDetailsComplete', 'true');
  };

  const skipProfileSetup = async () => {
    // Only passengers can skip profile setup
    if (currentRole === 'passenger') {
      setProfileSetupComplete(true);
      // No need to store flag since we check actual user data
    }
  };

  const updateCurrentRole = async (role: 'driver' | 'passenger') => {
    setCurrentRole(role);
    
    // Update user data in AsyncStorage with new role
    if (user) {
      const updatedUser = { ...user as any, user_type: role.toUpperCase() };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // If switching to driver, check if vehicle details are complete
    if (role === 'driver') {
      const vehicleDetails = await AsyncStorage.getItem('vehicleDetailsComplete');
      if (vehicleDetails !== 'true') {
        // Driver needs to complete vehicle details
        setVehicleDetailsComplete(false);
        await AsyncStorage.removeItem('vehicleDetailsComplete');
      }
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear tokens using token manager
      await tokenManager.clearTokens();
      
      // Clear other auth data
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
        setPendingSignupData(null);
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
      isProcessing,
      pendingSignupData,
      login, 
      signup, 
      loginWithGoogle,
      signupWithGoogle,
      selectRole,
      selectRoleForSignup,
      storePendingSignupData,
      completeSignup,
      completeProfileSetup,
      completeVehicleDetails,
      skipProfileSetup,
      isFirstTimeUser,
      updateCurrentRole,
      logout,
      setProcessing: setIsProcessing
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