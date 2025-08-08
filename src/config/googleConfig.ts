// Google Sign-In Configuration
import { ENV_CONFIG } from './env';

export const GOOGLE_CONFIG = {
  // Web Client ID from secure environment configuration
  webClientId: ENV_CONFIG.GOOGLE_WEB_CLIENT_ID,
  
  // Additional configuration for better compatibility
  offlineAccess: false, // Disable offline access to reduce scope requirements
  hostedDomain: '',
  forceCodeForRefreshToken: false, // Disable refresh token to reduce scope requirements
  
  // Minimal scopes to request
  scopes: [
    'email', // Request email scope
    'profile', // Request profile scope for basic user info
  ],
  
  // Additional configuration for React Native
  iosClientId: '', // Leave empty for Android
  serverClientId: ENV_CONFIG.GOOGLE_WEB_CLIENT_ID, // Use Web Client ID as server client ID
};

// Instructions for setting up Google Sign-In:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select an existing one
// 3. Enable the Google+ API
// 4. Go to Credentials
// 5. Create OAuth 2.0 Client ID (Web application type)
// 6. Copy the Web Client ID and replace it above
// 7. For Android, also add the SHA-1 fingerprint to your Firebase project
// 8. Download google-services.json and place it in android/app/
// 9. For iOS, download GoogleService-Info.plist and add it to your Xcode project 