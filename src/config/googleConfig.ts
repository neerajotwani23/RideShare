// Google Sign-In Configuration
import { ENV_CONFIG } from './env';

export const GOOGLE_CONFIG = {
  // Web Client ID from secure environment configuration
  webClientId: ENV_CONFIG.GOOGLE_WEB_CLIENT_ID,
  
  // Optional configurations
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  
  // Scopes to request
  scopes: [
    'profile',
    'email',
  ],
};

// Instructions for setting up Google Sign-In:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select an existing one
// 3. Enable the Google+ API
// 4. Go to Credentials
// 5. Create OAuth 2.0 Client ID
// 6. Add your app's package name and SHA-1 fingerprint
// 7. Copy the Web Client ID and replace it above
// 8. For Android, also add the SHA-1 fingerprint to your Firebase project
// 9. Download google-services.json and place it in android/app/
// 10. For iOS, download GoogleService-Info.plist and add it to your Xcode project 