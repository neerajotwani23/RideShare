import { useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export const useNavigationSync = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { syncAllData, syncSpecificData } = useApp();
  const lastSyncTime = useRef<number>(0);
  const SYNC_COOLDOWN = 30000; // 30 seconds cooldown between syncs

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const now = Date.now();
      
      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current > SYNC_COOLDOWN) {
        console.log(`🔄 Tab focused: ${route.name}, triggering data sync...`);
        
        // Sync all data when navigating to main tabs
        const mainTabs = [
          'Find Ride',
          'Post Ride', 
          'My Rides',
          'Wallet',
          'Chat',
          'Profile'
        ];
        
        if (mainTabs.includes(route.name)) {
          syncAllData();
          lastSyncTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [navigation, route.name, syncAllData]);

  return {
    syncAllData,
    syncSpecificData,
  };
}; 