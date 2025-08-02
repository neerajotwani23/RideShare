export const basicTest = () => {
  console.log('🧪 Basic Test - Checking imports...');
  
  try {
    // Try to import ENV_CONFIG
    const { ENV_CONFIG } = require('../config/env');
    console.log('✅ ENV_CONFIG imported successfully');
    console.log('API_BASE_URL:', ENV_CONFIG.API_BASE_URL);
    console.log('GOOGLE_WEB_CLIENT_ID:', ENV_CONFIG.GOOGLE_WEB_CLIENT_ID);
    
    return { success: true, message: 'Basic test passed' };
  } catch (error) {
    console.error('❌ Basic test failed:', error);
    return { success: false, error };
  }
}; 