import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, TextInput as RNTextInput, Platform, ScrollView } from 'react-native';
import { Text, Button, Card, Divider, Chip, IconButton } from 'react-native-paper';
import Icon from '../../components/Icon';
import { SearchIcon } from '../../components/icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';

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

const FindRideScreen = ({ navigation }: any) => {
  const [whereTo, setWhereTo] = useState('');
  const [rideType, setRideType] = useState<'now' | 'schedule'>('now');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setScheduledTime(selectedTime);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  const handleSearch = () => {
    navigation.navigate('SuggestedRides');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        {/* Blank space for map */}
        </View>
      <View style={styles.absoluteSheet}>
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, rideType === 'now' && styles.toggleButtonActive]}
              onPress={() => setRideType('now')}
            >
              <Text style={[styles.toggleText, rideType === 'now' && styles.toggleTextActive]}>Right Now</Text>
            </TouchableOpacity>
                  <TouchableOpacity 
              style={[styles.toggleButton, rideType === 'schedule' && styles.toggleButtonActive]}
              onPress={() => setRideType('schedule')}
                  >
              <Text style={[styles.toggleText, rideType === 'schedule' && styles.toggleTextActive]}>Schedule</Text>
            </TouchableOpacity>
                    </View>
          {rideType === 'schedule' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <TouchableOpacity 
                style={styles.schedulePicker}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
                <Text style={styles.schedulePickerText}>
                  {scheduledDate
                    ? scheduledDate.toLocaleDateString()
                    : 'Select date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.schedulePicker, { marginLeft: 8 }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Icon name="clock-outline" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
                <Text style={styles.schedulePickerText}>
                  {scheduledTime
                    ? scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                    : 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.whereToRow}>
            <View style={styles.inputContainer}>
              <RNTextInput
                style={styles.whereToInput}
                placeholder="Where to?"
                placeholderTextColor={COLORS.textSecondary}
                value={whereTo}
                onChangeText={setWhereTo}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
                    </View>
          <View style={styles.recentList}>
            {recentAddresses.map(addr => (
              <TouchableOpacity key={addr.id} style={styles.recentItem}>
                <Icon name="map-marker" size={22} color={COLORS.secondary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.recentLabel}>{addr.label}</Text>
                  {addr.sub ? <Text style={styles.recentSub}>{addr.sub}</Text> : null}
                    </View>
                  </TouchableOpacity>
            ))}
                </View>
              </View>
        {showDatePicker && (
          <DateTimePicker
            value={scheduledDate || new Date()}
            mode="date"
            display={Platform.OS === 'android' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={scheduledTime || new Date()}
            mode="time"
            display={Platform.OS === 'android' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </View>
      {showResults && (
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
                          textStyle={styles.preferenceText}
                        >
                          {pref}
                        </Chip>
                      ))}
                    </View>
                </Card.Content>
              </Card>
            ))}
      </ScrollView>
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
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  absoluteSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  bottomSheet: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 100, // Extra padding for tab bar
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
  },
  schedulePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  schedulePickerText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  whereToRow: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingRight: 4,
  },
  whereToInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
  },
  searchButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 14,
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
  preferenceText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
});

export default FindRideScreen; 