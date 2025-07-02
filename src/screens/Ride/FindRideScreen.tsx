import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, Chip, Divider, SegmentedButtons } from 'react-native-paper';
import Icon from '../../components/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('now'); // 'now' or 'schedule'
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const searchData = {
      source,
      destination,
      type: rideType,
      searchDate: rideType === 'schedule' ? date : null,
      searchTime: rideType === 'schedule' ? time : null,
      searchedAt: new Date(),
    };
    
    console.log('Searching rides:', searchData);
    setSearched(true);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Find a Ride</Text>
          <Text style={styles.subtitle}>Search for available rides</Text>
        </View>

        <Card style={styles.searchCard}>
          <Card.Content style={styles.searchContent}>
            <View style={styles.inputContainer}>
              <Icon name="map-marker" size={24} color="#007AFF" style={styles.inputIcon} />
              <TextInput
                label="From"
                value={source}
                onChangeText={setSource}
                style={styles.input}
                mode="outlined"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="map-marker-check" size={24} color="#34C759" style={styles.inputIcon} />
              <TextInput
                label="To"
                value={destination}
                onChangeText={setDestination}
                style={styles.input}
                mode="outlined"
              />
            </View>

            <Text style={styles.sectionTitle}>When do you need a ride?</Text>
            <SegmentedButtons
              value={rideType}
              onValueChange={setRideType}
              buttons={[
                {
                  value: 'now',
                  label: 'Right Now',
                  icon: 'clock-fast',
                },
                {
                  value: 'schedule',
                  label: 'Schedule',
                  icon: 'calendar-clock',
                },
              ]}
              style={styles.segmentedButtons}
            />

            {rideType === 'now' && (
              <Card style={styles.nowCard}>
                <Card.Content>
                  <View style={styles.nowContent}>
                    <Icon name="clock-fast" size={32} color="#007AFF" style={styles.nowIcon} />
                    <Text style={styles.nowTitle}>Looking for Immediate Rides</Text>
                    <Text style={styles.nowSubtitle}>
                      We'll show you rides that are available right now
                    </Text>
                    <View style={styles.currentTimeContainer}>
                      <Icon name="clock-outline" size={16} color="#666666" />
                      <Text style={styles.currentTime}>
                        Current time: {formatTime(new Date())}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}

            {rideType === 'schedule' && (
              <View style={styles.scheduleSection}>
                <Text style={styles.scheduleTitle}>Select Date & Time</Text>
                
                <View style={styles.timeRow}>
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, styles.halfInput]} 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <View style={styles.dateTimeContent}>
                      <Icon name="calendar" size={20} color="#007AFF" />
                      <Text style={styles.dateTimeLabel}>Date</Text>
                      <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, styles.halfInput]} 
                    onPress={() => setShowTimePicker(true)}
                  >
                    <View style={styles.dateTimeContent}>
                      <Icon name="clock-outline" size={20} color="#007AFF" />
                      <Text style={styles.dateTimeLabel}>Time</Text>
                      <Text style={styles.dateTimeValue}>{formatTime(time)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Button 
              mode="contained" 
              onPress={handleSearch}
              style={styles.searchButton}
              contentStyle={styles.buttonContent}
              icon="magnify"
            >
              {rideType === 'now' ? 'Find Rides Now' : 'Search Scheduled Rides'}
            </Button>
          </Card.Content>
        </Card>

        {searched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {rideType === 'now' ? 'Available Now' : 'Scheduled Rides'}
            </Text>
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
                        <Icon name="account" size={20} color="#007AFF" />
                        <Text style={styles.driverName}>{ride.driver}</Text>
                      </View>
                      <View style={styles.ratingRow}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{ride.rating}</Text>
                      </View>
                    </View>
                    <View style={styles.fareContainer}>
                      <Icon name="currency-inr" size={16} color="#007AFF" />
                      <Text style={styles.fare}>{ride.fare}</Text>
                    </View>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.routeInfo}>
                    <View style={styles.routeRow}>
                      <Icon name="map-marker" size={16} color="#007AFF" />
                      <Text style={styles.routeText}>{ride.from}</Text>
                    </View>
                    <View style={styles.routeRow}>
                      <Icon name="map-marker-check" size={16} color="#34C759" />
                      <Text style={styles.routeText}>{ride.to}</Text>
                    </View>
                  </View>

                  <View style={styles.rideDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="clock-outline" size={16} color="#666666" />
                      <Text style={styles.detailText}>{ride.departureTime}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="car-seat" size={16} color="#666666" />
                      <Text style={styles.detailText}>{ride.availableSeats} seats available</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Icon name="car" size={16} color="#666666" />
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
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  searchCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  searchContent: {
    padding: 16,
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
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  nowCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#E8F5E8',
  },
  nowContent: {
    alignItems: 'center',
    padding: 8,
  },
  nowIcon: {
    marginBottom: 8,
  },
  nowTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#34C759',
    marginBottom: 4,
  },
  nowSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#34C759',
  },
  scheduleSection: {
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
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
    borderColor: '#79747E',
    borderRadius: 4,
    padding: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  dateTimeContent: {
    alignItems: 'flex-start',
  },
  dateTimeLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#49454F',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1C1B1F',
  },
  searchButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resultsSection: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  rideCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
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
  },
  driverName: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#FF9500',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fare: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
  },
  divider: {
    marginVertical: 12,
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginLeft: 4,
  },
  rideDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#F2F2F7',
  },
  preferenceText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
});

export default FindRideScreen; 