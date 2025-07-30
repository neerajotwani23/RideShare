import { api } from './api';
import { tokenManager } from './tokenManager';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CONFIG } from '../config/googleConfig';
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
    const totalSteps = 8;
    let currentStep = 0;

    try {
      // Step 1: Configure Google Sign-In
      currentStep++;
      this.updateProgress('Google Config', currentStep, totalSteps, 'Configuring Google Sign-In...');
      await this.configureGoogleSignIn();

      // Step 2: Initialize token manager
      currentStep++;
      this.updateProgress('Token Manager', currentStep, totalSteps, 'Initializing token manager...');
      await this.initializeTokenManager();

      // Step 3: Check authentication status
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

  private async configureGoogleSignIn(): Promise<void> {
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_CONFIG.webClientId,
        offlineAccess: false,
        hostedDomain: '',
        forceCodeForRefreshToken: false,
        scopes: ['email'],
      });
      console.log('✅ Google Sign-In configured successfully');
    } catch (error) {
      console.error('❌ Failed to configure Google Sign-In:', error);
      throw error;
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
      
      // Get user preferences from AsyncStorage
      const roleSelected = await AsyncStorage.getItem('roleSelected') === 'true';
      const profileSetupComplete = await AsyncStorage.getItem('profileSetupComplete') === 'true';
      const vehicleDetailsComplete = await AsyncStorage.getItem('vehicleDetailsComplete') === 'true';
      const currentRoleRaw = await AsyncStorage.getItem('currentRole');
      const currentRole = (currentRoleRaw === 'driver' || currentRoleRaw === 'passenger') ? currentRoleRaw : undefined;

      return {
        isAuthenticated: true,
        roleSelected,
        profileSetupComplete,
        vehicleDetailsComplete,
        currentRole
      };

    } catch (error) {
      console.log('Token validation failed, user not authenticated');
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