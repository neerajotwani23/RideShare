import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Button, Switch, HelperText, Card, SegmentedButtons } from 'react-native-paper';
import Icon from '../../components/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
      <View style={styles.mapPlaceholder}>
        {/* Map placeholder similar to FindRideScreen */}
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
              <View style={styles.inputContainer}>
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
              </View>

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
                      <Icon name="clock-fast" size={32} color="#007AFF" style={styles.nowIcon} />
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
                  </Card.Content>
                </Card>
          )}

              <Card style={styles.detailsCard}>
                <Card.Content>
                  <Text style={styles.cardTitle}>Ride Details</Text>

          <View style={styles.timeRow}>
                    <View style={[styles.inputContainer, styles.halfInput]}>
                      <Icon name="account-multiple" size={20} color="#007AFF" style={styles.inputIcon} />
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
                      <Icon name="cash" size={20} color="#007AFF" style={styles.inputIcon} />
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
                      <Icon name="snowflake" size={20} color="#007AFF" />
            <Text style={styles.preferenceText}>Air Conditioning</Text>
                    </View>
                    <Switch 
                      value={ac} 
                      onValueChange={setAc}
                      trackColor={{ false: COLORS.border, true: '#007AFF' }}
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
                      trackColor={{ false: COLORS.border, true: '#007AFF' }}
                      thumbColor={COLORS.primary}
                    />
          </View>
                  
          <View style={styles.preferenceItem}>
                    <View style={styles.preferenceContent}>
                      <Icon name="smoking-off" size={20} color="#34C759" />
            <Text style={styles.preferenceText}>No Smoking</Text>
                    </View>
                    <Switch 
                      value={!smoking} 
                      onValueChange={(value) => setSmoking(!value)}
                      trackColor={{ false: COLORS.border, true: '#007AFF' }}
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

          <Button 
            mode="contained" 
            onPress={handlePost} 
            style={styles.postButton}
            contentStyle={styles.buttonContent}
            buttonColor={COLORS.secondary}
            textColor={COLORS.primary}
          >
                Post Ride
          </Button>
            </View>
          </ScrollView>
        </View>
        </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  mapPlaceholder: {
    height: screenHeight * 0.35, // Reduced map height
    backgroundColor: COLORS.lightGray,
  },
  absoluteSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.7, // Fixed height instead of maxHeight
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
    height: '100%', // Fill the absoluteSheet
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
    paddingBottom: 100, // Extra padding at bottom
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
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
  nowCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: '#007AFF',
    marginBottom: 4,
  },
  nowSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
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
    color: '#007AFF',
    marginLeft: 4,
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
  detailsCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    borderRadius: 8,
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
  errorText: {
    color: COLORS.error,
    marginTop: 8,
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