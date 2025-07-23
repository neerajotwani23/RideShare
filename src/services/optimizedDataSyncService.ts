import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { isConnectedToInternet } from './networkUtils';

// Storage keys for AsyncStorage
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  WALLET_BALANCE: 'wallet_balance',
  MY_RIDES: 'my_rides',
  AVAILABLE_RIDES: 'available_rides',
  UPCOMING_RIDES: 'upcoming_rides',
  PAST_RIDES: 'past_rides',
  MY_RIDE_REQUESTS: 'my_ride_requests',
  MY_VEHICLES: 'my_vehicles',
  REVIEWS_GIVEN: 'reviews_given',
  REVIEWS_RECEIVED: 'reviews_received',
  TRANSACTIONS: 'transactions',
  LAST_SYNC: 'last_sync',
  CACHE_TIMESTAMPS: 'cache_timestamps',
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
  USER_PROFILE: 5 * 60 * 1000,      // 5 minutes
  WALLET_BALANCE: 2 * 60 * 1000,    // 2 minutes
  MY_RIDES: 1 * 60 * 1000,          // 1 minute
  AVAILABLE_RIDES: 30 * 1000,       // 30 seconds
  UPCOMING_RIDES: 2 * 60 * 1000,    // 2 minutes
  PAST_RIDES: 5 * 60 * 1000,        // 5 minutes
  MY_RIDE_REQUESTS: 1 * 60 * 1000,  // 1 minute
  MY_VEHICLES: 10 * 60 * 1000,      // 10 minutes
  REVIEWS_GIVEN: 5 * 60 * 1000,     // 5 minutes
  REVIEWS_RECEIVED: 5 * 60 * 1000,  // 5 minutes
  TRANSACTIONS: 2 * 60 * 1000,      // 2 minutes
};

interface CacheTimestamps {
  [key: string]: number;
}

interface SyncData {
  userProfile?: any;
  walletBalance?: number;
  myRides?: any[];
  availableRides?: any[];
  upcomingRides?: any[];
  pastRides?: any[];
  myRideRequests?: any[];
  myVehicles?: any[];
  reviewsGiven?: any[];
  reviewsReceived?: any[];
  transactions?: any[];
}

class OptimizedDataSyncService {
  private isSyncing = false;
  private syncQueue: (() => Promise<void>)[] = [];
  private cacheTimestamps: CacheTimestamps = {};

  constructor() {
    this.loadCacheTimestamps();
  }

  /**
   * Load cache timestamps from storage
   */
  private async loadCacheTimestamps(): Promise<void> {
    try {
      const timestamps = await AsyncStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMPS);
      if (timestamps) {
        this.cacheTimestamps = JSON.parse(timestamps);
      }
    } catch (error) {
      console.warn('Failed to load cache timestamps:', error);
    }
  }

  /**
   * Update cache timestamp for a data type
   */
  private async updateCacheTimestamp(dataType: string): Promise<void> {
    this.cacheTimestamps[dataType] = Date.now();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMPS, JSON.stringify(this.cacheTimestamps));
    } catch (error) {
      console.warn('Failed to update cache timestamp:', error);
    }
  }

  /**
   * Check if cache is still valid for a data type
   */
  private isCacheValid(dataType: string): boolean {
    const timestamp = this.cacheTimestamps[dataType];
    if (!timestamp) return false;
    
    const expiry = CACHE_EXPIRY[dataType as keyof typeof CACHE_EXPIRY];
    if (!expiry) return true;
    
    return Date.now() - timestamp < expiry;
  }

  /**
   * Smart sync - only fetch data that needs updating
   */
  async smartSync(requiredDataTypes?: string[]): Promise<SyncData> {
    if (this.isSyncing) {
      return new Promise((resolve, reject) => {
        this.syncQueue.push(async () => {
          try {
            const result = await this.performSmartSync(requiredDataTypes);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    const isConnected = await isConnectedToInternet();
    if (!isConnected) {
      console.log('⚠️ No internet connection, loading from storage');
      return this.loadFromStorage();
    }

    this.isSyncing = true;
    try {
      const result = await this.performSmartSync(requiredDataTypes);
      this.processSyncQueue();
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Perform smart sync based on cache validity
   */
  private async performSmartSync(requiredDataTypes?: string[]): Promise<SyncData> {
    console.log('🚀 Starting smart data sync...');
    const startTime = Date.now();

    try {
      // Determine which data types need syncing
      const dataTypesToSync = this.getDataTypesToSync(requiredDataTypes);
      console.log('📋 Data types to sync:', dataTypesToSync);

      // Load cached data first for immediate response
      const cachedData = await this.loadFromStorage();
      
      // Fetch only required data in parallel
      const syncPromises = dataTypesToSync.map(async (dataType) => {
        try {
          const data = await this.fetchDataType(dataType);
          await this.updateCacheTimestamp(dataType);
          return { dataType, data, success: true };
        } catch (error) {
          console.warn(`Failed to sync ${dataType}:`, error);
          return { dataType, data: null, success: false };
        }
      });

      const results = await Promise.allSettled(syncPromises);
      
      // Update cached data with fresh data
      const updatedData = { ...cachedData };
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          const { dataType, data } = result.value;
          this.updateDataByType(updatedData, dataType, data);
        }
      });

      // Update AsyncStorage with new data
      await this.updateAsyncStorage(updatedData);

      const duration = Date.now() - startTime;
      console.log(`✅ Smart sync completed in ${duration}ms`);

      return updatedData;
    } catch (error) {
      console.error('❌ Smart sync failed:', error);
      throw error;
    }
  }

  /**
   * Determine which data types need syncing
   */
  private getDataTypesToSync(requiredDataTypes?: string[]): string[] {
    const allDataTypes = [
      'userProfile', 'walletBalance', 'myRides', 'availableRides',
      'upcomingRides', 'pastRides', 'myRideRequests', 'myVehicles',
      'reviewsGiven', 'reviewsReceived', 'transactions'
    ];

    if (requiredDataTypes) {
      return requiredDataTypes.filter(type => !this.isCacheValid(type));
    }

    return allDataTypes.filter(type => !this.isCacheValid(type));
  }

  /**
   * Fetch specific data type
   */
  private async fetchDataType(dataType: string): Promise<any> {
    switch (dataType) {
      case 'userProfile':
        return await api.getProfile();
      case 'walletBalance':
        return await api.getWalletBalance();
      case 'myRides':
        return await api.getMyRides();
      case 'availableRides':
        return await api.searchRides({});
      case 'upcomingRides':
        return await api.getUpcomingRides();
      case 'pastRides':
        return await api.getPastRides();
      case 'myRideRequests':
        return await api.getMyRideRequests();
      case 'myVehicles':
        return await api.getMyVehicles();
      case 'reviewsGiven':
        return await api.getReviewsGiven();
      case 'reviewsReceived':
        return await api.getReviewsReceived();
      case 'transactions':
        return await api.getTransactions();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * Update data object by type
   */
  private updateDataByType(data: SyncData, dataType: string, value: any): void {
    switch (dataType) {
      case 'userProfile':
        data.userProfile = value;
        break;
      case 'walletBalance':
        data.walletBalance = value?.balance;
        break;
      case 'myRides':
        data.myRides = value;
        break;
      case 'availableRides':
        data.availableRides = value;
        break;
      case 'upcomingRides':
        data.upcomingRides = value;
        break;
      case 'pastRides':
        data.pastRides = value;
        break;
      case 'myRideRequests':
        data.myRideRequests = value;
        break;
      case 'myVehicles':
        data.myVehicles = value;
        break;
      case 'reviewsGiven':
        data.reviewsGiven = value;
        break;
      case 'reviewsReceived':
        data.reviewsReceived = value;
        break;
      case 'transactions':
        data.transactions = value;
        break;
    }
  }

  /**
   * Force sync specific data type (bypass cache)
   */
  async forceSyncDataType(dataType: string): Promise<any> {
    try {
      const data = await this.fetchDataType(dataType);
      await this.updateCacheTimestamp(dataType);
      
      // Update AsyncStorage
      const storageKey = this.getStorageKey(dataType);
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error(`Failed to force sync ${dataType}:`, error);
      throw error;
    }
  }

  /**
   * Get storage key for data type
   */
  private getStorageKey(dataType: string): string {
    const keyMap: { [key: string]: string } = {
      userProfile: STORAGE_KEYS.USER_PROFILE,
      walletBalance: STORAGE_KEYS.WALLET_BALANCE,
      myRides: STORAGE_KEYS.MY_RIDES,
      availableRides: STORAGE_KEYS.AVAILABLE_RIDES,
      upcomingRides: STORAGE_KEYS.UPCOMING_RIDES,
      pastRides: STORAGE_KEYS.PAST_RIDES,
      myRideRequests: STORAGE_KEYS.MY_RIDE_REQUESTS,
      myVehicles: STORAGE_KEYS.MY_VEHICLES,
      reviewsGiven: STORAGE_KEYS.REVIEWS_GIVEN,
      reviewsReceived: STORAGE_KEYS.REVIEWS_RECEIVED,
      transactions: STORAGE_KEYS.TRANSACTIONS,
    };
    return keyMap[dataType] || dataType;
  }

  /**
   * Background sync - update data without blocking UI
   */
  async backgroundSync(): Promise<void> {
    if (this.isSyncing) return;
    
    const isConnected = await isConnectedToInternet();
    if (!isConnected) return;

    // Run in background without blocking
    setImmediate(async () => {
      try {
        await this.smartSync();
        console.log('✅ Background sync completed');
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    });
  }

  /**
   * Load data from AsyncStorage (for offline/initial load)
   */
  async loadFromStorage(): Promise<SyncData> {
    try {
      const [
        userProfile,
        walletBalance,
        myRides,
        availableRides,
        upcomingRides,
        pastRides,
        myRideRequests,
        myVehicles,
        reviewsGiven,
        reviewsReceived,
        transactions,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.WALLET_BALANCE),
        AsyncStorage.getItem(STORAGE_KEYS.MY_RIDES),
        AsyncStorage.getItem(STORAGE_KEYS.AVAILABLE_RIDES),
        AsyncStorage.getItem(STORAGE_KEYS.UPCOMING_RIDES),
        AsyncStorage.getItem(STORAGE_KEYS.PAST_RIDES),
        AsyncStorage.getItem(STORAGE_KEYS.MY_RIDE_REQUESTS),
        AsyncStorage.getItem(STORAGE_KEYS.MY_VEHICLES),
        AsyncStorage.getItem(STORAGE_KEYS.REVIEWS_GIVEN),
        AsyncStorage.getItem(STORAGE_KEYS.REVIEWS_RECEIVED),
        AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
      ]);

      return {
        userProfile: userProfile ? JSON.parse(userProfile) : undefined,
        walletBalance: walletBalance ? JSON.parse(walletBalance) : undefined,
        myRides: myRides ? JSON.parse(myRides) : [],
        availableRides: availableRides ? JSON.parse(availableRides) : [],
        upcomingRides: upcomingRides ? JSON.parse(upcomingRides) : [],
        pastRides: pastRides ? JSON.parse(pastRides) : [],
        myRideRequests: myRideRequests ? JSON.parse(myRideRequests) : [],
        myVehicles: myVehicles ? JSON.parse(myVehicles) : [],
        reviewsGiven: reviewsGiven ? JSON.parse(reviewsGiven) : [],
        reviewsReceived: reviewsReceived ? JSON.parse(reviewsReceived) : [],
        transactions: transactions ? JSON.parse(transactions) : [],
      };
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      return {};
    }
  }

  /**
   * Update AsyncStorage with new data
   */
  private async updateAsyncStorage(data: SyncData): Promise<void> {
    const storageUpdates: [string, string][] = [];

    if (data.userProfile !== undefined) {
      storageUpdates.push([STORAGE_KEYS.USER_PROFILE, JSON.stringify(data.userProfile)]);
    }
    if (data.walletBalance !== undefined) {
      storageUpdates.push([STORAGE_KEYS.WALLET_BALANCE, JSON.stringify(data.walletBalance)]);
    }
    if (data.myRides !== undefined) {
      storageUpdates.push([STORAGE_KEYS.MY_RIDES, JSON.stringify(data.myRides)]);
    }
    if (data.availableRides !== undefined) {
      storageUpdates.push([STORAGE_KEYS.AVAILABLE_RIDES, JSON.stringify(data.availableRides)]);
    }
    if (data.upcomingRides !== undefined) {
      storageUpdates.push([STORAGE_KEYS.UPCOMING_RIDES, JSON.stringify(data.upcomingRides)]);
    }
    if (data.pastRides !== undefined) {
      storageUpdates.push([STORAGE_KEYS.PAST_RIDES, JSON.stringify(data.pastRides)]);
    }
    if (data.myRideRequests !== undefined) {
      storageUpdates.push([STORAGE_KEYS.MY_RIDE_REQUESTS, JSON.stringify(data.myRideRequests)]);
    }
    if (data.myVehicles !== undefined) {
      storageUpdates.push([STORAGE_KEYS.MY_VEHICLES, JSON.stringify(data.myVehicles)]);
    }
    if (data.reviewsGiven !== undefined) {
      storageUpdates.push([STORAGE_KEYS.REVIEWS_GIVEN, JSON.stringify(data.reviewsGiven)]);
    }
    if (data.reviewsReceived !== undefined) {
      storageUpdates.push([STORAGE_KEYS.REVIEWS_RECEIVED, JSON.stringify(data.reviewsReceived)]);
    }
    if (data.transactions !== undefined) {
      storageUpdates.push([STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions)]);
    }

    // Batch update AsyncStorage
    await Promise.all(
      storageUpdates.map(([key, value]) => AsyncStorage.setItem(key, value))
    );
  }

  /**
   * Process queued sync requests
   */
  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const syncRequest = this.syncQueue.shift();
      if (syncRequest) {
        await syncRequest();
      }
    }
  }

  /**
   * Clear all stored data and cache
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        ...Object.values(STORAGE_KEYS).map(key => AsyncStorage.removeItem(key)),
        AsyncStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMPS)
      ]);
      this.cacheTimestamps = {};
      console.log('✅ All stored data and cache cleared');
    } catch (error) {
      console.error('Failed to clear stored data:', error);
    }
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): { [key: string]: { valid: boolean; age: number } } {
    const status: { [key: string]: { valid: boolean; age: number } } = {};
    
    Object.keys(CACHE_EXPIRY).forEach(dataType => {
      const timestamp = this.cacheTimestamps[dataType];
      const age = timestamp ? Date.now() - timestamp : Infinity;
      const valid = this.isCacheValid(dataType);
      status[dataType] = { valid, age };
    });
    
    return status;
  }
}

export const optimizedDataSyncService = new OptimizedDataSyncService();
export default optimizedDataSyncService; 