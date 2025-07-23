import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { api } from './api';
import { GOOGLE_CONFIG } from '../config/googleConfig';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_CONFIG.webClientId,
  offlineAccess: GOOGLE_CONFIG.offlineAccess,
  hostedDomain: GOOGLE_CONFIG.hostedDomain,
  forceCodeForRefreshToken: GOOGLE_CONFIG.forceCodeForRefreshToken,
});

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
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Google Sign-In response:', JSON.stringify(userInfo, null, 2));
      
      // The actual structure from @react-native-google-signin/google-signin
      const user = userInfo as any;
      
      // Try different ways to get the Google ID
      let googleId = '';
      if (user.user?.id) {
        googleId = user.user.id;
      } else if (user.id) {
        googleId = user.id;
      } else if (user.user?.sub) {
        googleId = user.user.sub;
      } else if (user.sub) {
        googleId = user.sub;
      } else {
        // If no ID found, use email as fallback (not ideal but works for testing)
        googleId = user.user?.email || user.email || '';
        console.warn('No Google ID found, using email as fallback');
      }
      
      const googleUser = {
        id: googleId,
        name: user.user?.name || user.name || '',
        email: user.user?.email || user.email || '',
        photo: user.user?.photo || user.photo || undefined,
        familyName: user.user?.familyName || user.familyName || undefined,
        givenName: user.user?.givenName || user.givenName || undefined,
      };
      
      console.log('Processed Google user data:', googleUser);
      return googleUser;
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
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
      console.log('Starting Google login...');
      
      const googleUser = await this.signIn();
      console.log('Google user data:', googleUser);
      
      const accessToken = await this.getAccessToken();
      console.log('Access token obtained:', !!accessToken);
      
      // Call your backend API to authenticate user
      const loginData = {
        email: googleUser.email,
        google_id: googleUser.id,
        access_token: accessToken,
        auth_provider: 'google',
      };

      console.log('Sending login data to backend:', loginData);
      
      const response = await api.loginWithGoogle(loginData);
      console.log('Backend response:', response);
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}

export default GoogleSignInService; 