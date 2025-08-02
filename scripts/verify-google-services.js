const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying google-services.json configuration...');

const googleServicesPath = path.join(__dirname, '../android/app/google-services.json');

try {
  if (!fs.existsSync(googleServicesPath)) {
    console.error('❌ google-services.json not found at:', googleServicesPath);
    process.exit(1);
  }

  const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
  
  console.log('✅ google-services.json found and parsed successfully');
  console.log('📋 Project Info:');
  console.log('- Project ID:', googleServices.project_info?.project_id);
  console.log('- Project Number:', googleServices.project_info?.project_number);
  
  const client = googleServices.client?.[0];
  if (!client) {
    console.error('❌ No client configuration found');
    process.exit(1);
  }
  
  console.log('📱 Client Info:');
  console.log('- Package Name:', client.client_info?.android_client_info?.package_name);
  console.log('- Mobile SDK App ID:', client.client_info?.mobilesdk_app_id);
  
  // Check OAuth client configuration
  const oauthClients = client.oauth_client || [];
  console.log('🔐 OAuth Clients:', oauthClients.length);
  
  if (oauthClients.length === 0) {
    console.error('❌ No OAuth clients configured!');
    console.error('This is why you\'re getting DEVELOPER_ERROR');
    console.error('');
    console.error('To fix this:');
    console.error('1. Go to Firebase Console');
    console.error('2. Project Settings > General');
    console.error('3. Find your Android app');
    console.error('4. Add SHA-1 fingerprint: 54:78:76:BA:A6:F3:8C:AB:F6:25:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03');
    console.error('5. Download updated google-services.json');
    console.error('6. Replace the existing file');
    process.exit(1);
  }
  
  oauthClients.forEach((oauthClient, index) => {
    console.log(`  ${index + 1}. Client ID: ${oauthClient.client_id}`);
    console.log(`     Client Type: ${oauthClient.client_type}`);
  });
  
  // Check API keys
  const apiKeys = client.api_key || [];
  console.log('🔑 API Keys:', apiKeys.length);
  apiKeys.forEach((apiKey, index) => {
    console.log(`  ${index + 1}. Current Key: ${apiKey.current_key}`);
  });
  
  console.log('✅ google-services.json configuration looks good!');
  console.log('🎉 OAuth clients are properly configured');
  
} catch (error) {
  console.error('❌ Error reading google-services.json:', error.message);
  process.exit(1);
} 