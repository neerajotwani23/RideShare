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
};

// Data types for type safety
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

class DataSyncService {
  private isSyncing = false;
  private syncQueue: (() => Promise<void>)[] = [];

  /**
   * Sync all data from database and update AsyncStorage
   */
  async syncAllData(): Promise<SyncData> {
    if (this.isSyncing) {
      // If already syncing, queue this request
      return new Promise((resolve, reject) => {
        this.syncQueue.push(async () => {
          try {
            const result = await this.performFullSync();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Check network connectivity before attempting sync
    const isConnected = await isConnectedToInternet();
    if (!isConnected) {
      console.log('⚠️ No internet connection, loading from storage');
      return this.loadFromStorage();
    }

    this.isSyncing = true;
    try {
      const result = await this.performFullSync();
      this.processSyncQueue();
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Perform the actual sync operation
   */
  private async performFullSync(): Promise<SyncData> {
    console.log('🔄 Starting full data sync...');
    const startTime = Date.now();

    try {
      // Fetch all data in parallel for better performance
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
      ] = await Promise.allSettled([
        api.getProfile().catch(err => {
          console.warn('Failed to fetch user profile:', err);
          return null;
        }),
        api.getWalletBalance().catch(err => {
          console.warn('Failed to fetch wallet balance:', err);
          return null;
        }),
        api.getMyRides().catch(err => {
          console.warn('Failed to fetch my rides:', err);
          return [];
        }),
        api.searchRides({}).catch(err => {
          console.warn('Failed to fetch available rides:', err);
          return [];
        }),
        api.getUpcomingRides().catch(err => {
          console.warn('Failed to fetch upcoming rides:', err);
          return [];
        }),
        api.getPastRides().catch(err => {
          console.warn('Failed to fetch past rides:', err);
          return [];
        }),
        api.getMyRideRequests().catch(err => {
          console.warn('Failed to fetch ride requests:', err);
          return [];
        }),
        api.getMyVehicles().catch(err => {
          console.warn('Failed to fetch vehicles:', err);
          return [];
        }),
        api.getReviewsGiven().catch(err => {
          console.warn('Failed to fetch reviews given:', err);
          return [];
        }),
        api.getReviewsReceived().catch(err => {
          console.warn('Failed to fetch reviews received:', err);
          return [];
        }),
        api.getTransactions().catch(err => {
          console.warn('Failed to fetch transactions:', err);
          return [];
        }),
      ]);

      // Process results and handle errors
      const syncData: SyncData = {
        userProfile: this.getResultValue(userProfile),
        walletBalance: this.getResultValue(walletBalance)?.balance,
        myRides: this.getResultValue(myRides),
        availableRides: this.getResultValue(availableRides),
        upcomingRides: this.getResultValue(upcomingRides),
        pastRides: this.getResultValue(pastRides),
        myRideRequests: this.getResultValue(myRideRequests),
        myVehicles: this.getResultValue(myVehicles),
        reviewsGiven: this.getResultValue(reviewsGiven),
        reviewsReceived: this.getResultValue(reviewsReceived),
        transactions: this.getResultValue(transactions),
      };

      // Update AsyncStorage
      await this.updateAsyncStorage(syncData);

      // Update last sync timestamp
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());

      const duration = Date.now() - startTime;
      console.log(`✅ Data sync completed in ${duration}ms`);

      return syncData;
    } catch (error) {
      console.error('❌ Data sync failed:', error);
      throw error;
    }
  }

  /**
   * Get value from Promise result, handling rejected promises
   */
  private getResultValue<T>(result: PromiseSettledResult<T>): T | undefined {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.warn('Data fetch failed:', result.reason);
      return undefined;
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
   * Sync specific data type
   */
  async syncSpecificData(dataType: keyof SyncData): Promise<any> {
    try {
      let data: any;
      let storageKey: string;

      switch (dataType) {
        case 'userProfile':
          data = await api.getProfile();
          storageKey = STORAGE_KEYS.USER_PROFILE;
          break;
        case 'walletBalance':
          data = await api.getWalletBalance();
          storageKey = STORAGE_KEYS.WALLET_BALANCE;
          break;
        case 'myRides':
          data = await api.getMyRides();
          storageKey = STORAGE_KEYS.MY_RIDES;
          break;
        case 'availableRides':
          data = await api.searchRides({});
          storageKey = STORAGE_KEYS.AVAILABLE_RIDES;
          break;
        case 'upcomingRides':
          data = await api.getUpcomingRides();
          storageKey = STORAGE_KEYS.UPCOMING_RIDES;
          break;
        case 'pastRides':
          data = await api.getPastRides();
          storageKey = STORAGE_KEYS.PAST_RIDES;
          break;
        case 'myRideRequests':
          data = await api.getMyRideRequests();
          storageKey = STORAGE_KEYS.MY_RIDE_REQUESTS;
          break;
        case 'myVehicles':
          data = await api.getMyVehicles();
          storageKey = STORAGE_KEYS.MY_VEHICLES;
          break;
        case 'reviewsGiven':
          data = await api.getReviewsGiven();
          storageKey = STORAGE_KEYS.REVIEWS_GIVEN;
          break;
        case 'reviewsReceived':
          data = await api.getReviewsReceived();
          storageKey = STORAGE_KEYS.REVIEWS_RECEIVED;
          break;
        case 'transactions':
          data = await api.getTransactions();
          storageKey = STORAGE_KEYS.TRANSACTIONS;
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      // Update AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`Failed to sync ${dataType}:`, error);
      throw error;
    }
  }

  /**
   * Clear all stored data
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all(
        Object.values(STORAGE_KEYS).map(key => AsyncStorage.removeItem(key))
      );
      console.log('✅ All stored data cleared');
    } catch (error) {
      console.error('Failed to clear stored data:', error);
    }
  }

  /**
   * Get last sync timestamp
   */
  async getLastSyncTime(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }
}

export const dataSyncService = new DataSyncService();
export default dataSyncService; 