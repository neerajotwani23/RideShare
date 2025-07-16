import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
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
  refreshAvailableRides: (searchParams?: any) => Promise<void>;
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
  
  // Rating Actions
  createRating: (ratingData: any) => Promise<any>;
  
  // Wallet Actions
  addMoneyToWallet: (amount: number) => Promise<any>;
  
  // Profile Actions
  updateProfile: (profileData: any) => Promise<any>;
  changePassword: (passwordData: any) => Promise<any>;
  
  // Utility
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, currentRole } = useAuth();
  
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

  const refreshAvailableRides = useCallback(async (searchParams?: any) => {
    if (!isAuthenticated) return;
    try {
      const rides = await api.searchRides(searchParams || {});
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

  return (
    <AppContext.Provider value={{
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
      createRating,
      addMoneyToWallet,
      updateProfile,
      changePassword,
      clearAllData,
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