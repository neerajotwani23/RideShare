import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

class TokenManager {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;

  /**
   * Get the current access token
   */
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  /**
   * Get the current refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('refreshToken');
  }

  /**
   * Store tokens
   */
  async storeTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await AsyncStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
  }

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }

  /**
   * Check if token is expired (JWT tokens have exp claim)
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // Consider token expired if it expires within the next 5 minutes
      return currentTime >= (expTime - 5 * 60 * 1000);
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Consider expired if we can't parse it
    }
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token available');
        return null;
      }

      console.log('🔄 Refreshing access token...');
      const result = await api.refreshToken();
      
      if (result.access_token) {
        console.log('✅ Access token refreshed successfully');
        return result.access_token;
      } else {
        console.log('❌ No access token in refresh response');
        return null;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // Clear tokens if refresh fails
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Get a valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      console.log('No access token found');
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired(accessToken)) {
      console.log('Access token is expired, refreshing...');
      return await this.refreshAccessToken();
    }

    return accessToken;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    
    if (!accessToken || !refreshToken) {
      return false;
    }

    // If access token is expired, try to refresh it
    if (this.isTokenExpired(accessToken)) {
      const newToken = await this.refreshAccessToken();
      return !!newToken;
    }

    return true;
  }

  /**
   * Get authentication headers with automatic token refresh
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getValidAccessToken();
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export const tokenManager = new TokenManager(); 