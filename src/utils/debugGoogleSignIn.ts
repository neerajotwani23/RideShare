import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_CONFIG } from '../config/googleConfig';

export const debugGoogleSignIn = async () => {
  console.log('🔍 Starting Google Sign-In Debug...');
  
  try {
    // 1. Check configuration
    console.log('1. Checking Google Sign-In configuration...');
    console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);
    console.log('Scopes:', GOOGLE_CONFIG.scopes);
    console.log('Offline Access:', GOOGLE_CONFIG.offlineAccess);
    
    // 2. Check if Google Play Services are available
    console.log('2. Checking Google Play Services...');
    try {
      await GoogleSignin.hasPlayServices();
      console.log('✅ Google Play Services are available');
    } catch (error: any) {
      console.error('❌ Google Play Services error:', error);
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Google Play Services not available');
      }
      return;
    }
    
    // 3. Check if user is already signed in
    console.log('3. Checking if user is already signed in...');
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log('Is signed in:', isSignedIn);
      
      if (isSignedIn) {
        const currentUser = await GoogleSignin.getCurrentUser();
        console.log('Current user:', currentUser);
      }
    } catch (error) {
      console.error('Error checking sign-in status:', error);
    }
    
    // 4. Try to get tokens (this might trigger sign-in)
    console.log('4. Trying to get tokens...');
    try {
      const tokens = await GoogleSignin.getTokens();
      console.log('✅ Tokens obtained successfully');
      console.log('Access token exists:', !!tokens.accessToken);
    } catch (error: any) {
      console.error('❌ Error getting tokens:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    }
    
    // 5. Try to sign in
    console.log('5. Attempting Google Sign-In...');
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log('✅ Google Sign-In successful!');
      console.log('User info:', JSON.stringify(userInfo, null, 2));
      
      // Extract user data
      const user = userInfo as any;
      const email = user.user?.email || user.email || '';
      const googleId = user.user?.id || user.id || user.user?.sub || user.sub || email;
      
      console.log('Extracted email:', email);
      console.log('Extracted Google ID:', googleId);
      
      return {
        success: true,
        user: {
          id: googleId,
          email: email,
          name: user.user?.name || user.name || '',
          photo: user.user?.photo || user.photo || undefined,
        }
      };
      
    } catch (error: any) {
      console.error('❌ Google Sign-In failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error('User cancelled the sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error('Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services not available');
      } else if (error.code === 'DEVELOPER_ERROR') {
        console.error('DEVELOPER_ERROR - Check OAuth configuration');
        console.error('Solutions:');
        console.error('1. Check OAuth consent screen in Google Cloud Console');
        console.error('2. Add your email as test user if app is external');
        console.error('3. Verify Web Client ID is correct');
        console.error('4. Check if Google+ API is enabled');
      }
      
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
    
  } catch (error) {
    console.error('❌ Unexpected error in debug:', error);
    return {
      success: false,
      error: 'Unexpected error',
      details: error
    };
  }
};

export const getDetailedErrorInfo = (error: any) => {
  console.log('🔍 Detailed Error Analysis:');
  console.log('Error type:', typeof error);
  console.log('Error constructor:', error?.constructor?.name);
  console.log('Error message:', error?.message);
  console.log('Error code:', error?.code);
  console.log('Error stack:', error?.stack);
  console.log('Full error object:', JSON.stringify(error, null, 2));
  
  if (error?.code === 'DEVELOPER_ERROR') {
    console.log('🔧 DEVELOPER_ERROR Solutions:');
    console.log('1. Check OAuth consent screen in Google Cloud Console');
    console.log('2. Add your email as test user if app is external');
    console.log('3. Verify Web Client ID is correct');
    console.log('4. Check if Google+ API is enabled');
    console.log('5. Verify SHA-1 fingerprint in Firebase console');
  }
}; 