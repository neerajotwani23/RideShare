import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, Chip, Divider, SegmentedButtons } from 'react-native-paper';
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
            <TextInput
              label="From"
              value={source}
              onChangeText={setSource}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker" />}
            />

            <TextInput
              label="To"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker-outline" />}
            />

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
                    <Text style={styles.nowTitle}>Looking for Immediate Rides</Text>
                    <Text style={styles.nowSubtitle}>
                      We'll show you rides that are available right now
                    </Text>
                    <Text style={styles.currentTime}>
                      Current time: {formatTime(new Date())}
                    </Text>
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
                      <Text style={styles.dateTimeLabel}>Date</Text>
                      <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.dateTimeButton, styles.halfInput]} 
                    onPress={() => setShowTimePicker(true)}
                  >
                    <View style={styles.dateTimeContent}>
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
                      <Text style={styles.driverName}>{ride.driver}</Text>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>★ {ride.rating}</Text>
                        <Text style={styles.carInfo}>• {ride.car}</Text>
                      </View>
                    </View>
                    <Text style={styles.fareText}>Rs. {ride.fare}</Text>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.routeInfo}>
                    <Text style={styles.routeText}>{ride.from} → {ride.to}</Text>
                    <Text style={styles.timeText}>Departure: {ride.departureTime}</Text>
                  </View>

                  <View style={styles.rideDetails}>
                    <View style={styles.seatsContainer}>
                      <Text style={styles.seatsText}>
                        {ride.availableSeats} seats available
                      </Text>
                    </View>
                    
                    <View style={styles.preferencesContainer}>
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
                  </View>

                  <Button 
                    mode="contained"
                    style={styles.bookButton}
                    contentStyle={styles.bookButtonContent}
                    onPress={() => navigation.navigate('RideDetails', { rideId: ride.id })}
                  >
                    Book Now
                  </Button>
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
  input: {
    marginBottom: 16,
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
  driverName: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#FF9500',
  },
  carInfo: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  fareText: {
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
  routeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  rideDetails: {
    marginBottom: 16,
  },
  seatsContainer: {
    marginBottom: 8,
  },
  seatsText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#34C759',
  },
  preferencesContainer: {
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
  bookButton: {
    borderRadius: 8,
  },
  bookButtonContent: {
    paddingVertical: 4,
  },
});

export default FindRideScreen; 