#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read environment variables
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_PROJECT_NUMBER = process.env.FIREBASE_PROJECT_NUMBER || '106421912105';
const FIREBASE_MOBILE_SDK_APP_ID = process.env.FIREBASE_MOBILE_SDK_APP_ID || '1:106421912105:android:9d07aae382e3e44dc4d238';

// Validate required environment variables
if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
  console.error('❌ Missing required environment variables:');
  console.error('   - FIREBASE_API_KEY');
  console.error('   - FIREBASE_PROJECT_ID');
  console.error('');
  console.error('💡 Please add these to your .env file');
  process.exit(1);
}

// Generate google-services.json content
const googleServicesConfig = {
  "project_info": {
    "project_number": FIREBASE_PROJECT_NUMBER,
    "project_id": FIREBASE_PROJECT_ID,
    "storage_bucket": `${FIREBASE_PROJECT_ID}.firebasestorage.app`
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": FIREBASE_MOBILE_SDK_APP_ID,
        "android_client_info": {
          "package_name": "com.rideshare.app"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": FIREBASE_API_KEY
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
};

// Write the file
const outputPath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
fs.writeFileSync(outputPath, JSON.stringify(googleServicesConfig, null, 2));

console.log('✅ Generated google-services.json from environment variables');
console.log(`📁 File location: ${outputPath}`);
console.log(`🔑 Using Firebase API Key: ${FIREBASE_API_KEY.substring(0, 10)}...`);
console.log(`🏗️  Project ID: ${FIREBASE_PROJECT_ID}`); 