#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment variables for RideShare...\n');

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envPath = path.join(__dirname, '..', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('   If you want to recreate it, delete the existing .env file first.\n');
  process.exit(0);
}

// Check if env.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found!');
  console.log('   Please make sure env.example exists in the root directory.\n');
  process.exit(1);
}

try {
  // Read the example file
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Create the .env file
  fs.writeFileSync(envPath, envExampleContent);
  
           console.log('✅ .env file created successfully!');
         console.log('📝 Please edit the .env file and replace the placeholder values with your actual API keys:');
         console.log('   - GOOGLE_WEB_CLIENT_ID');
         console.log('   - GOOGLE_API_KEY (This will be used in AndroidManifest.xml)');
         console.log('   - FIREBASE_API_KEY');
         console.log('   - FIREBASE_PROJECT_ID');
         console.log('   - API_BASE_URL');
         console.log('   - SECRET_KEY');
         console.log('\n🔒 Remember: The .env file is already in .gitignore and will not be committed to git.');
         console.log('🔧 The Android build will automatically read GOOGLE_API_KEY from your .env file.\n');
  
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 