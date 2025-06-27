import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Divider } from 'react-native-paper';
import Header from '../../components/Header';

const mockRideDetails = {
  id: 1,
  driver: {
    name: 'Sarah Ahmed',
    rating: 4.9,
    avatar: 'SA',
    phone: '+92 300 1234567',
    car: 'Toyota Corolla',
    carColor: 'White',
    carPlate: 'ABC-123',
  },
  route: {
    from: 'Downtown',
    to: 'Campus',
    distance: '12.5 km',
    duration: '25 mins',
  },
  schedule: {
    date: '2025-06-28',
    time: '09:00 AM',
    pickupTime: '09:00 AM',
    dropoffTime: '09:25 AM',
  },
  pricing: {
    fare: 200,
    totalSeats: 4,
    availableSeats: 2,
    bookedSeats: 2,
  },
  preferences: ['AC', 'No Smoking', 'Music OK'],
  passengers: [
    { name: 'Ali Hassan', rating: 4.8 },
    { name: 'Fatima Khan', rating: 4.6 },
  ],
};

const RideDetailsScreen = ({ navigation, route }: any) => {
  const rideDetails = mockRideDetails;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Ride Details"
        showBack={true}
        showChat={true}
        onBack={() => navigation.goBack()}
        onChatPress={() => navigation.navigate('ChatBot')}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Driver Info */}
        <Card style={styles.driverCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.driverHeader}>
              <Avatar.Text 
                size={60} 
                label={rideDetails.driver.avatar}
                style={styles.avatar}
              />
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{rideDetails.driver.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {rideDetails.driver.rating}</Text>
                  <Text style={styles.carInfo}>• {rideDetails.driver.car}</Text>
                </View>
                <Text style={styles.carDetails}>
                  {rideDetails.driver.carColor} • {rideDetails.driver.carPlate}
                </Text>
              </View>
              <Text style={styles.fareAmount}>Rs. {rideDetails.pricing.fare}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Route Info */}
        <Card style={styles.routeCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Route Information</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.routeInfo}>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeValue}>{rideDetails.route.from}</Text>
                <Text style={styles.timeValue}>{rideDetails.schedule.pickupTime}</Text>
              </View>
              
              <View style={styles.routeLine} />
              
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeValue}>{rideDetails.route.to}</Text>
                <Text style={styles.timeValue}>{rideDetails.schedule.dropoffTime}</Text>
              </View>
            </View>
            
            <View style={styles.tripDetails}>
              <View style={styles.tripItem}>
                <Text style={styles.tripLabel}>Distance</Text>
                <Text style={styles.tripValue}>{rideDetails.route.distance}</Text>
              </View>
              <View style={styles.tripItem}>
                <Text style={styles.tripLabel}>Duration</Text>
                <Text style={styles.tripValue}>{rideDetails.route.duration}</Text>
              </View>
              <View style={styles.tripItem}>
                <Text style={styles.tripLabel}>Date</Text>
                <Text style={styles.tripValue}>{rideDetails.schedule.date}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Seat Info */}
        <Card style={styles.seatCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Seat Information</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.seatInfo}>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>Available</Text>
                <Text style={styles.seatValue}>{rideDetails.pricing.availableSeats}</Text>
              </View>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>Total</Text>
                <Text style={styles.seatValue}>{rideDetails.pricing.totalSeats}</Text>
              </View>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>Booked</Text>
                <Text style={styles.seatValue}>{rideDetails.pricing.bookedSeats}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Preferences */}
        <Card style={styles.preferencesCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Ride Preferences</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.preferencesContainer}>
              {rideDetails.preferences.map((pref, index) => (
                <Chip key={index} style={styles.preferenceChip} textStyle={styles.preferenceText}>
                  {pref}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Current Passengers */}
        <Card style={styles.passengersCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Current Passengers</Text>
            <Divider style={styles.divider} />
            
            {rideDetails.passengers.map((passenger, index) => (
              <View key={index} style={styles.passengerItem}>
                <Avatar.Text size={40} label={passenger.name.split(' ').map(n => n[0]).join('')} />
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>{passenger.name}</Text>
                  <Text style={styles.passengerRating}>⭐ {passenger.rating}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            style={styles.callButton}
            onPress={() => {/* Handle call */}}
            icon="phone"
          >
            Call Driver
          </Button>
          <Button 
            mode="contained" 
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookingDetails', { rideId: rideDetails.id })}
          >
            Book This Ride
          </Button>
        </View>

        {/* Test Ride Flow Button */}
        <View style={styles.testButtons}>
          <Button 
            mode="contained" 
            style={styles.startRideButton}
            onPress={() => navigation.navigate('DuringRide', { rideData: rideDetails })}
            buttonColor="#FF9500"
            textColor="#FFFFFF"
          >
            Start Ride (Test)
          </Button>
        </View>
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
    padding: 16,
    paddingBottom: 32,
  },
  driverCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#007AFF',
    marginRight: 16,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  carDetails: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#999999',
  },
  fareAmount: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
  },
  routeCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeItem: {
    paddingVertical: 8,
  },
  routeLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#007AFF',
  },
  routeLine: {
    height: 20,
    width: 2,
    backgroundColor: '#E5E5EA',
    marginLeft: 8,
    marginVertical: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tripItem: {
    alignItems: 'center',
  },
  tripLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  tripValue: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  seatCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  seatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  seatItem: {
    alignItems: 'center',
  },
  seatLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  seatValue: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
  },
  preferencesCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F2F2F7',
  },
  preferenceText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  passengersCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerInfo: {
    marginLeft: 12,
  },
  passengerName: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  passengerRating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#FF9500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#007AFF',
  },
  bookButton: {
    flex: 2,
    borderRadius: 12,
  },
  testButtons: {
    marginTop: 16,
    alignItems: 'center',
  },
  startRideButton: {
    flex: 1,
    borderRadius: 12,
  },
});

export default RideDetailsScreen; 