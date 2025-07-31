// Environment Configuration Example
// Copy this file to env.ts and fill in your actual values
// DO NOT commit env.ts to git

export const ENV_CONFIG = {
  // Google Sign-In Configuration
  GOOGLE_WEB_CLIENT_ID: 'YOUR_GOOGLE_WEB_CLIENT_ID_HERE',
  
  // API Configuration
  API_BASE_URL: __DEV__ 
    ? 'http://YOUR_DEV_IP:8000'  // Development
    : 'https://your-production-api.com', // Production
  
  // Package name for Firebase configuration
  PACKAGE_NAME: 'com.rideshare.app',
  
  // Other sensitive configurations
  SECRET_KEY: 'YOUR_SECRET_KEY_HERE',
  
  // Firebase Configuration (if needed)
  FIREBASE_API_KEY: 'YOUR_FIREBASE_API_KEY_HERE',
  FIREBASE_PROJECT_ID: 'YOUR_FIREBASE_PROJECT_ID_HERE',
};

// Validation function to ensure all required env vars are set
export const validateEnvConfig = () => {
  const required = [
    'GOOGLE_WEB_CLIENT_ID',
    'API_BASE_URL',
  ];
  
  const missing = required.filter(key => {
    const value = ENV_CONFIG[key as keyof typeof ENV_CONFIG];
    return !value || value.includes('YOUR_') || value.includes('your-');
  });
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}; 