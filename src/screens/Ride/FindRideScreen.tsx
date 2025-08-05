import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { useOptimizedNavigationSync } from '../../hooks/useOptimizedNavigationSync';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { Text, Card, Divider, Chip, TextInput, Switch } from 'react-native-paper';
import Icon from '../../components/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';
import { ToggleButton } from '../../components';

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
  
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<'now' | 'schedule'>('now');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [ac, setAc] = useState(false);
  const [music, setMusic] = useState(false);
  const [smoking, setSmoking] = useState(false);

  // Handle parameters passed from chatbot
  useEffect(() => {
    if (route?.params?.searchParams) {
      const { searchParams, userPreferences } = route.params;
      
      if (searchParams.source) {
        setSource(searchParams.source);
      }
      if (searchParams.destination) {
        setDestination(searchParams.destination);
      }
      
      if (userPreferences) {
        if (userPreferences.ac !== undefined) {
          setAc(userPreferences.ac);
        }
        if (userPreferences.music !== undefined) {
          setMusic(userPreferences.music);
        }
        if (userPreferences.smoking !== undefined) {
          setSmoking(userPreferences.smoking);
        }
      }
    }
  }, [route?.params]);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapContent}>
          <Icon name="map-marker" size={48} color={COLORS.textSecondary} style={styles.mapIcon} />
          <Text style={styles.mapTitle}>Map Integration</Text>
          <Text style={styles.mapSubtext}>Live location tracking will be displayed here</Text>
        </View>
        </View>
      <View style={styles.absoluteSheet}>
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          >
          <View style={styles.form}>
            {/* <View style={styles.inputContainer}>
              <Icon name="map-marker" size={20} color={COLORS.accent} style={styles.inputIcon} />
              <TextInput
                label="From (Pickup Location)"
                value={source}
                onChangeText={setSource}
                style={styles.input}
                mode="outlined"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.secondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="map-marker-check" size={20} color={COLORS.success} style={styles.inputIcon} />
              <TextInput
                label="To (Drop-off Location)"
                value={destination}
                onChangeText={setDestination}
                style={styles.input}
                mode="outlined"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.secondary}
              />
            </View> */}

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
          </View>
          {/* Destination */}
          <View style={styles.autocompleteContainer}>
            <Icon name="map-marker-check" size={20} color={COLORS.success} style={styles.autocompleteIcon} />
            <TouchableOpacity style={styles.touchableContainer}  onPress={() => {
                navigation.navigate('LocationScreen',{typeoflocation:"Drop-off Location"});
              }}>
              <Text style={styles.touchableText}>{destination||"Drop-off Location"}</Text>
            </TouchableOpacity>
          </View>

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

            {rideType === 'now' && (
              <Card style={styles.nowCard}>
                <Card.Content>
                  <View style={styles.nowContent}>
                    <Icon name="clock-fast" size={32} color="#248CFE" style={styles.nowIcon} />
                    <Text style={styles.nowTitle}>Right Now</Text>
                    <Text style={styles.nowSubtitle}>
                      Search for rides that are available immediately
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

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search Rides</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
              </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
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
      </View>
      {/* showResults && (
        <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
          <Text style={styles.resultsTitle}>Suggested Rides</Text>
            {mockResults.map((ride) => (
              <Card 
                key={ride.id} 
                style={styles.rideCard}
                onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
              >
                <Card.Content style={styles.cardContent}>
                  <View style={styles.rideHeader}>
                    <View style={styles.driverInfo}>
                    <View style={styles.driverNameRow}>
                      <Icon name="account" size={20} color={COLORS.accent} />
                      <Text style={styles.driverName}>{ride.driver}</Text>
                      </View>
                    <View style={styles.ratingRow}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.rating}>{ride.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.fareContainer}>
                    <Icon name="currency-inr" size={16} color={COLORS.accent} />
                    <Text style={styles.fare}>{ride.fare}</Text>
                  </View>
                </View>
                  <Divider style={styles.divider} />
                  <View style={styles.routeInfo}>
                  <View style={styles.routeRow}>
                    <Icon name="map-marker" size={16} color={COLORS.accent} />
                    <Text style={styles.routeText}>{ride.from}</Text>
                  </View>
                  <View style={styles.routeRow}>
                    <Icon name="map-marker-check" size={16} color={COLORS.success} />
                    <Text style={styles.routeText}>{ride.to}</Text>
                  </View>
                </View>
                  <View style={styles.rideDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{ride.departureTime}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="car-seat" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{ride.availableSeats} seats available</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="car" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{ride.car}</Text>
                  </View>
                    </View>
                <View style={styles.preferences}>
                      {ride.preferences.map((pref, index) => (
                        <Chip 
                          key={index}
                          style={styles.preferenceChip}
                          textStyle={styles.preferenceChipText}
                        >
                          {pref}
                        </Chip>
                      ))}
                    </View>
                </Card.Content>
              </Card>
            ))}
      </ScrollView>
      )} */}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContent: {
    alignItems: 'center',
    opacity: 0.7,
  },
  mapIcon: {
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  absoluteSheet: {
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
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  dateTimeButton: {
    padding: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateTimeContent: {
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  nowCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nowContent: {
    padding: 16,
    alignItems: 'center',
  },
  nowIcon: {
    marginBottom: 12,
  },
  nowTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  nowSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
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
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.primary,
  },
  recentList: {
    marginTop: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  recentLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  recentSub: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resultsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    zIndex: 999,
  },
  resultsContent: {
    padding: 24,
    paddingTop: 60,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 20,
  },
  rideCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    padding: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fare: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  divider: {
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  rideDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceChip: {
    backgroundColor: COLORS.lightGray,
    marginRight: 8,
    marginBottom: 4,
  },
  preferenceChipText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
    // Autocomplete styles
autocompleteContainer: {
  flexDirection: 'row',         // Align children in a row
  alignItems: 'center',         // Center items vertically
  marginBottom: 16,
  position: 'relative',
  borderColor: '#D3D3D3',       // Light gray color for the border
  borderWidth: 1,
  borderRadius: 20,             // Use a number for radius
  padding: 10,                  // Add padding inside the border
  backgroundColor: 'white',      // Set background to white for better visibility
},

touchableContainer: {
  flex: 1,                      // Allow the TouchableOpacity to fill space
  padding: 10,                  // Add padding for better touch area
  justifyContent: 'center',      // Center text vertically
  marginLeft: 30,               // Add margin to create a gap between the icon and the button
},

touchableText: {
  color: COLORS.secondary || 'black', // Ensure text color is set (use a fallback if necessary)
  fontSize: 16,                 // Set a font size for visibility
},

autocompleteIcon: {
  position: 'absolute',
  left: 16,
  top: 18,
  zIndex: 1,
},
});

export default FindRideScreen; 