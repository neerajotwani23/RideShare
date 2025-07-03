import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import Icon from '../../components/Icon';

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

const SuggestedRidesScreen = ({ navigation, route }: any) => {
  const [rides, setRides] = useState(mockResults);

  const handleRemove = (id: number) => {
    setRides(rides.filter(r => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggested Rides</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {rides.map((ride) => (
          <Card key={ride.id} style={styles.rideCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.rideHeader}>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{ride.driver}</Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{ride.rating}</Text>
                  </View>
                </View>
                <View style={styles.fareContainer}>
                  <Text style={styles.fare}>Rs. {ride.fare}</Text>
                </View>
              </View>
              <View style={styles.rideDetails}>
                <Text style={styles.detailText}>{ride.from} → {ride.to}</Text>
                <Text style={styles.detailText}>{ride.departureTime} • {ride.car}</Text>
              </View>
              <View style={styles.buttonRow}>
                <Button mode="contained" style={styles.requestButton} labelStyle={styles.requestButtonLabel} onPress={() => {}}>Request</Button>
                <Button mode="outlined" style={styles.removeButton} labelStyle={styles.removeButtonLabel} onPress={() => handleRemove(ride.id)}>Remove</Button>
              </View>
            </Card.Content>
          </Card>
        ))}
        {rides.length === 0 && <Text style={styles.noRides}>No more rides found.</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#111',
  },
  content: {
    padding: 20,
  },
  rideCard: {
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
    color: '#111',
    marginRight: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: '#222',
    marginLeft: 4,
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fare: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: '#111',
  },
  rideDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  requestButton: {
    borderRadius: 10,
    backgroundColor: '#111',
    marginRight: 10,
  },
  requestButtonLabel: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
  },
  removeButton: {
    borderRadius: 10,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  removeButtonLabel: {
    color: '#111',
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
  },
  noRides: {
    textAlign: 'center',
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 40,
  },
});

export default SuggestedRidesScreen; 