import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapState {
  location: any;
  sourceCoords: any;
  destinationCoords: any;
  mapRegion: any;
  isReady: boolean;
}

interface MapContextType {
  mapState: MapState;
  setLocation: (location: any) => void;
  setSourceCoords: (coords: any) => void;
  setDestinationCoords: (coords: any) => void;
  setMapRegion: (region: any) => void;
  setMapReady: (ready: boolean) => void;
  initializeMap: () => void;
  resetMap: () => void;
  calculateMapRegion: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapState, setMapState] = useState<MapState>({
    location: null,
    sourceCoords: null,
    destinationCoords: null,
    mapRegion: null,
    isReady: false,
  });

  const isInitialized = useRef(false);

  // Save map state to AsyncStorage
  const saveMapStateToStorage = async (state: MapState) => {
    try {
      await AsyncStorage.setItem('map_location', JSON.stringify(state.location));
      await AsyncStorage.setItem('map_region', JSON.stringify(state.mapRegion));
      await AsyncStorage.setItem('map_is_ready', JSON.stringify(state.isReady));
      console.log('�� Map state saved to storage');
    } catch (error) {
      console.error('�� Failed to save map state:', error);
    }
  };

  // Load map state from AsyncStorage
  const loadMapStateFromStorage = async () => {
    try {
      const [location, region, isReady] = await Promise.all([
        AsyncStorage.getItem('map_location'),
        AsyncStorage.getItem('map_region'),
        AsyncStorage.getItem('map_is_ready'),
      ]);

      if (location) {
        const savedState = {
          location: JSON.parse(location),
          sourceCoords: null,
          destinationCoords: null,
          mapRegion: region ? JSON.parse(region) : null,
          isReady: isReady ? JSON.parse(isReady) : false,
        };
        console.log('📍 Map state loaded from storage:', savedState);
        return savedState;
      }
      return null;
    } catch (error) {
      console.error('�� Failed to load map state:', error);
      return null;
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    console.log('📍 Getting current location...');
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Location received:', { latitude, longitude });
        
        const currentLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setLocation(currentLocation);
        
        if (!mapState.mapRegion) {
          setMapRegion(currentLocation);
        }
        
        console.log('📍 Current location set successfully');
      },
      (error) => {
        console.error('📍 Location error:', error);
        
        // Set default region (Karachi)
        const defaultRegion = {
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        
        setLocation(defaultRegion);
        if (!mapState.mapRegion) {
          setMapRegion(defaultRegion);
        }
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
        distanceFilter: 50
      }
    );
  };

  // Initialize map
  const initializeMap = async () => {
    if (isInitialized.current) {
      console.log('📍 Map already initialized');
      return;
    }

    console.log('📍 Initializing map...');
    isInitialized.current = true;
    
    // Try to load saved state first
    const savedState = await loadMapStateFromStorage();
    if (savedState && savedState.location) {
      console.log('📍 Restoring map state from storage');
      setMapState(savedState);
    } else {
      console.log('📍 No saved state, getting current location');
      getCurrentLocation();
    }
  };

  // Reset map
  const resetMap = async () => {
    console.log('📍 Resetting map state');
    isInitialized.current = false;
    
    const resetState = {
      location: null,
      sourceCoords: null,
      destinationCoords: null,
      mapRegion: null,
      isReady: false,
    };
    setMapState(resetState);
    
    // Clear storage
    try {
      await AsyncStorage.multiRemove(['map_location', 'map_region', 'map_is_ready']);
      console.log('📍 Map state cleared from storage');
    } catch (error) {
      console.error('📍 Failed to clear map state:', error);
    }
  };

  // State setters with storage persistence
  const setLocation = (location: any) => {
    setMapState(prev => {
      const newState = { ...prev, location };
      saveMapStateToStorage(newState);
      return newState;
    });
  };

  const setSourceCoords = (coords: any) => {
    setMapState(prev => {
      const newState = { ...prev, sourceCoords: coords };
      saveMapStateToStorage(newState);
      return newState;
    });
  };

  const setDestinationCoords = (coords: any) => {
    setMapState(prev => {
      const newState = { ...prev, destinationCoords: coords };
      saveMapStateToStorage(newState);
      return newState;
    });
  };

  const setMapRegion = (region: any) => {
    setMapState(prev => {
      const newState = { ...prev, mapRegion: region };
      saveMapStateToStorage(newState);
      return newState;
    });
  };

  const setMapReady = (ready: boolean) => {
    setMapState(prev => {
      const newState = { ...prev, isReady: ready };
      saveMapStateToStorage(newState);
      return newState;
    });
  };

  const calculateMapRegion = () => {
    // This function can be used to calculate optimal map region
    // based on source and destination coordinates
    console.log('📍 Calculating map region');
  };

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      const savedState = await loadMapStateFromStorage();
      if (savedState && savedState.location) {
        console.log('📍 Loading saved map state on mount');
        setMapState(savedState);
        isInitialized.current = true;
      }
    };
    loadSavedState();
  }, []);

  const value: MapContextType = {
    mapState,
    setLocation,
    setSourceCoords,
    setDestinationCoords,
    setMapRegion,
    setMapReady,
    initializeMap,
    resetMap,
    calculateMapRegion,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};