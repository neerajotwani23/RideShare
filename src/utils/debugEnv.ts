// Debug environment variables loading
import { ENV_CONFIG } from '../config/env';

export const debugEnv = () => {
  console.log('🔍 Debug Environment Variables:');
  
  console.log('Raw values from @env: undefined (using fallbacks)');
  
  console.log('🔍 Processed ENV_CONFIG:');
  console.log('Final GOOGLE_WEB_CLIENT_ID:', ENV_CONFIG.GOOGLE_WEB_CLIENT_ID);
  console.log('Final API_BASE_URL:', ENV_CONFIG.API_BASE_URL);
  
  // Check if the final values are valid
  const issues = [];
  if (!ENV_CONFIG.GOOGLE_WEB_CLIENT_ID || ENV_CONFIG.GOOGLE_WEB_CLIENT_ID.includes('YOUR_')) {
    issues.push('GOOGLE_WEB_CLIENT_ID is not properly configured');
  }
  if (!ENV_CONFIG.API_BASE_URL || ENV_CONFIG.API_BASE_URL.includes('YOUR_')) {
    issues.push('API_BASE_URL is not properly configured');
  }
  
  if (issues.length > 0) {
    console.error('❌ Configuration issues:', issues);
    return false;
  }
  
  console.log('✅ Environment configuration is working properly');
  return true;
}; 