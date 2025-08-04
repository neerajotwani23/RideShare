import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { optimizedDataSyncService } from '../services/optimizedDataSyncService';
import { useAuth } from './AuthContext';
import Geolocation from '@react-native-community/geolocation';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

interface AppContextType {
  //Location
   defaultLocation:any,
   location:any,
   setLocation:(location:any) => void,
   destination:any,
   setDestination:(destination:any) => void,
   source:any,
   setSource:(source:any) => void,
   destinationLocation:any,
   setDestinationLocation :(destinationLocation:any) => void,
   

   // Current Location:
      getCurrentLocation:()=>void,
  // User Data
  userProfile: any;
  walletBalance: number;
  
  // Rides
  myRides: any[];
  availableRides: any[];
  upcomingRides: any[];
  pastRides: any[];
  
  // Ride Requests
  myRideRequests: any[];
  
  // Vehicles (for drivers)
  myVehicles: any[];
  
  // Ratings
  reviewsGiven: any[];
  reviewsReceived: any[];
  
  // Transactions
  transactions: any[];
  
  // Loading States
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Actions
  refreshUserProfile: () => Promise<void>;
  refreshWalletBalance: () => Promise<void>;
  refreshMyRides: () => Promise<void>;
  refreshAvailableRides: (searchParams?: any, userPreferences?: any) => Promise<void>;
  refreshUpcomingRides: () => Promise<void>;
  refreshPastRides: () => Promise<void>;
  refreshMyRideRequests: () => Promise<void>;
  refreshMyVehicles: () => Promise<void>;
  refreshReviews: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  
  // Ride Actions
  createRide: (rideData: any) => Promise<any>;
  updateRide: (rideId: number, rideData: any) => Promise<any>;
  cancelRide: (rideId: number) => Promise<any>;
  confirmRide: (rideId: number) => Promise<any>;
  activateRide: (rideId: number) => Promise<any>;
  completeRide: (rideId: number) => Promise<any>;
  
  // Ride Request Actions
  createRideRequest: (requestData: any) => Promise<any>;
  acceptRideRequest: (requestId: number) => Promise<any>;
  rejectRideRequest: (requestId: number) => Promise<any>;
  completeRideRequest: (requestId: number) => Promise<any>;
  
  // Vehicle Actions
  createVehicle: (vehicleData: any) => Promise<any>;
  updateVehicle: (vehicleId: number, vehicleData: any) => Promise<any>;
  deleteVehicle: (vehicleId: number) => Promise<any>;
  getMyVehicles: () => Promise<any[]>;
  
  // Rating Actions
  createRating: (ratingData: any) => Promise<any>;
  
  // Wallet Actions
  addMoneyToWallet: (amount: number) => Promise<any>;
  
  // Profile Actions
  updateProfile: (profileData: any) => Promise<any>;
  changePassword: (passwordData: any) => Promise<any>;
  updateUserRole: (role: 'driver' | 'passenger') => Promise<any>;
  
  // Utility
  clearAllData: () => void;
  
  // Data Sync
  syncAllData: () => Promise<void>;
  syncSpecificData: (dataType: string) => Promise<any>;
  loadFromStorage: () => Promise<void>;
  smartSync: (requiredDataTypes?: string[]) => Promise<any>;
  forceSyncDataType: (dataType: string) => Promise<any>;
  backgroundSync: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, currentRole, updateCurrentRole } = useAuth();
  
  // State
  const [userProfile, setUserProfile] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [myRides, setMyRides] = useState<any[]>([]);
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [pastRides, setPastRides] = useState<any[]>([]);
  const [myRideRequests, setMyRideRequests] = useState<any[]>([]);
  const [myVehicles, setMyVehicles] = useState<any[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<any[]>([]);
  const [reviewsReceived, setReviewsReceived] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [source, setSource] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState(null);
  // Refresh Functions
  const refreshUserProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const profile = await api.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  }, [isAuthenticated]);

  const refreshWalletBalance = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const balance = await api.getWalletBalance();
      setWalletBalance(balance.balance);
    } catch (error) {
      console.error('Failed to refresh wallet balance:', error);
    }
  }, [isAuthenticated]);

  const refreshMyRides = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const rides = await api.getMyRides();
      setMyRides(rides);
    } catch (error) {
      console.error('Failed to refresh my rides:', error);
    }
  }, [isAuthenticated]);

  const refreshAvailableRides = useCallback(async (searchParams?: any, userPreferences?: any) => {
    if (!isAuthenticated) return;
    try {
      // Combine search parameters with user preferences for enhanced sorting
      const enhancedParams = {
        ...searchParams,
        ...userPreferences
      };
      const rides = await api.searchRides(enhancedParams || {});
      setAvailableRides(rides);
    } catch (error) {
      console.error('Failed to refresh available rides:', error);
    }
  }, [isAuthenticated]);

  const refreshUpcomingRides = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const rides = await api.getUpcomingRides();
      setUpcomingRides(rides);
    } catch (error) {
      console.error('Failed to refresh upcoming rides:', error);
    }
  }, [isAuthenticated]);

  const refreshPastRides = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const rides = await api.getPastRides();
      setPastRides(rides);
    } catch (error) {
      console.error('Failed to refresh past rides:', error);
    }
  }, [isAuthenticated]);

  const refreshMyRideRequests = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const requests = await api.getMyRideRequests();
      setMyRideRequests(requests);
    } catch (error) {
      console.error('Failed to refresh ride requests:', error);
    }
  }, [isAuthenticated]);

  const refreshMyVehicles = useCallback(async () => {
    if (!isAuthenticated || currentRole !== 'driver') return;
    try {
      const vehicles = await api.getMyVehicles();
      setMyVehicles(vehicles);
    } catch (error) {
      console.error('Failed to refresh vehicles:', error);
    }
  }, [isAuthenticated, currentRole]);

  const getMyVehicles = useCallback(async () => {
    if (!isAuthenticated || currentRole !== 'driver') return [];
    try {
      const vehicles = await api.getMyVehicles();
      setMyVehicles(vehicles);
      return vehicles;
    } catch (error) {
      console.error('Failed to get vehicles:', error);
      return [];
    }
  }, [isAuthenticated, currentRole]);

  const refreshReviews = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [given, received] = await Promise.all([
        api.getReviewsGiven(),
        api.getReviewsReceived(),
      ]);
      setReviewsGiven(given);
      setReviewsReceived(received);
    } catch (error) {
      console.error('Failed to refresh reviews:', error);
    }
  }, [isAuthenticated]);

  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const txns = await api.getTransactions();
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  }, [isAuthenticated]);

  // Action Functions
  const createRide = useCallback(async (rideData: any) => {
    setIsLoading(true);
    try {
      const ride = await api.createRide(rideData);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const updateRide = useCallback(async (rideId: number, rideData: any) => {
    setIsLoading(true);
    try {
      const ride = await api.updateRide(rideId, rideData);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const cancelRide = useCallback(async (rideId: number) => {
    setIsLoading(true);
    try {
      const ride = await api.cancelRide(rideId);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const confirmRide = useCallback(async (rideId: number) => {
    setIsLoading(true);
    try {
      const ride = await api.confirmRide(rideId);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const activateRide = useCallback(async (rideId: number) => {
    setIsLoading(true);
    try {
      const ride = await api.activateRide(rideId);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const completeRide = useCallback(async (rideId: number) => {
    setIsLoading(true);
    try {
      const ride = await api.completeRide(rideId);
      await refreshMyRides();
      return ride;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRides]);

  const createRideRequest = useCallback(async (requestData: any) => {
    setIsLoading(true);
    try {
      const request = await api.createRideRequest(requestData);
      await refreshMyRideRequests();
      return request;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRideRequests]);

  const acceptRideRequest = useCallback(async (requestId: number) => {
    setIsLoading(true);
    try {
      const request = await api.acceptRideRequest(requestId);
      await refreshMyRideRequests();
      return request;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRideRequests]);

  const rejectRideRequest = useCallback(async (requestId: number) => {
    setIsLoading(true);
    try {
      const request = await api.rejectRideRequest(requestId);
      await refreshMyRideRequests();
      return request;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRideRequests]);

  const completeRideRequest = useCallback(async (requestId: number) => {
    setIsLoading(true);
    try {
      const request = await api.completeRideRequest(requestId);
      await refreshMyRideRequests();
      return request;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyRideRequests]);

  const createVehicle = useCallback(async (vehicleData: any) => {
    setIsLoading(true);
    try {
      const vehicle = await api.createVehicle(vehicleData);
      await refreshMyVehicles();
      return vehicle;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyVehicles]);

  const updateVehicle = useCallback(async (vehicleId: number, vehicleData: any) => {
    setIsLoading(true);
    try {
      const vehicle = await api.updateVehicle(vehicleId, vehicleData);
      await refreshMyVehicles();
      return vehicle;
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyVehicles]);

  const deleteVehicle = useCallback(async (vehicleId: number) => {
    setIsLoading(true);
    try {
      await api.deleteVehicle(vehicleId);
      await refreshMyVehicles();
    } finally {
      setIsLoading(false);
    }
  }, [refreshMyVehicles]);

  const createRating = useCallback(async (ratingData: any) => {
    setIsLoading(true);
    try {
      const rating = await api.createRating(ratingData);
      await refreshReviews();
      return rating;
    } finally {
      setIsLoading(false);
    }
  }, [refreshReviews]);

  const addMoneyToWallet = useCallback(async (amount: number) => {
    setIsLoading(true);
    try {
      const result = await api.addMoneyToWallet(amount);
      await refreshWalletBalance();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshWalletBalance]);

  const updateProfile = useCallback(async (profileData: any) => {
    setIsLoading(true);
    try {
      const profile = await api.updateProfile(profileData);
      setUserProfile(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData: any) => {
    setIsLoading(true);
    try {
      const result = await api.changePassword(passwordData);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (role: 'driver' | 'passenger') => {
    setIsLoading(true);
    try {
      const result = await api.selectRole({ user_type: role.toUpperCase() });
      await refreshUserProfile(); // Refresh profile after role update
      
      // Update the current role in AuthContext to trigger navigation change
      updateCurrentRole(role);
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserProfile, updateCurrentRole]);

  const clearAllData = useCallback(() => {
    setUserProfile(null);
    setWalletBalance(0);
    setMyRides([]);
    setAvailableRides([]);
    setUpcomingRides([]);
    setPastRides([]);
    setMyRideRequests([]);
    setMyVehicles([]);
    setReviewsGiven([]);
    setReviewsReceived([]);
    setTransactions([]);
  }, []);

  // Data Sync Functions
  const syncAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsRefreshing(true);
      const syncData = await optimizedDataSyncService.smartSync();
      
      // Update state with synced data
      if (syncData.userProfile) setUserProfile(syncData.userProfile);
      if (syncData.walletBalance !== undefined) setWalletBalance(syncData.walletBalance);
      if (syncData.myRides) setMyRides(syncData.myRides);
      if (syncData.availableRides) setAvailableRides(syncData.availableRides);
      if (syncData.upcomingRides) setUpcomingRides(syncData.upcomingRides);
      if (syncData.pastRides) setPastRides(syncData.pastRides);
      if (syncData.myRideRequests) setMyRideRequests(syncData.myRideRequests);
      if (syncData.myVehicles) setMyVehicles(syncData.myVehicles);
      if (syncData.reviewsGiven) setReviewsGiven(syncData.reviewsGiven);
      if (syncData.reviewsReceived) setReviewsReceived(syncData.reviewsReceived);
      if (syncData.transactions) setTransactions(syncData.transactions);
    } catch (error) {
      console.error('Failed to sync all data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated]);

  const syncSpecificData = useCallback(async (dataType: string) => {
    if (!isAuthenticated) return;
    try {
      const data = await optimizedDataSyncService.forceSyncDataType(dataType);
      
      // Update specific state based on data type
      switch (dataType) {
        case 'userProfile':
          setUserProfile(data);
          break;
        case 'walletBalance':
          setWalletBalance(data.balance);
          break;
        case 'myRides':
          setMyRides(data);
          break;
        case 'availableRides':
          setAvailableRides(data);
          break;
        case 'upcomingRides':
          setUpcomingRides(data);
          break;
        case 'pastRides':
          setPastRides(data);
          break;
        case 'myRideRequests':
          setMyRideRequests(data);
          break;
        case 'myVehicles':
          setMyVehicles(data);
          break;
        case 'reviewsGiven':
          setReviewsGiven(data);
          break;
        case 'reviewsReceived':
          setReviewsReceived(data);
          break;
        case 'transactions':
          setTransactions(data);
          break;
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to sync ${dataType}:`, error);
      throw error;
    }
  }, [isAuthenticated]);

  const loadFromStorage = useCallback(async () => {
    try {
      const storedData = await optimizedDataSyncService.loadFromStorage();
      
      // Update state with stored data
      if (storedData.userProfile) setUserProfile(storedData.userProfile);
      if (storedData.walletBalance !== undefined) setWalletBalance(storedData.walletBalance);
      if (storedData.myRides) setMyRides(storedData.myRides);
      if (storedData.availableRides) setAvailableRides(storedData.availableRides);
      if (storedData.upcomingRides) setUpcomingRides(storedData.upcomingRides);
      if (storedData.pastRides) setPastRides(storedData.pastRides);
      if (storedData.myRideRequests) setMyRideRequests(storedData.myRideRequests);
      if (storedData.myVehicles) setMyVehicles(storedData.myVehicles);
      if (storedData.reviewsGiven) setReviewsGiven(storedData.reviewsGiven);
      if (storedData.reviewsReceived) setReviewsReceived(storedData.reviewsReceived);
      if (storedData.transactions) setTransactions(storedData.transactions);
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  }, []);

  // Initial data loading when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsRefreshing(true);
      Promise.all([
        refreshUserProfile(),
        refreshWalletBalance(),
        refreshMyRides(),
        refreshUpcomingRides(),
        refreshPastRides(),
        refreshMyRideRequests(),
        refreshReviews(),
        refreshTransactions(),
      ]).finally(() => {
        setIsRefreshing(false);
      });
    } else {
      clearAllData();
    }
  }, [isAuthenticated, user]);

  // Load vehicles for drivers
  useEffect(() => {
    if (isAuthenticated && currentRole === 'driver') {
      refreshMyVehicles();
    }
  }, [isAuthenticated, currentRole, refreshMyVehicles]);


    const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

    const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
          ' Make sure your location is enabled.',
        );
        setLocation(defaultLocation);

      }
    );
  }

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fineGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        const coarseGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;

        if (fineGranted || coarseGranted) {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Please enable location permissions in settings to use this feature.'
          );
          setLocation(defaultLocation);
        }
      } else {
        // iOS or other platforms: attempt location directly (iOS auto-prompts)
        getCurrentLocation();
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      setLocation(defaultLocation);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, [])

  return (
    <AppContext.Provider value={{
      destinationLocation, 
      setDestinationLocation,
      source,
      setSource,
      location,
      defaultLocation,
      destination,
      setDestination,
      setLocation,
      getCurrentLocation,
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
      isLoading,
      isRefreshing,
      refreshUserProfile,
      refreshWalletBalance,
      refreshMyRides,
      refreshAvailableRides,
      refreshUpcomingRides,
      refreshPastRides,
      refreshMyRideRequests,
      refreshMyVehicles,
      refreshReviews,
      refreshTransactions,
      createRide,
      updateRide,
      cancelRide,
      confirmRide,
      activateRide,
      completeRide,
      createRideRequest,
      acceptRideRequest,
      rejectRideRequest,
      completeRideRequest,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      getMyVehicles,
      createRating,
      addMoneyToWallet,
      updateProfile,
      changePassword,
      updateUserRole,
      clearAllData,
      syncAllData,
      syncSpecificData,
      loadFromStorage,
      smartSync: optimizedDataSyncService.smartSync.bind(optimizedDataSyncService),
      forceSyncDataType: optimizedDataSyncService.forceSyncDataType.bind(optimizedDataSyncService),
      backgroundSync: optimizedDataSyncService.backgroundSync.bind(optimizedDataSyncService),
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 