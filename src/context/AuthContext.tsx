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
  recheckAuthState: () => Promise<void>;
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
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      setIsLoading(true);
      try {
        // Get all data from AsyncStorage first (fast, no network calls)
        const [isAuth, userData, vehicleDetails, profileSetupFlag, vehicleDetailsFlag] = await Promise.all([
          tokenManager.isAuthenticated(),
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('vehicleDetailsComplete'),
          AsyncStorage.getItem('profileSetupComplete'),
          AsyncStorage.getItem('vehicleDetailsComplete')
        ]);
        
        if (isAuth && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Convert user_type to lowercase to match app expectations
          const userType = parsedUser.user_type ? parsedUser.user_type.toLowerCase() : null;
          setCurrentRole(userType);
          setRoleSelected(true);
          
          console.log('🔐 Initial auth state:', {
            userType: parsedUser.user_type,
            convertedUserType: userType,
            isAuthenticated: true,
            roleSelected: true
          });
          
          // Check profile setup completion - prioritize AsyncStorage flags, then user data
          let isProfileComplete = false;
          if (profileSetupFlag === 'true') {
            isProfileComplete = true;
          } else {
            // Fallback to checking user data
          const hasBio = !!(parsedUser.bio && parsedUser.bio.trim());
          const hasProfilePicture = !!(parsedUser.profile_picture && parsedUser.profile_picture.trim());
            isProfileComplete = hasBio || hasProfilePicture;
            // Store the result for future use
            await AsyncStorage.setItem('profileSetupComplete', isProfileComplete.toString());
          }
          
          // Vehicle details completion - prioritize AsyncStorage flags, then user data
          let isVehicleComplete = false;
          if (parsedUser.user_type === 'DRIVER' || parsedUser.user_type === 'driver') {
            if (vehicleDetailsFlag === 'true') {
              isVehicleComplete = true;
            } else {
              // Check if user has driving license (from user data, no API call)
              const hasDrivingLicense = !!(parsedUser.driving_license && parsedUser.driving_license.trim());
              // For initial load, assume vehicle details are complete if they have license
              // This prevents showing vehicle details screen unnecessarily
              isVehicleComplete = hasDrivingLicense;
              await AsyncStorage.setItem('vehicleDetailsComplete', isVehicleComplete.toString());
            }
          } else {
            isVehicleComplete = true; // Passengers don't need vehicle details
          }
          
          setProfileSetupComplete(isProfileComplete);
          setVehicleDetailsComplete(isVehicleComplete);
          
          console.log('🚀 Auth state loaded from AsyncStorage:', {
            isAuthenticated: true,
            roleSelected: true,
            profileSetupComplete: isProfileComplete,
            vehicleDetailsComplete: isVehicleComplete,
            currentRole: parsedUser.user_type
          });
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
      
      // Store profile setup completion flag for future fast access
      await AsyncStorage.setItem('profileSetupComplete', isProfileComplete.toString());
      
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
        // Set authentication state
        setIsAuthenticated(true);
        setUser(data.user);
        setCurrentRole(data.user.user_type);
        setRoleSelected(true);
        
        // New users need to complete profile setup
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        
        // Store user data and flags
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
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
    } catch (error: any) {
      setIsProcessing(false);
      
      // Check if user requires signup completion
      if (error.message === 'USER_REQUIRES_SIGNUP') {
        // Store Google data for signup
        const googleUser = await GoogleSignInService.getCurrentUser();
        if (googleUser) {
          const googleData = {
            email: googleUser.email,
            google_id: googleUser.id,
            first_name: googleUser.givenName || '',
            last_name: googleUser.familyName || '',
            profile_picture: googleUser.photo,
            auth_provider: 'google'
          };
          setPendingSignupData(googleData);
        }
        throw new Error('USER_REQUIRES_SIGNUP');
      }
      
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
        // Set authentication state
        setIsAuthenticated(true);
        setUser(data.user);
        setCurrentRole(data.user.user_type);
        setRoleSelected(true);
        
        // New users need to complete profile setup
        setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
        
        // Store user data and flags
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
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

    console.log('🔍 CompleteSignup - Final user data being sent to API:');
    console.log('Gender value:', userData.gender);
    console.log('Gender type:', typeof userData.gender);
    console.log('Complete data:', userData);

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
    // Store flag for future fast access
    await AsyncStorage.setItem('profileSetupComplete', 'true');
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
      // Store flag for future fast access
      await AsyncStorage.setItem('profileSetupComplete', 'true');
    }
  };

  const updateCurrentRole = async (role: 'driver' | 'passenger') => {
    setCurrentRole(role);
    
    try {
      // Update user data with new role
    if (user) {
      const updatedUser = { ...user as any, user_type: role.toUpperCase() };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
    
    // If switching to driver, check vehicle details from stored data first
    if (role === 'driver') {
      const vehicleDetailsFlag = await AsyncStorage.getItem('vehicleDetailsComplete');
      
      if (vehicleDetailsFlag === 'true') {
        // Already marked as complete, use stored flag
        setVehicleDetailsComplete(true);
      } else if (user) {
        // Check if user has driving license from stored user data
        const hasDrivingLicense = !!(user && (user as any).driving_license && (user as any).driving_license.trim());
        
        if (hasDrivingLicense) {
          // Assume vehicle details are complete if they have license
          // This prevents unnecessary API calls and screen flashing
          setVehicleDetailsComplete(true);
          await AsyncStorage.setItem('vehicleDetailsComplete', 'true');
        } else {
          setVehicleDetailsComplete(false);
        }
      } else {
        setVehicleDetailsComplete(false);
      }
    } else {
      // Switching to passenger - vehicle details not needed
      setVehicleDetailsComplete(true);
    }
  };

  const recheckAuthState = async () => {
    setIsLoading(true);
    try {
      // Get all data from AsyncStorage first (fast, no network calls)
      const [isAuth, userData, vehicleDetails, profileSetupFlag, vehicleDetailsFlag] = await Promise.all([
        tokenManager.isAuthenticated(),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('vehicleDetailsComplete'),
        AsyncStorage.getItem('profileSetupComplete'),
        AsyncStorage.getItem('vehicleDetailsComplete')
      ]);
      
      if (isAuth && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Convert user_type to lowercase to match app expectations
        const userType = parsedUser.user_type ? parsedUser.user_type.toLowerCase() : null;
        setCurrentRole(userType);
        setRoleSelected(true);
        
        console.log('🔄 Setting auth state:', {
          userType: parsedUser.user_type,
          convertedUserType: userType,
          isAuthenticated: true,
          roleSelected: true
        });
        
        // Check profile setup completion - prioritize AsyncStorage flags, then user data
        let isProfileComplete = false;
        if (profileSetupFlag === 'true') {
          isProfileComplete = true;
        } else {
          // Fallback to checking user data
          const hasBio = !!(parsedUser.bio && parsedUser.bio.trim());
          const hasProfilePicture = !!(parsedUser.profile_picture && parsedUser.profile_picture.trim());
          isProfileComplete = hasBio || hasProfilePicture;
          // Store the result for future use
          await AsyncStorage.setItem('profileSetupComplete', isProfileComplete.toString());
        }
        
        // Vehicle details completion - prioritize AsyncStorage flags, then user data
        let isVehicleComplete = false;
        if (parsedUser.user_type === 'DRIVER' || parsedUser.user_type === 'driver') {
          if (vehicleDetailsFlag === 'true') {
            isVehicleComplete = true;
          } else {
            // Check if user has driving license (from user data, no API call)
            const hasDrivingLicense = !!(parsedUser.driving_license && parsedUser.driving_license.trim());
            // For initial load, assume vehicle details are complete if they have license
            // This prevents showing vehicle details screen unnecessarily
            isVehicleComplete = hasDrivingLicense;
            await AsyncStorage.setItem('vehicleDetailsComplete', isVehicleComplete.toString());
          }
        } else {
          isVehicleComplete = true; // Passengers don't need vehicle details
        }
        
        setProfileSetupComplete(isProfileComplete);
        setVehicleDetailsComplete(isVehicleComplete);
        
        console.log('🔄 Auth state rechecked from AsyncStorage:', {
          isAuthenticated: true,
          roleSelected: true,
          profileSetupComplete: isProfileComplete,
          vehicleDetailsComplete: isVehicleComplete,
          currentRole: parsedUser.user_type
        });
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
      console.error('Failed to recheck auth state', error);
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

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('🚪 Starting logout process...');
      
      // Clear tokens using token manager
      await tokenManager.clearTokens();
      
      // Clear all auth-related data
      await AsyncStorage.multiRemove([
        'user',
        'profileSetupComplete',
        'vehicleDetailsComplete',
        'postRide_state', // Clear PostRide screen state
        'authToken',
        'refreshToken'
      ]);
      
      // Clear all AsyncStorage for complete reset
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter(key => 
        key.startsWith('postRide_') || 
        key.startsWith('auth') || 
        key.includes('token') ||
        key.includes('user') ||
        key.includes('profile') ||
        key.includes('vehicle')
      );
      
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
        console.log('🗑️ Cleared auth keys:', authKeys);
      }
      
      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Failed to logout:', error);
    } finally {
      // Reset all auth state
    setIsAuthenticated(false);
    setRoleSelected(false);
    setProfileSetupComplete(false);
        setVehicleDetailsComplete(false);
    setCurrentRole(null);
        setSelectedRoleForSignup(null);
    setUser(null);
        setPendingSignupData(null);
        setIsLoading(false);
      
      console.log('🔄 Auth state reset completed');
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
      recheckAuthState,
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