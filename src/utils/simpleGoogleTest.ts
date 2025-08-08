import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_CONFIG } from '../config/googleConfig';

export const simpleGoogleTest = () => {
  console.log('🧪 Simple Google Test - No Sign-In Attempt');
  
  try {
    // Just configure Google Sign-In
    console.log('🔧 Configuring Google Sign-In...');
    console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);
    
    GoogleSignin.configure({
      webClientId: GOOGLE_CONFIG.webClientId,
      offlineAccess: false,
      hostedDomain: '',
      forceCodeForRefreshToken: false,
      scopes: ['email'],
    });
    
    console.log('✅ Google Sign-In configured successfully');
    console.log('✅ No errors during configuration');
    
    return { success: true, message: 'Configuration successful' };
    
  } catch (error) {
    console.error('❌ Configuration failed:', error);
    return { success: false, error };
  }
}; 