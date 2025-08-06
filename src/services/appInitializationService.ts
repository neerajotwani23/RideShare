import { api } from './api';
import { tokenManager } from './tokenManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InitializationProgress {
  step: string;
  progress: number;
  total: number;
  message: string;
}

export interface InitializationResult {
  success: boolean;
  error?: string;
  userData?: any;
  isAuthenticated: boolean;
  roleSelected: boolean;
  profileSetupComplete: boolean;
  vehicleDetailsComplete: boolean;
  currentRole?: 'driver' | 'passenger';
}

class AppInitializationService {
  private progressCallback?: (progress: InitializationProgress) => void;

  setProgressCallback(callback: (progress: InitializationProgress) => void) {
    this.progressCallback = callback;
  }

  private updateProgress(step: string, current: number, total: number, message: string) {
    if (this.progressCallback) {
      this.progressCallback({
        step,
        progress: current,
        total,
        message
      });
    }
    console.log(`🚀 [${step}] ${message} (${current}/${total})`);
  }

  async initializeApp(): Promise<InitializationResult> {
    const totalSteps = 7;
    let currentStep = 0;

    try {
      // Note: Google Sign-In is configured automatically by googleSignInService
      
      // Step 1: Initialize token manager
      currentStep++;
      this.updateProgress('Token Manager', currentStep, totalSteps, 'Initializing token manager...');
      await this.initializeTokenManager();

      // Step 2: Check authentication status
      currentStep++;
      this.updateProgress('Auth Check', currentStep, totalSteps, 'Checking authentication status...');
      const authStatus = await this.checkAuthenticationStatus();

      if (!authStatus.isAuthenticated) {
        // If not authenticated, skip to final step
        currentStep = totalSteps;
        this.updateProgress('Complete', currentStep, totalSteps, 'Initialization complete - User not authenticated');
        return {
          success: true,
          isAuthenticated: false,
          roleSelected: false,
          profileSetupComplete: false,
          vehicleDetailsComplete: false
        };
      }

      // Step 4: Health check API
      currentStep++;
      this.updateProgress('API Health', currentStep, totalSteps, 'Checking API connectivity...');
      await this.performHealthCheck();

      // Step 5: Load user profile
      currentStep++;
      this.updateProgress('User Profile', currentStep, totalSteps, 'Loading user profile...');
      const userData = await this.loadUserProfile();

      // Step 6: Load user preferences and settings
      currentStep++;
      this.updateProgress('User Settings', currentStep, totalSteps, 'Loading user settings...');
      await this.loadUserSettings();

      // Step 7: Preload essential data based on user role
      currentStep++;
      this.updateProgress('Data Preload', currentStep, totalSteps, 'Preloading essential data...');
      await this.preloadEssentialData(authStatus.currentRole);

      // Step 8: Finalize initialization
      currentStep++;
      this.updateProgress('Complete', currentStep, totalSteps, 'Initialization complete');

      return {
        success: true,
        userData,
        isAuthenticated: authStatus.isAuthenticated,
        roleSelected: authStatus.roleSelected,
        profileSetupComplete: authStatus.profileSetupComplete,
        vehicleDetailsComplete: authStatus.vehicleDetailsComplete,
        currentRole: authStatus.currentRole
      };

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown initialization error',
        isAuthenticated: false,
        roleSelected: false,
        profileSetupComplete: false,
        vehicleDetailsComplete: false
      };
    }
  }



  private async initializeTokenManager(): Promise<void> {
    try {
      // Check if user is authenticated to validate token manager
      const isAuth = await tokenManager.isAuthenticated();
      console.log('✅ Token manager initialized, auth status:', isAuth);
    } catch (error) {
      console.error('❌ Failed to initialize token manager:', error);
      throw error;
    }
  }

  private async checkAuthenticationStatus(): Promise<{
    isAuthenticated: boolean;
    roleSelected: boolean;
    profileSetupComplete: boolean;
    vehicleDetailsComplete: boolean;
    currentRole?: 'driver' | 'passenger';
  }> {
    try {
      const accessToken = await tokenManager.getAccessToken();
      
      if (!accessToken) {
        return {
          isAuthenticated: false,
          roleSelected: false,
          profileSetupComplete: false,
          vehicleDetailsComplete: false
        };
      }

      // Try to get current user to validate token
      const userData = await api.getCurrentUser();
      
      // Get user data from AsyncStorage (same as AuthContext)
      const userString = await AsyncStorage.getItem('user');
      
      if (!userString) {
        return {
          isAuthenticated: false,
          roleSelected: false,
          profileSetupComplete: false,
          vehicleDetailsComplete: false
        };
      }

      const user = JSON.parse(userString);
      const currentRole = user.user_type?.toLowerCase() as 'driver' | 'passenger';
      
      // Check if role is selected (user has a valid role)
      const roleSelected = !!currentRole && (currentRole === 'driver' || currentRole === 'passenger');
      
      // Profile is complete if user has bio OR profile picture (same logic as AuthContext)
      const hasBio = !!(user.bio && user.bio.trim());
      const hasProfilePicture = !!(user.profile_picture && user.profile_picture.trim());
      const profileSetupComplete = hasBio || hasProfilePicture;

      // Check vehicle details completion (same logic as AuthContext)
      let vehicleDetailsComplete = true; // Default to true for non-drivers
      if (currentRole === 'driver') {
        // Check if user has driving license
        const hasDrivingLicense = !!(user.driving_license && user.driving_license.trim());
        
        // Check if user has vehicles with essential details
        let hasCompleteVehicle = false;
        try {
          const vehicles = await api.getMyVehicles();
          if (vehicles && vehicles.length > 0) {
            const vehicle = vehicles[0]; // Check the first vehicle
            const hasMake = !!(vehicle.name_make && vehicle.name_make.trim());
            const hasPlate = !!(vehicle.no_plate && vehicle.no_plate.trim());
            hasCompleteVehicle = hasMake && hasPlate;
          }
        } catch (error) {
          console.log('Could not fetch vehicles, assuming incomplete:', error);
        }

        vehicleDetailsComplete = hasDrivingLicense && hasCompleteVehicle;
      }

      console.log('🔍 Auth status check:', {
        isAuthenticated: true,
        roleSelected,
        profileSetupComplete,
        vehicleDetailsComplete,
        currentRole,
        hasBio,
        hasProfilePicture,
        hasDrivingLicense: currentRole === 'driver' ? !!(user.driving_license && user.driving_license.trim()) : 'N/A',
        hasCompleteVehicle: currentRole === 'driver' ? 'checked' : 'N/A'
      });

      return {
        isAuthenticated: true,
        roleSelected,
        profileSetupComplete,
        vehicleDetailsComplete,
        currentRole
      };
    } catch (error) {
      console.error('❌ Failed to check authentication status:', error);
      return {
        isAuthenticated: false,
        roleSelected: false,
        profileSetupComplete: false,
        vehicleDetailsComplete: false
      };
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      await api.healthCheck();
      console.log('✅ API health check passed');
    } catch (error) {
      console.error('❌ API health check failed:', error);
      throw new Error('API server is not reachable');
    }
  }

  private async loadUserProfile(): Promise<any> {
    try {
      const profile = await api.getProfile();
      console.log('✅ User profile loaded');
      return profile;
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
      throw error;
    }
  }

  private async loadUserSettings(): Promise<void> {
    try {
      // Load any user-specific settings or preferences
      // This could include theme preferences, notification settings, etc.
      console.log('✅ User settings loaded');
    } catch (error) {
      console.error('❌ Failed to load user settings:', error);
      // Don't throw error for settings, as they're not critical
    }
  }

  private async preloadEssentialData(role?: 'driver' | 'passenger'): Promise<void> {
    try {
      if (role === 'driver') {
        // Preload driver-specific data
        await api.getMyVehicles();
        console.log('✅ Driver vehicles preloaded');
      }
      
      // Preload common data for both roles
      await api.getMyRides();
      console.log('✅ User rides preloaded');
      
      await api.getWalletBalance();
      console.log('✅ Wallet balance preloaded');
      
    } catch (error) {
      console.error('❌ Failed to preload essential data:', error);
      // Don't throw error for preloading, as it's not critical for app startup
    }
  }

  // Method to clear all cached data (useful for logout)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      await tokenManager.clearTokens();
      console.log('✅ All app data cleared');
    } catch (error) {
      console.error('❌ Failed to clear app data:', error);
      throw error;
    }
  }
}

export const appInitializationService = new AppInitializationService(); 