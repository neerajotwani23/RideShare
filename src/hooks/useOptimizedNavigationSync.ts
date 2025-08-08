import { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { optimizedDataSyncService } from '../services/optimizedDataSyncService';

// Screen-specific data requirements
const SCREEN_DATA_REQUIREMENTS = {
  'Find Ride': ['availableRides', 'userProfile'],
  'Post Ride': ['userProfile', 'myVehicles'],
  'My Rides': ['myRides', 'upcomingRides', 'pastRides'],
  'Wallet': ['walletBalance', 'transactions'],
  'Chat': ['userProfile'], // Minimal data for chat
  'Profile': ['userProfile', 'reviewsGiven', 'reviewsReceived'],
  'Ride Details': ['userProfile'], // Will be passed as props
  'Edit Profile': ['userProfile'],
  'Settings': ['userProfile'],
  'Help & Support': ['userProfile'],
  'Reviews': ['reviewsGiven', 'reviewsReceived'],
  'Notifications': ['userProfile'],
  'Change Password': ['userProfile'],
  'Vehicle Details': ['myVehicles'],
  'Booking Details': ['userProfile'], // Will be passed as props
  'Rate Ride': ['userProfile'], // Will be passed as props
  'During Ride': ['userProfile'], // Will be passed as props
  'Suggested Rides': ['availableRides', 'userProfile'],
};

export const useOptimizedNavigationSync = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const lastSyncTime = useRef<number>(0);
  const SYNC_COOLDOWN = 15000; // Reduced to 15 seconds for better responsiveness

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const now = Date.now();
      
      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current > SYNC_COOLDOWN) {
        const screenName = route.name;
        const requiredDataTypes = SCREEN_DATA_REQUIREMENTS[screenName as keyof typeof SCREEN_DATA_REQUIREMENTS];
        
        if (requiredDataTypes) {
          console.log(`🔄 Screen focused: ${screenName}, syncing required data:`, requiredDataTypes);
          
          // Use smart sync with only required data types
          optimizedDataSyncService.smartSync(requiredDataTypes)
            .then(() => {
              console.log(`✅ Data synced for ${screenName}`);
            })
            .catch((error) => {
              console.warn(`Failed to sync data for ${screenName}:`, error);
            });
          
          lastSyncTime.current = now;
        } else {
          console.log(`ℹ️ No specific data requirements for screen: ${screenName}`);
        }
      } else {
        console.log(`⏱️ Skipping sync for ${route.name} (cooldown active)`);
      }
    });

    return unsubscribe;
  }, [navigation, route.name]);

  return {
    syncScreenData: (screenName: string) => {
      const requiredDataTypes = SCREEN_DATA_REQUIREMENTS[screenName as keyof typeof SCREEN_DATA_REQUIREMENTS];
      if (requiredDataTypes) {
        return optimizedDataSyncService.smartSync(requiredDataTypes);
      }
      return Promise.resolve({});
    },
    forceSyncDataType: (dataType: string) => {
      return optimizedDataSyncService.forceSyncDataType(dataType);
    },
    backgroundSync: () => {
      optimizedDataSyncService.backgroundSync();
    },
  };
}; 