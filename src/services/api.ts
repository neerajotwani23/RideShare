import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from './tokenManager';
import { ENV_CONFIG } from '../config/env';

// Use environment configuration for API URL
const BASE_URL = ENV_CONFIG.API_BASE_URL;

// Log current API configuration
console.log('🌐 API Configuration:', {
  BASE_URL,
  isDev: __DEV__,
  platform: Platform.OS,
});

// Helper function to get auth headers with automatic token refresh
const getAuthHeaders = async () => {
  return await tokenManager.getAuthHeaders();
};

// Helper function to handle network errors
const handleNetworkError = (error: any, endpoint: string) => {
  console.error(`❌ Network error for ${endpoint}:`, error);
  
  if (error.message?.includes('Network request failed')) {
    console.log('🔧 Network troubleshooting:');
    console.log('1. Check if backend server is running');
    console.log('2. Verify IP address in src/config/env.ts');
    console.log('3. Ensure port 8000 is accessible');
    console.log('4. Check firewall settings');
    console.log('5. Try restarting the app');
    
    throw new Error(`Network connection failed. Please check your internet connection and try again.`);
  }
  
  throw error;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Get the response text first, then try to parse as JSON
    let responseText = '';
    let errorData: any = null;
    
    try {
      responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      // Try to parse as JSON if it's not empty
      if (responseText.trim()) {
        try {
          errorData = JSON.parse(responseText);
          console.log('Error response data:', errorData);
        } catch (jsonError) {
          console.log('Response is not valid JSON, treating as plain text');
          errorData = { detail: responseText };
        }
      }
    } catch (textError) {
      console.error('Could not read response text:', textError);
      errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    // Handle different error response formats
    if (errorData) {
      if (errorData.detail) {
        // Handle validation errors (detail is an array) or simple error messages
        if (Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map((err: any) => 
            err.msg || err.message || `${err.loc?.join('.')}: ${err.msg || err.message}`
          ).join(', ');
          console.log('Validation error messages:', errorMessages);
          throw new Error(errorMessages);
        } else {
          console.log('Simple error detail:', errorData.detail);
          throw new Error(errorData.detail);
        }
      } else if (errorData.message) {
        throw new Error(errorData.message);
      } else if (errorData.error) {
        throw new Error(errorData.error);
      } else if (Array.isArray(errorData)) {
        // Handle array of validation errors
        const errorMessages = errorData.map((err: any) => 
          err.message || err.msg || JSON.stringify(err)
        ).join(', ');
        throw new Error(errorMessages);
      } else if (typeof errorData === 'object') {
        // Handle object with multiple error fields
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        throw new Error(errorMessages);
      }
    }
    
    // Fallback error
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  // For successful responses, try to parse as JSON
  try {
    return await response.json();
  } catch (jsonError) {
    console.error('Failed to parse successful response as JSON:', jsonError);
    throw new Error('Invalid response format from server');
  }
};

export const api = {
  // Authentication
  login: async (credentials: any) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const result = await handleResponse(response);
      
      // Store both access and refresh tokens using token manager
      if (result.access_token && result.refresh_token) {
        await tokenManager.storeTokens(result.access_token, result.refresh_token);
      }
      
      return result;
    } catch (error) {
      handleNetworkError(error, 'login');
    }
  },

  register: async (userData: any) => {
    try {
      console.log('Platform:', Platform.OS);
      console.log('BASE_URL:', BASE_URL);
      console.log('Attempting to register user with data:', userData);
      console.log('API URL:', `${BASE_URL}/auth/register`);
      
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error type:', typeof error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      handleNetworkError(error, 'register');
    }
  },

  loginWithGoogle: async (googleData: any) => {
    try {
      console.log('API: Sending Google login request to:', `${BASE_URL}/auth/google-login`);
      console.log('API: Google data:', googleData);
      
      const response = await fetch(`${BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleData),
      });
      
      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', response.headers);
      
      const result = await handleResponse(response);
      console.log('API: Response result:', result);
      
      // Store both access and refresh tokens using token manager
      if (result.access_token && result.refresh_token) {
        await tokenManager.storeTokens(result.access_token, result.refresh_token);
        console.log('API: Tokens stored successfully');
      }
      
      return result;
    } catch (error) {
      console.error('API: Google login error:', error);
      handleNetworkError(error, 'google-login');
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      const result = await handleResponse(response);
      
      // Store the new access token using token manager
      if (result.access_token) {
        await tokenManager.storeTokens(result.access_token);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  updateCurrentUser: async (userData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // User Management
  getProfile: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      console.log('Attempting to update profile with data:', profileData);
      console.log('API URL:', `${BASE_URL}/users/profile`);
      
      const headers = await getAuthHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileData),
      });
      
      console.log('Update profile response status:', response.status);
      console.log('Update profile response headers:', response.headers);
      
      return handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  },

  profileSetup: async (profileData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/users/profile/setup`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  selectRole: async (roleData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/users/role`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(roleData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData: any) => {
    try {
      console.log('Attempting to change password with data:', passwordData);
      console.log('API URL:', `${BASE_URL}/users/change-password`);
      
      const headers = await getAuthHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch(`${BASE_URL}/users/change-password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(passwordData),
      });
      
      console.log('Change password response status:', response.status);
      console.log('Change password response headers:', response.headers);
      
      return handleResponse(response);
    } catch (error) {
      console.error('Change password error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  },

  // Wallet Management
  getWalletBalance: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/wallet/balance`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  addMoneyToWallet: async (amount: number) => {
    try {
      const response = await fetch(`${BASE_URL}/users/wallet/add-money`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Rides
  createRide: async (rideData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/rides`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(rideData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  searchRides: async (searchParams: any) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const response = await fetch(`${BASE_URL}/rides/search?${queryParams}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getMyRides: async () => {
    try {
      const response = await fetch(`${BASE_URL}/rides/my-rides`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getRide: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  updateRide: async (rideId: number, rideData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(rideData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  cancelRide: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}/cancel`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  confirmRide: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}/confirm`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  activateRide: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}/activate`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  completeRide: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/${rideId}/complete`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getUpcomingRides: async () => {
    try {
      const response = await fetch(`${BASE_URL}/rides/filter/upcoming`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getPastRides: async () => {
    try {
      const response = await fetch(`${BASE_URL}/rides/filter/past`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getRidesByStatus: async (status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/rides/filter/by-status?status=${status}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Ride Requests
  createRideRequest: async (requestData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(requestData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getMyRideRequests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests/my-requests`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getRideRequests: async (rideId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests/ride/${rideId}`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  acceptRideRequest: async (requestId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  rejectRideRequest: async (requestId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  completeRideRequest: async (requestId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/ride-requests/${requestId}/complete`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Vehicles
  createVehicle: async (vehicleData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/vehicles`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getMyVehicles: async () => {
    try {
      const response = await fetch(`${BASE_URL}/vehicles/my-vehicles`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      const result = await handleResponse(response);
      console.log('API getMyVehicles result:', result);
      return result;
    } catch (error) {
      console.error('API getMyVehicles error:', error);
      throw error;
    }
  },

  updateVehicle: async (vehicleId: number, vehicleData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  deleteVehicle: async (vehicleId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Ratings
  createRating: async (ratingData: any) => {
    try {
      const response = await fetch(`${BASE_URL}/ratings`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(ratingData),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getReviewsGiven: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/reviews/given`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  getReviewsReceived: async () => {
    try {
      const response = await fetch(`${BASE_URL}/users/reviews/received`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Transactions
  getTransactions: async () => {
    try {
      const response = await fetch(`${BASE_URL}/transactions/my-transactions`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      console.log('Testing health check at:', `${BASE_URL}/health`);
      const response = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
}; 