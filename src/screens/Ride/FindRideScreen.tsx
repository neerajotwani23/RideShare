import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform, ScrollView, Alert, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { useOptimizedNavigationSync } from '../../hooks/useOptimizedNavigationSync';
import { Text, Card, Divider, Chip, TextInput, Switch } from 'react-native-paper';
import Icon from '../../components/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { ToggleButton } from '../../components';
import MapView, { Marker, Circle } from 'react-native-maps';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_API_KEY_EXPORT as GOOGLE_API_KEY } from '../../config/env';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const recentAddresses = [
  { id: 1, label: 'Enter New Address', sub: '' },
  { id: 2, label: 'Marin County', sub: 'CA, USA' },
];

const mockResults = [
  {
    id: 1,
    driver: 'Sarah Ahmed',
    rating: 4.9,
    from: 'Downtown',
    to: 'Campus',
    departureTime: '09:00 AM',
    availableSeats: 2,
    fare: 200,
    car: 'Toyota Corolla',
    preferences: ['AC', 'No Smoking'],
  },
  {
    id: 2,
    driver: 'Ali Hassan',
    rating: 4.7,
    from: 'City Center',
    to: 'University',
    departureTime: '09:15 AM',
    availableSeats: 1,
    fare: 180,
    car: 'Honda Civic',
    preferences: ['Music OK', 'AC'],
  },
];

const FindRideScreen = ({ navigation, route }: any) => {
  // Navigation sync hook
  useOptimizedNavigationSync();
  
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceCoords, setSourceCoords] = useState<any>(null);
  const [destinationCoords, setDestinationCoords] = useState<any>(null);
  const [mapRegion, setMapRegion] = useState<any>(null);

  const [rideType, setRideType] = useState<'now' | 'schedule'>('now');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [ac, setAc] = useState(false);
  const [music, setMusic] = useState(false);
  const [smoking, setSmoking] = useState(false);

  // Handle parameters passed from location selection screen
  useEffect(() => {
    if (route?.params) {
      const { source: paramSource, destination: paramDestination, sourceCoords: paramSourceCoords, destinationCoords: paramDestinationCoords } = route.params;

      if (paramSource) {
        setSource(paramSource);
        setSourceCoords(paramSourceCoords);
      }
      if (paramDestination) {
        setDestination(paramDestination);
        setDestinationCoords(paramDestinationCoords);
      }
    }
  }, [route?.params]);

  // Update map region when locations change
  useEffect(() => {
    updateMapRegion();
  }, [currentLocation, sourceCoords, destinationCoords]);

  const updateMapRegion = () => {
    if (!currentLocation) return;

    let newRegion;
    
    if (sourceCoords && destinationCoords) {
      // Both locations selected - show both with zoomed out view
      const midLat = (sourceCoords.latitude + destinationCoords.latitude) / 2;
      const midLng = (sourceCoords.longitude + destinationCoords.longitude) / 2;
      const latDelta = Math.abs(sourceCoords.latitude - destinationCoords.latitude) * 1.5;
      const lngDelta = Math.abs(sourceCoords.longitude - destinationCoords.longitude) * 1.5;
      
      newRegion = {
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      };
    } else if (sourceCoords) {
      // Only source selected
      newRegion = {
        latitude: sourceCoords.latitude,
        longitude: sourceCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } else if (destinationCoords) {
      // Only destination selected
      newRegion = {
        latitude: destinationCoords.latitude,
        longitude: destinationCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } else {
      // No locations selected - show current location
      newRegion = currentLocation;
    }
    
    setMapRegion(newRegion);
  };

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
        // Set default location
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

  const handleLocationPress = (type: 'from' | 'to') => {
    navigation.navigate('LocationSelection', {
      type,
      currentLocation: currentLocation,
      initialValue: type === 'from' ? source : destination,
      onLocationSelected: (data: any) => {
        if (data.type === 'from') {
          setSource(data.name);
          setSourceCoords(data.coords);
        } else {
          setDestination(data.name);
          setDestinationCoords(data.coords);
        }
      }
    });
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSearch = async () => {
    try {
      // Prepare search parameters with user preferences
      const searchParams: any = {};
      
      if (source.trim()) {
        searchParams.source = source.trim();
      }
      if (destination.trim()) {
        searchParams.destination = destination.trim();
      }
      
      // Add date and time for scheduled rides
      if (rideType === 'schedule') {
        const searchDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        searchParams.date = searchDate;
      }
      
      // Add user preferences for smart sorting
      if (ac) searchParams.ac = true;
      if (music) searchParams.music = true;
      if (!smoking) searchParams.smoking = false; // No smoking preference
      
      // Navigate to SuggestedRides with search parameters
      navigation.navigate('SuggestedRides', { 
        searchParams,
        userPreferences: {
          ac,
          music,
          smoking: !smoking, // Convert to smoking preference
          preferred_time: rideType === 'schedule' ? time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }) : undefined
        }
      });
    } catch (error) {
      console.error('Error preparing search:', error);
      // Fallback to basic navigation
      navigation.navigate('SuggestedRides');
    }
  };

  // Initialize location on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Use focus effect to ensure this screen doesn't interfere with other screens' map state
  useFocusEffect(
    React.useCallback(() => {
      console.log('📍 FindRideScreen focused - using local map state only');
      // This screen uses its own local map state, so it won't interfere with MapContext
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapPlaceholder}>
        {mapRegion && (
          <MapView
            style={{ flex: 1 }}
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

            {/* Source location marker (blue) */}
            {sourceCoords && (
              <Marker coordinate={sourceCoords}>
                <FontAwesome6 name="map-marker" size={32} color="#007AFF" />
              </Marker>
            )}

            {/* Destination location marker (green) */}
            {destinationCoords && (
              <Marker coordinate={destinationCoords}>
                <FontAwesome6 name="map-marker" size={32} color="#34C759" />
              </Marker>
            )}
          </MapView>
        )}
      </View>

      <View style={styles.menuSection}>
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            overScrollMode="always"
            style={{ flex: 1 }}
          >
            <View style={styles.form}>
              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => handleLocationPress('from')}
              >
                <Icon name="map-marker" size={20} color={COLORS.accent} style={styles.inputIcon} />
                <View style={styles.locationInput}>
                  <Text style={styles.locationLabel}>From (Pickup Location)</Text>
                  <Text style={styles.locationValue}>
                    {source || 'Tap to select pickup location'}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => handleLocationPress('to')}
              >
                <Icon name="map-marker-check" size={20} color={COLORS.success} style={styles.inputIcon} />
                <View style={styles.locationInput}>
                  <Text style={styles.locationLabel}>To (Drop-off Location)</Text>
                  <Text style={styles.locationValue}>
                    {destination || 'Tap to select drop-off location'}
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>When do you want to travel?</Text>
              
              <View style={styles.toggleRow}>
                <ToggleButton
                  label="Right Now"
                  isActive={rideType === 'now'}
                  onPress={() => setRideType('now')}
                />
                <ToggleButton
                  label="Schedule"
                  isActive={rideType === 'schedule'}
                  onPress={() => setRideType('schedule')}
                />
              </View>

              {rideType === 'schedule' && (
                <Card style={styles.scheduleCard}>
                  <Card.Content>
                    <Text style={styles.scheduleTitle}>Select Date & Time</Text>
                    <View style={styles.timeRow}>
                      <TouchableOpacity
                        style={[styles.dateTimeButton, styles.halfInput]}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <View style={styles.dateTimeContent}>
                          <Icon name="calendar" size={20} color="#248CFE" />
                          <Text style={styles.dateTimeLabel}>Date</Text>
                          <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.dateTimeButton, styles.halfInput]}
                        onPress={() => setShowTimePicker(true)}
                      >
                        <View style={styles.dateTimeContent}>
                          <Icon name="clock-outline" size={20} color="#248CFE" />
                          <Text style={styles.dateTimeLabel}>Time</Text>
                          <Text style={styles.dateTimeValue}>{formatTime(time)}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              )}

              <Card style={styles.preferencesCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>Ride Preferences</Text>
                  <View style={styles.preferenceItem}>
                    <View style={styles.preferenceContent}>
                      <Icon name="snowflake" size={20} color="#248CFE" />
                      <Text style={styles.preferenceText}>Air Conditioning</Text>
                    </View>
                    <Switch
                      value={ac}
                      onValueChange={setAc}
                      trackColor={{ false: COLORS.border, true: '#248CFE' }}
                      thumbColor={COLORS.primary}
                    />
                  </View>

                  <View style={styles.preferenceItem}>
                    <View style={styles.preferenceContent}>
                      <Icon name="music" size={20} color="#FF9500" />
                      <Text style={styles.preferenceText}>Music Allowed</Text>
                    </View>
                    <Switch
                      value={music}
                      onValueChange={setMusic}
                      trackColor={{ false: COLORS.border, true: '#248CFE' }}
                      thumbColor={COLORS.primary}
                    />
                  </View>

                  <View style={styles.preferenceItem}>
                    <View style={styles.preferenceContent}>
                      <Icon name="smoking-off" size={20} color="#248CFE" />
                      <Text style={styles.preferenceText}>No Smoking</Text>
                    </View>
                    <Switch
                      value={!smoking}
                      onValueChange={(value) => setSmoking(!value)}
                      trackColor={{ false: COLORS.border, true: '#248CFE' }}
                      thumbColor={COLORS.primary}
                    />
                  </View>
                </Card.Content>
              </Card>

              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Search Rides</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  mapPlaceholder: {
    height: screenHeight * 0.35,
    backgroundColor: COLORS.lightGray,
  },
  menuSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.7,
    backgroundColor: 'transparent',
  },
  bottomSheet: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
    height: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  scheduleCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
  },
  dateTimeContent: {
    alignItems: 'flex-start',
  },
  dateTimeLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  preferencesCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  preferenceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  searchButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
});

export default FindRideScreen; 