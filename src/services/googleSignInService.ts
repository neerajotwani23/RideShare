import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { api } from './api';
import { GOOGLE_CONFIG } from '../config/googleConfig';

// Configure Google Sign-In with better error handling
console.log('🔧 Configuring Google Sign-In...');
console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);

let isConfigured = false;
let isSigningIn = false;

const configureGoogleSignIn = () => {
  if (isConfigured) {
    console.log('✅ Google Sign-In already configured');
    return;
  }
  
  try {
    // Check if webClientId is valid
    if (!GOOGLE_CONFIG.webClientId || GOOGLE_CONFIG.webClientId.includes('YOUR_')) {
      console.error('❌ Invalid Web Client ID:', GOOGLE_CONFIG.webClientId);
      throw new Error('Invalid Google Web Client ID configuration');
    }
    
    GoogleSignin.configure({
      webClientId: GOOGLE_CONFIG.webClientId,
      offlineAccess: false,
      hostedDomain: '',
      forceCodeForRefreshToken: false,
      scopes: ['email', 'profile'],
    });
    isConfigured = true;
    console.log('✅ Google Sign-In configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure Google Sign-In:', error);
    throw error;
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
        return this.extractUserData(userInfo);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Extract user data from Google Sign-In response
   */
  private static extractUserData(userInfo: any): GoogleUser {
    const user = userInfo as any;
    
    // Extract email (required)
    const email = user.user?.email || user.email || '';
    if (!email) {
      throw new Error('Email is required for Google Sign-In');
    }
    
    // Extract Google ID (use sub if available, otherwise use email as fallback)
    const googleId = user.user?.id || user.id || user.user?.sub || user.sub || email;
    
    // Extract name with fallbacks
    const name = user.user?.name || user.name || email.split('@')[0] || 'User';
    
    const googleUser = {
      id: googleId,
      name: name,
      email: email,
      photo: user.user?.photo || user.photo || undefined,
      familyName: user.user?.familyName || user.familyName || undefined,
      givenName: user.user?.givenName || user.givenName || undefined,
    };
    
    console.log('Extracted Google user data:', googleUser);
    return googleUser;
  }



  /**
   * Sign in with Google - handles account selection intelligently
   */
  static async signIn(): Promise<GoogleUser> {
    if (isSigningIn) {
      throw new Error('Sign in is already in progress');
    }
    
    isSigningIn = true;
    
    try {
      console.log('🔍 Checking Google Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Try to get current user first
      let shouldForceAccountSelection = false;
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          console.log('🔄 Previous user detected. Will sign out to allow account selection.');
          shouldForceAccountSelection = true;
        }
      } catch (error) {
        console.log('ℹ️ No previous user detected');
      }
      
      // If there's a previous user, sign them out first (but ONLY once)
      if (shouldForceAccountSelection) {
        try {
          await GoogleSignin.signOut();
          console.log('✅ Previous user signed out');
        } catch (signOutError) {
          console.log('ℹ️ Sign out error (continuing anyway):', signOutError);
        }
      }
      
      console.log('🚀 Starting Google Sign-In...');
      const userInfo = await GoogleSignin.signIn();
      
      console.log('✅ Google Sign-In successful!');
      console.log('Raw response:', JSON.stringify(userInfo, null, 2));
      
      return this.extractUserData(userInfo);
      
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled by user');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available. Please update Google Play Services.');
      } else if (error.code === 'DEVELOPER_ERROR') {
        console.error('🔧 DEVELOPER_ERROR Solutions:');
        console.error('1. Check OAuth consent screen in Google Cloud Console');
        console.error('2. Add your email as test user if app is external');
        console.error('3. Verify Web Client ID is correct');
        console.error('4. Check if Google+ API is enabled');
        throw new Error('Google Sign-In configuration error. Please contact support.');
      } else {
        throw new Error(`Google Sign-In failed: ${error.message}`);
      }
    } finally {
      isSigningIn = false;
    }
  }

  /**
   * Sign out from Google
   */
  static async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('✅ Google Sign-Out successful');
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
      console.log('✅ Google access token obtained');
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
      console.log('🚀 Starting Google signup process...');
      
      const googleUser = await this.signIn();
      const accessToken = await this.getAccessToken();
      
      console.log('📤 Sending signup data to backend...');
      
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

      console.log('Signup data:', signupData);
      const response = await api.register(signupData);
      
      console.log('✅ Google signup successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Google signup error:', error);
      throw error;
    }
  }

  /**
   * Login with Google
   */
  static async loginWithGoogle(): Promise<any> {
    try {
      console.log('🔍 Starting Google login process...');
      
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
        first_name: googleUser.givenName || '',
        last_name: googleUser.familyName || '',
        profile_picture: googleUser.photo,
      };

      console.log('📤 Sending login data to backend:', loginData);
      
      const response = await api.loginWithGoogle(loginData);
      console.log('📥 Backend response:', response);
      
      // Check if backend requires signup completion
      if (response.requires_signup) {
        console.log('ℹ️ New user requires signup completion');
        throw new Error('USER_REQUIRES_SIGNUP');
      }
      
      console.log('✅ Google login successful!');
      return response;
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }

  /**
   * Validate Google configuration
   */
  static validateConfiguration(): boolean {
    if (!isConfigured) {
      console.error('❌ Google Sign-In not configured');
      return false;
    }
    
    if (!GOOGLE_CONFIG.webClientId || GOOGLE_CONFIG.webClientId.includes('YOUR_')) {
      console.error('❌ Invalid Web Client ID');
      return false;
    }
    
    console.log('✅ Google Sign-In configuration is valid');
    return true;
  }
}

export default GoogleSignInService; 