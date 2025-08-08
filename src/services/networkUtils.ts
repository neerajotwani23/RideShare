export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}

/**
 * Test if the backend server is reachable
 */
export const testBackendConnectivity = async (baseUrl: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Backend connectivity test failed:', error);
    return false;
  }
};

/**
 * Test basic internet connectivity
 */
export const testInternetConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Internet connectivity test failed:', error);
    return false;
  }
};

/**
 * Check if the device is connected to the internet
 */
export const isConnectedToInternet = async (): Promise<boolean> => {
  return await testInternetConnectivity();
};

/**
 * Get network status with basic information
 */
export const getNetworkStatus = async (): Promise<NetworkStatus> => {
  const isConnected = await testInternetConnectivity();
  return {
    isConnected,
    isInternetReachable: isConnected,
    type: 'unknown',
  };
}; 