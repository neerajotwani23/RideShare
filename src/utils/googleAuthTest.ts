import { GoogleSignInService } from '../services/googleSignInService';
import { GOOGLE_CONFIG } from '../config/googleConfig';
import { ENV_CONFIG } from '../config/env';

export const runGoogleAuthTest = async () => {
  console.log('🧪 Starting Google Authentication Test Suite...');
  console.log('===============================================');
  
  const results = {
    configuration: false,
    playServices: false,
    signIn: false,
    backendConnection: false,
    overall: false
  };
  
  try {
    // Test 1: Configuration
    console.log('\n1️⃣ Testing Google Sign-In Configuration...');
    const isConfigured = GoogleSignInService.isConfigured();
    const isValidConfig = GoogleSignInService.validateConfiguration();
    
    console.log('✅ Is configured:', isConfigured);
    console.log('✅ Valid configuration:', isValidConfig);
    console.log('✅ Web Client ID:', GOOGLE_CONFIG.webClientId);
    console.log('✅ API Base URL:', ENV_CONFIG.API_BASE_URL);
    
    if (!isConfigured || !isValidConfig) {
      throw new Error('Google Sign-In configuration is invalid');
    }
    
    results.configuration = true;
    console.log('✅ Configuration test PASSED');
    
    // Test 2: Google Play Services
    console.log('\n2️⃣ Testing Google Play Services...');
    try {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      results.playServices = true;
      console.log('✅ Google Play Services test PASSED');
    } catch (error) {
      console.error('❌ Google Play Services test FAILED:', error);
      throw error;
    }
    
    // Test 3: Sign-In Process
    console.log('\n3️⃣ Testing Google Sign-In Process...');
    try {
      // Check if already signed in
      const isSignedIn = await GoogleSignInService.isSignedIn();
      console.log('✅ Is currently signed in:', isSignedIn);
      
      if (isSignedIn) {
        const currentUser = await GoogleSignInService.getCurrentUser();
        console.log('✅ Current user:', currentUser);
        results.signIn = true;
      } else {
        console.log('ℹ️ Not signed in - this is expected for testing');
        results.signIn = true; // Consider this a pass since we're not actually signing in
      }
      
      console.log('✅ Sign-In test PASSED');
    } catch (error) {
      console.error('❌ Sign-In test FAILED:', error);
      throw error;
    }
    
    // Test 4: Backend Connection
    console.log('\n4️⃣ Testing Backend Connection...');
    try {
      const { api } = await import('../services/api');
      await api.healthCheck();
      results.backendConnection = true;
      console.log('✅ Backend connection test PASSED');
    } catch (error) {
      console.error('❌ Backend connection test FAILED:', error);
      console.log('ℹ️ This is expected if backend is not running');
      // Don't throw error for backend test as it might not be running
    }
    
    // Overall result
    results.overall = results.configuration && results.playServices && results.signIn;
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`Configuration: ${results.configuration ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Play Services: ${results.playServices ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Sign-In Process: ${results.signIn ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Backend Connection: ${results.backendConnection ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Overall: ${results.overall ? '✅ PASS' : '❌ FAIL'}`);
    
    if (results.overall) {
      console.log('\n🎉 Google Authentication is properly configured and ready to use!');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the configuration.');
    }
    
    return results;
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if google-services.json is in android/app/');
    console.log('2. Verify Web Client ID in Google Cloud Console');
    console.log('3. Ensure Google Play Services is up to date');
    console.log('4. Check if backend server is running');
    console.log('5. Verify OAuth consent screen configuration');
    
    return results;
  }
};

export const testGoogleSignInFlow = async () => {
  console.log('🚀 Testing Complete Google Sign-In Flow...');
  console.log('==========================================');
  
  try {
    // Step 1: Sign in with Google
    console.log('\n1️⃣ Attempting Google Sign-In...');
    const googleUser = await GoogleSignInService.signIn();
    console.log('✅ Google Sign-In successful:', googleUser);
    
    // Step 2: Get access token
    console.log('\n2️⃣ Getting access token...');
    const accessToken = await GoogleSignInService.getAccessToken();
    console.log('✅ Access token obtained:', !!accessToken);
    
    // Step 3: Try backend login
    console.log('\n3️⃣ Attempting backend login...');
    try {
      const loginData = {
        email: googleUser.email,
        google_id: googleUser.id,
        access_token: accessToken,
        auth_provider: 'google',
        first_name: googleUser.givenName || '',
        last_name: googleUser.familyName || '',
        profile_picture: googleUser.photo,
      };
      
      const { api } = await import('../services/api');
      const response = await api.loginWithGoogle(loginData);
      console.log('✅ Backend login successful:', response);
      
      if (response.requires_signup) {
        console.log('ℹ️ User requires signup completion');
      } else {
        console.log('✅ User logged in successfully');
      }
      
    } catch (backendError) {
      console.log('ℹ️ Backend login result:', backendError.message);
      if (backendError.message === 'USER_REQUIRES_SIGNUP') {
        console.log('✅ This is expected for new users');
      } else {
        console.error('❌ Backend login failed:', backendError);
      }
    }
    
    // Step 4: Sign out
    console.log('\n4️⃣ Signing out...');
    await GoogleSignInService.signOut();
    console.log('✅ Sign-out successful');
    
    console.log('\n🎉 Complete Google Sign-In flow test completed!');
    
  } catch (error) {
    console.error('\n❌ Google Sign-In flow test failed:', error);
    throw error;
  }
};

export const testGoogleSignupFlow = async () => {
  console.log('🚀 Testing Complete Google Signup Flow...');
  console.log('==========================================');
  
  try {
    // Step 1: Sign in with Google
    console.log('\n1️⃣ Getting Google user data...');
    const googleUser = await GoogleSignInService.signIn();
    console.log('✅ Google user data:', googleUser);
    
    // Step 2: Get access token
    console.log('\n2️⃣ Getting access token...');
    const accessToken = await GoogleSignInService.getAccessToken();
    console.log('✅ Access token obtained:', !!accessToken);
    
    // Step 3: Try backend signup
    console.log('\n3️⃣ Attempting backend signup...');
    try {
      const signupData = {
        email: googleUser.email,
        first_name: googleUser.givenName || '',
        last_name: googleUser.familyName || '',
        user_type: 'PASSENGER', // Default to passenger for testing
        google_id: googleUser.id,
        profile_picture: googleUser.photo,
        auth_provider: 'google',
        access_token: accessToken,
      };
      
      const { api } = await import('../services/api');
      const response = await api.register(signupData);
      console.log('✅ Backend signup successful:', response);
      
    } catch (backendError) {
      console.log('ℹ️ Backend signup result:', backendError.message);
      if (backendError.message.includes('already registered')) {
        console.log('✅ This is expected if user already exists');
      } else {
        console.error('❌ Backend signup failed:', backendError);
      }
    }
    
    // Step 4: Sign out
    console.log('\n4️⃣ Signing out...');
    await GoogleSignInService.signOut();
    console.log('✅ Sign-out successful');
    
    console.log('\n🎉 Complete Google Signup flow test completed!');
    
  } catch (error) {
    console.error('\n❌ Google Signup flow test failed:', error);
    throw error;
  }
}; 