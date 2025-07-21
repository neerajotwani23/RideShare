import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Android emulator: use 10.0.2.2
// For physical Android device: use your computer's IP address (e.g., 192.168.1.100)
// For iOS simulator: use 127.0.0.1
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.log('Error response data:', errorData);
      
      // Handle different error response formats
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
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      
      // Try to get the raw text response for debugging
      try {
        const rawText = await response.text();
        console.error('Raw response text:', rawText);
      } catch (textError) {
        console.error('Could not read response text:', textError);
      }
      
      // If JSON parsing fails, throw generic error
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
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
      return handleResponse(response);
    } catch (error) {
      throw error;
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