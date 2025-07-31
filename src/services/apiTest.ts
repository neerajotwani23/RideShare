import { api } from './api';

/**
 * Test API error handling
 */
export const testApiErrorHandling = async () => {
  console.log('🧪 Testing API error handling...');
  
  try {
    // Test with invalid endpoint to trigger error
    const response = await fetch('http://10.210.1.177:8000/invalid-endpoint', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // This should trigger the error handling
    const data = await response.json();
    console.log('Unexpected success:', data);
  } catch (error: any) {
    console.log('✅ Error handling test passed:', error.message);
  }
  
  try {
    // Test with valid endpoint but no auth
    const response = await fetch('http://10.210.1.177:8000/users/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // This should also trigger error handling
    const data = await response.json();
    console.log('Unexpected success:', data);
  } catch (error: any) {
    console.log('✅ Auth error handling test passed:', error.message);
  }
};

/**
 * Test network connectivity
 */
export const testNetworkConnectivity = async () => {
  console.log('🧪 Testing network connectivity...');
  
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
    });
    console.log('✅ Internet connectivity test passed:', response.status);
  } catch (error) {
    console.log('❌ Internet connectivity test failed:', error);
  }
  
  try {
    const response = await fetch('http://10.210.1.177:8000/health', {
      method: 'GET',
    });
    console.log('✅ Backend connectivity test passed:', response.status);
  } catch (error) {
    console.log('❌ Backend connectivity test failed:', error);
  }
}; 