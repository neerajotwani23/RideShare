import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { GOOGLE_API_KEY_EXPORT as GOOGLE_API_KEY } from '../../config/env';
import axios from 'axios';
import Icon from '../../components/Icon';
import Geolocation from '@react-native-community/geolocation';

type LocationSelectionParams = {
  type: 'from' | 'to';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  from?: string;
  to?: string;
  fromCoords?: {
    latitude: number;
    longitude: number;
  };
  toCoords?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelected?: (selectedLocation: any) => void;
};

const LocationSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ LocationSelection: LocationSelectionParams }, 'LocationSelection'>>();
  const { type, currentLocation } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation?.latitude || 33.6844,
    longitude: currentLocation?.longitude || 73.0479,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [centerLocation, setCenterLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);

  // Initialize center location when component mounts
  useEffect(() => {
    const initializeCenterLocation = async () => {
      let initialCoords;
      
      if (currentLocation?.latitude && currentLocation?.longitude) {
        // Use the current location passed from parent screen
        initialCoords = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };
      } else {
        // Try to get current location directly
        try {
          const position = await new Promise<any>((resolve, reject) => {
            Geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 10,
              }
            );
          });
          
          initialCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.log('Could not get current location, using fallback');
          // Fallback to Islamabad only if we can't get current location
          initialCoords = {
            latitude: 33.6844,
            longitude: 73.0479,
          };
        }
      }
      
      const address = await getAddressFromCoordinates(initialCoords.latitude, initialCoords.longitude);
      setCenterLocation({
        ...initialCoords,
        name: address || 'Unknown Location',
      });
      
      // Update map region to show the current location
      setMapRegion({
        latitude: initialCoords.latitude,
        longitude: initialCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };
    
    initializeCenterLocation();
  }, [currentLocation]);

  // Search places using Google Places API
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      const locationBias = currentLocation ? 
        `&location=${currentLocation.latitude},${currentLocation.longitude}&radius=50000` : '';
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&types=establishment|geocode&components=country:pk${locationBias}`
      );
      
      if (response.data.predictions) {
        return response.data.predictions.map((prediction: any) => prediction.description);
      }
      return [];
    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  };

  // Get coordinates for a place name
  const getPlaceCoordinates = async (placeName: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${GOOGLE_API_KEY}`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding API error:', error);
      return null;
    }
  };



  // Handle map region change
  const handleMapRegionChange = async (region: any) => {
    setMapRegion(region);
    
    // Get the center coordinates
    const centerCoords = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    
    // Get address for the center location
    const address = await getAddressFromCoordinates(centerCoords.latitude, centerCoords.longitude);
    
    setCenterLocation({
      ...centerCoords,
      name: address || 'Unknown Location',
    });
  };

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      
      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding API error:', error);
      return null;
    }
  };

  // Handle search input change
  const handleSearchChange = async (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(true);
    
    if (text.length >= 2) {
      const results = await searchPlaces(text);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  // Select a place from suggestions
  const selectPlace = async (place: string) => {
    setSearchQuery(place);
    setShowSuggestions(false);
    
    const coords = await getPlaceCoordinates(place);
    if (coords) {
      setSelectedLocation({
        ...coords,
        name: place,
      });
      
      // Update map region to show the selected location
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Handle marker drag end
  const handleMarkerDragEnd = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation(prev => prev ? {
      ...prev,
      latitude,
      longitude,
    } : null);
  };

  // Confirm location selection
  const confirmLocation = () => {
    console.log('📍 confirmLocation called');
    console.log('📍 centerLocation:', centerLocation);
    console.log('📍 type:', type);
    
    if (centerLocation) {
      // Get current locations from the calling screen to preserve them
      const currentParams = route.params;
      console.log('📍 currentParams:', currentParams);
      
      // Call the callback function with selected location data
      const selectedLocation = {
        type: type,
        name: centerLocation.name,
        coords: {
          latitude: centerLocation.latitude,
          longitude: centerLocation.longitude,
        }
      };
      
      console.log('📍 Selected location data:', selectedLocation);
      
      // Call the callback if it exists
      if (currentParams?.onLocationSelected) {
        console.log('📍 Calling onLocationSelected callback');
        currentParams.onLocationSelected(selectedLocation);
      }
      
      console.log('📍 About to go back');
      
      // Go back
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please select a location first');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Select {type === 'from' ? 'Pickup' : 'Drop-off'} Location
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </View>
        
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectPlace(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={handleMapRegionChange}
          mapType="standard"
          userInterfaceStyle="light"
        >
          {/* Current Location Marker - Blue Circle */}
          {currentLocation && (
            <Marker coordinate={currentLocation}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#0A80ED',
                borderWidth: 3,
                borderColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }} />
            </Marker>
          )}
        </MapView>
        
        {/* Fixed Center Marker */}
        <View style={styles.centerMarker}>
          <Icon name="map-marker" size={30} color="#FF3B30" />
        </View>
      </View>

      {/* Center Location Info */}
      {centerLocation && (
        <Card style={styles.locationCard}>
          <Card.Content>
            <Text style={styles.locationTitle}>
              {type === 'from' ? 'Pickup' : 'Drop-off'} Location
            </Text>
            <Text style={styles.locationName}>{centerLocation.name}</Text>
            <Text style={styles.locationCoords}>
              {centerLocation.latitude.toFixed(6)}, {centerLocation.longitude.toFixed(6)}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={confirmLocation}
          disabled={!centerLocation}
          style={[
            styles.confirmButton,
            !centerLocation && styles.disabledButton
          ]}
          labelStyle={styles.buttonText}
        >
          Confirm {type === 'from' ? 'Pickup' : 'Drop-off'} Location
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.accent,
    fontFamily: 'Montserrat-Medium',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textPrimary,
    backgroundColor: 'transparent',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  locationCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.accent,
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 4,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default LocationSelectionScreen; 