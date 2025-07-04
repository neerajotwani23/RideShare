import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Divider } from 'react-native-paper';
import Header from '../../components/Header';
import { COLORS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        showChat={false}
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
                <Icon name="phone" size={22} color={COLORS.secondary} style={{ marginLeft: 'auto' }} />
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
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.primary,
  },
  driverCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'column',
    padding: 0,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: COLORS.secondary,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  carInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  carDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  fareAmount: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  routeCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: COLORS.border,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  routeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  routeValue: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  timeValue: {
    fontSize: 13,
    color: COLORS.accent,
    marginTop: 2,
  },
  routeLine: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tripItem: {
    alignItems: 'center',
    flex: 1,
  },
  tripLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tripValue: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Medium',
  },
  seatCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  seatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  seatItem: {
    alignItems: 'center',
    flex: 1,
  },
  seatLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  seatValue: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Bold',
  },
  preferencesCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  preferenceChip: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 0,
  },
  preferenceText: {
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
  },
  passengersCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    fontSize: 15,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-SemiBold',
  },
  passengerRating: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  callButton: {
    flex: 1,
    marginRight: 8,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
  },
  bookButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  testButtons: {
    marginBottom: 24,
  },
  startRideButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
  },
});

export default RideDetailsScreen; 