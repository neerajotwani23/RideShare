import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { api } from './api';
import { GOOGLE_CONFIG } from '../config/googleConfig';

// Configure Google Sign-In with better error handling
console.log('🔧 Configuring Google Sign-In...');
console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);

let isConfigured = false;

const configureGoogleSignIn = () => {
  if (isConfigured) {
    console.log('✅ Google Sign-In already configured');
    return;
  }
  
  try {
    // Check if webClientId is valid
    if (!GOOGLE_CONFIG.webClientId || GOOGLE_CONFIG.webClientId.includes('YOUR_')) {
      console.error('❌ Invalid Web Client ID:', GOOGLE_CONFIG.webClientId);
      return;
    }
    
    GoogleSignin.configure({
      webClientId: GOOGLE_CONFIG.webClientId,
      offlineAccess: false,
      hostedDomain: '',
      forceCodeForRefreshToken: false,
      scopes: ['email', 'profile'], // Add profile scope
    });
    isConfigured = true;
    console.log('✅ Google Sign-In configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure Google Sign-In:', error);
    // Don't throw error, just log it
  }
};

// Configure immediately
configureGoogleSignIn();

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
  familyName?: string;
  givenName?: string;
}

export class GoogleSignInService {
  /**
   * Check if Google Sign-In is properly configured
   */
  static isConfigured(): boolean {
    return isConfigured;
  }

  /**
   * Check if user is signed in
   */
  static async isSignedIn(): Promise<boolean> {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return !!userInfo;
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return false;
    }
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo) {
        console.log('Current Google user:', userInfo);
        
        const user = userInfo as any;
        return {
          id: user.user?.id || user.id || '',
          name: user.user?.name || user.name || '',
          email: user.user?.email || user.email || '',
          photo: user.user?.photo || user.photo || undefined,
          familyName: user.user?.familyName || user.familyName || undefined,
          givenName: user.user?.givenName || user.givenName || undefined,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Sign in with Google
   */
  static async signIn(): Promise<GoogleUser> {
    try {
      await GoogleSignin.hasPlayServices();
      
      // Sign out first to ensure account selection dialog appears
      await GoogleSignin.signOut();
      
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Google Sign-In response:', JSON.stringify(userInfo, null, 2));
      
      // The actual structure from @react-native-google-signin/google-signin
      const user = userInfo as any;
      
      // Simplified user data extraction with fallbacks
      const email = user.user?.email || user.email || '';
      if (!email) {
        throw new Error('Email is required for Google Sign-In');
      }
      
      // Use email as ID if no Google ID is available
      const googleId = user.user?.id || user.id || user.user?.sub || user.sub || email;
      
      const googleUser = {
        id: googleId,
        name: user.user?.name || user.name || email.split('@')[0] || 'User', // Use email prefix as fallback name
        email: email,
        photo: user.user?.photo || user.photo || undefined,
        familyName: user.user?.familyName || user.familyName || undefined,
        givenName: user.user?.givenName || user.givenName || undefined,
      };
      
      console.log('Processed Google user data:', googleUser);
      return googleUser;
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
      } else if (error.code === 'DEVELOPER_ERROR') {
        console.error('🔧 DEVELOPER_ERROR Solutions:');
        console.error('1. Check OAuth consent screen in Google Cloud Console');
        console.error('2. Add your email as test user if app is external');
        console.error('3. Verify Web Client ID is correct');
        console.error('4. Check if Google+ API is enabled');
        throw new Error('DEVELOPER_ERROR: Check OAuth configuration in Google Cloud Console');
      } else {
        throw new Error('Sign in failed: ' + error.message);
      }
    }
  }

  /**
   * Sign out from Google
   */
  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Sign up with Google
   */
  static async signUpWithGoogle(role: 'driver' | 'passenger'): Promise<any> {
    try {
      const googleUser = await this.signIn();
      const accessToken = await this.getAccessToken();
      
      // Call your backend API to create user account
      const signupData = {
        email: googleUser.email,
        first_name: googleUser.givenName || '',
        last_name: googleUser.familyName || '',
        user_type: role.toUpperCase(),
        google_id: googleUser.id,
        profile_picture: googleUser.photo,
        auth_provider: 'google',
        access_token: accessToken,
      };

      const response = await api.register(signupData);
      return response;
    } catch (error) {
      console.error('Google signup error:', error);
      throw error;
    }
  }

  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<any> {
    try {
      console.log('🔍 Starting Google login...');
      
      const googleUser = await this.signIn();
      console.log('✅ Google user data obtained:', googleUser);
      
      const accessToken = await this.getAccessToken();
      console.log('✅ Access token obtained:', !!accessToken);
      
      // Call your backend API to authenticate user
      const loginData = {
        email: googleUser.email,
        google_id: googleUser.id,
        access_token: accessToken,
        auth_provider: 'google',
      };

      console.log('📤 Sending login data to backend:', loginData);
      
      const response = await api.loginWithGoogle(loginData);
      console.log('📥 Backend response:', response);
      
      // Check if backend requires signup completion
      if (response.requires_signup) {
        console.log('ℹ️ New user requires signup completion (this is normal for new users)');
        throw new Error('USER_REQUIRES_SIGNUP');
      }
      
      console.log('✅ Google login successful!');
      return response;
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }
}

export default GoogleSignInService; 