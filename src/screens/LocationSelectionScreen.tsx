import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import MapView, { Marker, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_API_KEY_EXPORT as GOOGLE_API_KEY } from '../config/env';
import { COLORS } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LocationSelectionScreenProps {
  navigation: any;
  route: any;
}

const LocationSelectionScreen = ({ navigation, route }: LocationSelectionScreenProps) => {
  const { type, initialValue } = route.params; // 'from' or 'to'
  
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [searchText, setSearchText] = useState(initialValue || '');
  const [mapRegion, setMapRegion] = useState<any>(null);

  // Get current location on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        }
      } else {
        // iOS or other platforms: attempt location directly (iOS auto-prompts)
        getCurrentLocation();
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setCurrentLocation(location);
        setMapRegion(location);
      },
      error => {
        console.error('Location error:', error);
        // Set default location to Pakistan (Islamabad area)
        const defaultLocation = {
          latitude: 33.6844,
          longitude: 73.0479,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setCurrentLocation(defaultLocation);
        setMapRegion(defaultLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 10,
      }
    );
  };

  const handleLocationSelect = (data: any, details: any = null) => {
    if (details?.geometry?.location) {
      const location = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setSelectedLocation(location);
      setMapRegion(location);
      setSearchText(data.description);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // Call the callback with the selected location data
      if (route.params?.onLocationSelected) {
        route.params.onLocationSelected({
          type,
          name: searchText,
          coords: selectedLocation,
        });
      }
      // Go back to the previous screen
      navigation.goBack();
    } else {
      Alert.alert('Please select a location');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button 
          mode="text" 
          onPress={handleBack}
          style={styles.backButton}
        >
          Cancel
        </Button>
        <Text style={styles.headerTitle}>
          Select {type === 'from' ? 'Pickup' : 'Drop-off'} Location
        </Text>
        <Button 
          mode="contained" 
          onPress={handleConfirm}
          disabled={!selectedLocation}
          style={styles.confirmButton}
        >
          Confirm
        </Button>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder={`Search for ${type === 'from' ? 'pickup' : 'drop-off'} location`}
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
            country: 'pk',
            location: currentLocation ? `${currentLocation.latitude},${currentLocation.longitude}` : undefined,
            radius: '50000', // 50km radius
          }}
          enablePoweredByContainer={false}
          minLength={2}
          predefinedPlaces={[]}
          predefinedPlacesAlwaysVisible={false}
          currentLocation={true}
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch"
          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
          GoogleReverseGeocodingQuery={{}}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
          debounce={200}
          listViewDisplayed="auto"
          textInputProps={{
            value: searchText,
            onChangeText: setSearchText,
          }}
          styles={googlePlacesStyles}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={false}
            mapType="standard"
            userInterfaceStyle="light"
          >
            {/* Current location circle */}
            {currentLocation && (
              <Circle
                center={currentLocation}
                radius={100}
                fillColor="rgba(0, 122, 255, 0.2)"
                strokeColor="rgba(0, 122, 255, 0.5)"
                strokeWidth={2}
              />
            )}

            {/* Selected location marker */}
            {selectedLocation && (
              <Marker coordinate={selectedLocation}>
                <FontAwesome6 
                  name="map-marker" 
                  size={32} 
                  color={type === 'from' ? '#007AFF' : '#34C759'} 
                />
              </Marker>
            )}
          </MapView>
        )}
      </View>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    flex: 1,
    textAlign: 'center',
  },
  confirmButton: {
    minWidth: 80,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

const googlePlacesStyles = {
  container: {
    flex: 1,
    position: 'relative',
  },
  textInputContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    height: 40,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  listView: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  row: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: COLORS.secondary,
  },
  predefinedPlacesDescription: {
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  poweredContainer: {
    display: 'none',
  },
  powered: {
    display: 'none',
  },
};

export default LocationSelectionScreen; 