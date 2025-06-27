import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Card, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const PostRideScreen = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
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

  const handlePost = () => {
    if (!source || !destination || !seats || !fare) {
      setError('All fields are required.');
      return;
    }
    setError('');
    
    const rideData = {
      source,
      destination,
      seats: parseInt(seats),
      fare: parseInt(fare),
      preferences: { ac, music, smoking: !smoking },
      type: rideType,
      scheduledDate: rideType === 'schedule' ? date : null,
      scheduledTime: rideType === 'schedule' ? time : null,
      createdAt: new Date(),
    };
    
    console.log('Posting ride:', rideData);
    // Here you would typically send this data to your backend
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
          <Text style={styles.title}>Post a Ride</Text>
          <Text style={styles.subtitle}>Share your journey with others</Text>
        </View>

        <Card style={styles.mapCard}>
          <Card.Content style={styles.mapContent}>
            <Text style={styles.mapPlaceholder}>Select Route on Map</Text>
            <Text style={styles.mapSubtext}>Tap to choose pickup and drop-off locations</Text>
          </Card.Content>
        </Card>

        <View style={styles.form}>
          <TextInput
            label="From (Pickup Location)"
            value={source}
            onChangeText={setSource}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label="To (Drop-off Location)"
            value={destination}
            onChangeText={setDestination}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker-outline" />}
          />

          <Text style={styles.sectionTitle}>When do you want to travel?</Text>
          <SegmentedButtons
            value={rideType}
            onValueChange={setRideType}
            buttons={[
              {
                value: 'now',
                label: 'Leave Now',
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
                  <Text style={styles.nowTitle}>Leaving Now</Text>
                  <Text style={styles.nowSubtitle}>
                    Your ride will be available immediately for passengers to book
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

          <View style={styles.timeRow}>
            <TextInput
              label="Available Seats"
              value={seats}
              onChangeText={setSeats}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              left={<TextInput.Icon icon="account-multiple" />}
            />
            <TextInput
              label="Fare per Seat (Rs.)"
              value={fare}
              onChangeText={setFare}
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              left={<TextInput.Icon icon="currency-usd" />}
            />
          </View>

          <Text style={styles.preferencesTitle}>Ride Preferences</Text>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceText}>Air Conditioning</Text>
            <Switch value={ac} onValueChange={setAc} />
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceText}>Music Allowed</Text>
            <Switch value={music} onValueChange={setMusic} />
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceText}>No Smoking</Text>
            <Switch value={!smoking} onValueChange={(value) => setSmoking(!value)} />
          </View>

          {error ? <HelperText type="error" visible>{error}</HelperText> : null}

          <Button 
            mode="contained" 
            onPress={handlePost} 
            style={styles.postButton}
            contentStyle={styles.buttonContent}
          >
            {rideType === 'now' ? 'Post Ride Now' : 'Schedule Ride'}
          </Button>
        </View>

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
  mapCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  mapContent: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  mapPlaceholder: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666666',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#999999',
  },
  form: {
    width: '100%',
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
  preferencesTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
  },
  postButton: {
    marginTop: 24,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});

export default PostRideScreen; 