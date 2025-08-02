import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Platform, TouchableOpacity, Alert, PermissionsAndroid, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Switch, HelperText, Card } from 'react-native-paper';
import Icon from '../../components/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useOptimizedNavigationSync } from '../../hooks/useOptimizedNavigationSync';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Geolocation from '@react-native-community/geolocation';
import { GOOGLE_API_KEY } from '../../config/env';
import { styles } from './PostRideScreenStyleSheet'

import Mapshow from './mapcomponent';

const PostRideScreen = ({ navigation, route }: any) => {
  // Navigation sync hook
  useOptimizedNavigationSync();


  // const [location, setLocation] = useState<any>(null);
  // const [destination, setDestination] = useState('');
  
  const [rideType, setRideType] = useState('now'); // 'now' or 'schedule'
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [seats, setSeats] = useState('');
  const [fare, setFare] = useState('');
  const [ac, setAc] = useState(false);
  const [music, setMusic] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [error, setError] = useState('');
  const [destselect, setDestselect] = useState(true);

  const { createRide, isLoading, location, setLocation, source,setSource,destination, setDestination,destinationLocation, defaultLocation } = useApp();


  // Handle parameters passed from chatbot
  useEffect(() => {
    if (route?.params) {
      const { source: paramSource, destination: paramDestination, fare: paramFare, seats: paramSeats, preferences } = route.params;

      if (paramSource) setSource(paramSource);
      if (paramDestination) setDestination(paramDestination);
      if (paramFare) setFare(paramFare.toString());
      if (paramSeats) setSeats(paramSeats.toString());

      if (preferences) {
        if (preferences.ac !== undefined) setAc(preferences.ac);
        if (preferences.music !== undefined) setMusic(preferences.music);
        if (preferences.smoking !== undefined) setSmoking(preferences.smoking);
      }
    }
  }, [route?.params]);

  const handlePost = async () => {
    if (!source || !destination || !seats || !fare) {
      setError('All fields are required.');
      return;
    }
    setError('');

    // Create timing datetime based on ride type
    let timing: Date;
    if (rideType === 'now') {
      timing = new Date(); // Current time
    } else {
      // Combine date and time for scheduled rides
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());
      combinedDateTime.setSeconds(0);
      combinedDateTime.setMilliseconds(0);
      timing = combinedDateTime;
    }

    const rideData = {
      timing: timing.toISOString(),
      source,
      destination,
      seats_offered: parseInt(seats),
      fare: parseFloat(fare),
      ac,
      music,
      smoking: smoking, // Backend expects smoking boolean directly
      gender_preference: 'any' // Default to any gender preference
    };

    try {
      await createRide(rideData);
      Alert.alert(
        'Success',
        'Your ride has been posted successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('SuggestedRides') }]
      );
    } catch (error: any) {
      console.error('Post ride error:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to post ride. Please try again.';
      setError(errorMessage);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
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

  // const defaultLocation = {
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // }

  // const getCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 0.01,
  //         longitudeDelta: 0.01,
  //       });
  //     },
  //     error => {
  //       Alert.alert(
  //         'Error',
  //         `Failed to get your location: ${error.message}` +
  //         ' Make sure your location is enabled.',
  //       );
  //       setLocation(defaultLocation);

  //     }
  //   );
  // }

  // const requestLocationPermission = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //       ]);

  //       const fineGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
  //       const coarseGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;

  //       if (fineGranted || coarseGranted) {
  //         getCurrentLocation();
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Please enable location permissions in settings to use this feature.'
  //         );
  //         setLocation(defaultLocation);
  //       }
  //     } else {
  //       // iOS or other platforms: attempt location directly (iOS auto-prompts)
  //       getCurrentLocation();
  //     }
  //   } catch (err) {
  //     console.warn('Permission request error:', err);
  //     setLocation(defaultLocation);
  //   }
  // };

  // useEffect(() => {
  //   requestLocationPermission();
  // }, [])

  // Error handler for Google Places Autocomplete
  const handleGooglePlacesError = (error: string) => {
    console.warn('Google Places Error:', error);
    // You can show a user-friendly message or handle the error as needed
    Alert.alert(
      'Location Service Error',
      'Unable to load location suggestions. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>

        <MapView
          style={{ flex: 1 }}
          // onRegionChangeComplete={(region) => {
          //   console.log('Region changed to:', region);
          //   // Update the location state with the new region's coordinates
          //   setLocation({
          //     latitude: region.latitude,
          //     longitude: region.longitude,
          //     latitudeDelta: region.latitudeDelta,
          //     longitudeDelta: region.longitudeDelta,
          //   });
          // }}
          region={location || defaultLocation}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomEnabled={true}
          zoomControlEnabled={true}

        >
          {location && (
            <Marker coordinate={location}>
              <FontAwesome6 name="car-side" size={32} color={'#ffffff'} />
            </Marker>
          )}
          {destinationLocation && (
            <Marker coordinate={destinationLocation}>
              <FontAwesome6 name="location-dot" size={32} color={'#00ffcc'} />
            </Marker>
          )}
        </MapView>

      </View>
      <KeyboardAvoidingView style={styles.absoluteSheet} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          {/* GooglePlacesAutocomplete OUTSIDE ScrollView */}
          <View style={styles.autocompleteContainer}>
            <Icon name="map-marker" size={20} color={COLORS.accent} style={styles.autocompleteIcon} />
            <TouchableOpacity
              style={styles.touchableContainer}
              onPress={() => {
                navigation.navigate('LocationScreen',{typeoflocation:"Pick up Location"});
              }}
            >
              <Text style={styles.touchableText}>{source||"From Pickup Location"}</Text>
            </TouchableOpacity>

            {/* <GooglePlacesAutocomplete
              placeholder="From (Pickup Location)"
              listViewDisplayed="auto"
              predefinedPlaces={[]}
              currentLocation={true}
              currentLocationLabel='Current Location'
              fetchDetails={true}
              keepResultsAfterBlur={destselect}
              onPress={(data, details = null) => {
                console.log(data, details); // Log for debugging
                setDestselect(false)
                if (data.description === 'Current Location') {
                  // Assuming location holds the current coordinates
                  setLocation({
                    latitude: location.latitude, // Replace with your current location coordinates
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                  setSource(data.description);
                } else {
                  setSource(data.description);
                  if (details && details.geometry && details.geometry.location) {
                    setLocation({
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                  }
                }
                Keyboard.dismiss();
              }}
              onFail={handleGooglePlacesError}
              timeout={10000}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
                components: 'country:pk',
                types: 'establishment|geocode',
              }}
              GooglePlacesDetailsQuery={{
                fields: 'formatted_address,geometry',
              }}
              GoogleReverseGeocodingQuery={{
                rankby: 'distance',
              }}
              textInputProps={{
                value: source ?? '',
                onChangeText: setSource,
                placeholderTextColor: COLORS.textSecondary,
                style: styles.autocompleteInput,
                autoCorrect: false,
                autoCapitalize: 'none',
                 onFocus: () => {
                  setDestselect(true);
                },
              }}
              styles={{
                container: { flex: 0 },
                textInputContainer: styles.autocompleteInputContainer,
                textInput: styles.autocompleteInput,
                listView: styles.autocompleteListView,
                row: styles.autocompleteRow,
                description: styles.autocompleteDescription,
                poweredContainer: { display: 'none' },
              }}
              enablePoweredByContainer={false}
              minLength={2}
              debounce={400}
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                rankby: 'distance',
                type: 'establishment',
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]}
              suppressDefaultStyles={true}
              returnKeyType="search"
              enableHighAccuracyLocation={true}
              disableScroll={true}
              renderRow={(rowData) => (
                <View style={styles.rowContainer}>
                  <Icon name="map-marker" size={20} color={COLORS.accent} />
                  <Text>{rowData.description}</Text>
                </View>
              )}
            /> */}
          </View>
          {/* Destination */}
          <View style={styles.autocompleteContainer}>
            <Icon name="map-marker-check" size={20} color={COLORS.success} style={styles.autocompleteIcon} />
            <TouchableOpacity style={styles.touchableContainer}  onPress={() => {
                navigation.navigate('LocationScreen',{typeoflocation:"Drop-off Location"});
              }}>
              <Text style={styles.touchableText}>{destination||"Drop-off Location"}</Text>
            </TouchableOpacity>

            {/* <GooglePlacesAutocomplete
              enableHighAccuracyLocation={true}
              disableScroll={true}
              predefinedPlaces={[]}
              placeholder="To (Drop-off Location)"
              fetchDetails={true}
              onPress={(data, details = null) => {
                setDestination(data.description); // Keep string for input
                setDestselect(false);
                if (details && details.geometry && details.geometry.location) {
                  setDestinationLocation({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                }
                Keyboard.dismiss();
              }}
              onFail={handleGooglePlacesError}
              timeout={10000} // 10 second timeout
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
                components: 'country:pk',
                types: 'establishment|geocode',
              }}
              GooglePlacesDetailsQuery={{
                fields: 'formatted_address,geometry',
              }}
              GoogleReverseGeocodingQuery={{
                rankby: 'distance',
              }}
              textInputProps={{
                value: destination,
                onChangeText: setDestination,
                placeholderTextColor: COLORS.textSecondary,
                style: styles.autocompleteInput,
                autoCorrect: false,
                autoCapitalize: 'none',
                onFocus: () => {
                  setDestselect(true);
                },
              }}
              styles={{
                container: { flex: 0 },
                textInputContainer: styles.autocompleteInputContainer,
                textInput: styles.autocompleteInput,
                listView: styles.autocompleteListView,
                row: styles.autocompleteRow,
                description: styles.autocompleteDescription,
                poweredContainer: { display: 'none' },
              }}
              enablePoweredByContainer={false}
              minLength={2}
              debounce={400} // Increased debounce time
              nearbyPlacesAPI="GooglePlacesSearch"
              GooglePlacesSearchQuery={{
                rankby: 'distance',
                type: 'establishment',
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]}
              suppressDefaultStyles={true}
              keepResultsAfterBlur={destselect}
              returnKeyType="search"
              renderRow={(rowData) => (
                <View style={styles.rowContainer}>
                  <Icon name="map-marker" size={20} color={COLORS.accent} />
                  <Text style={styles.autocompleteDescription}>{rowData.description}</Text>
                </View>
              )}
            /> */}
          </View>
          {/* The rest of your form in a ScrollView */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="always"

          >
            {/* ...rest of your form fields... */}
            {/* Example: */}
            <Text style={styles.sectionTitle}>When do you want to travel?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, rideType === 'now' && styles.toggleButtonActive]}
                onPress={() => setRideType('now')}
              >
                <Text style={[styles.toggleText, rideType === 'now' && styles.toggleTextActive]}>Leave Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, rideType === 'schedule' && styles.toggleButtonActive]}
                onPress={() => setRideType('schedule')}
              >
                <Text style={[styles.toggleText, rideType === 'schedule' && styles.toggleTextActive]}>Schedule</Text>
              </TouchableOpacity>
            </View>

            {rideType === 'now' && (
              <Card style={styles.nowCard}>
                <Card.Content>
                  <View style={styles.nowContent}>
                    <Icon name="clock-fast" size={32} color="#248CFE" style={styles.nowIcon} />
                    <Text style={styles.nowTitle}>Leaving Now</Text>
                    <Text style={styles.nowSubtitle}>
                      Your ride will be available immediately for passengers to book
                    </Text>
                    <View style={styles.currentTimeContainer}>
                      <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.currentTime}>
                        Current time: {formatTime(new Date())}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}

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

            <Card style={styles.detailsCard}>
              <Card.Content>
                <Text style={styles.cardTitle}>Ride Details</Text>

                <View style={styles.timeRow}>
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <Icon name="account-multiple" size={20} color="#248CFE" style={styles.inputIcon} />
                    <TextInput
                      label="Available Seats"
                      value={seats}
                      onChangeText={setSeats}
                      keyboardType="numeric"
                      style={styles.input}
                      mode="outlined"
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.secondary}
                    />
                  </View>
                  <View style={[styles.inputContainer, styles.halfInput]}>
                    <Icon name="cash" size={20} color="#248CFE" style={styles.inputIcon} />
                    <TextInput
                      label="Fare per Seat"
                      value={fare}
                      onChangeText={setFare}
                      keyboardType="numeric"
                      style={styles.input}
                      mode="outlined"
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.secondary}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>

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

            {error ? (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}


            {/* ... */}
            {/* Your other fields and post button */}
            <Button
              mode="contained"
              onPress={handlePost}
              style={styles.postButton}
              contentStyle={styles.buttonContent}
              buttonColor={COLORS.secondary}
              textColor={COLORS.primary}
              disabled={isLoading}
              loading={isLoading}
            >
              Post Ride
            </Button>
            {error ? (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
};



export default PostRideScreen;