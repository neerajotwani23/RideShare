import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from '../../components/Icon';
import { RideCard } from '../../components';

const mockResults = [
  {
    id: '1',
    driver: 'Sarah Ahmed',
    rating: 4.9,
    from: 'Downtown',
    to: 'Campus',
    departureTime: '09:00 AM',
    availableSeats: 2,
    fare: 'Rs. 200',
    car: 'Toyota Corolla',
    preferences: ['AC', 'No Smoking'],
  },
  {
    id: '2',
    driver: 'Ali Hassan',
    rating: 4.7,
    from: 'City Center',
    to: 'University',
    departureTime: '09:15 AM',
    availableSeats: 1,
    fare: 'Rs. 180',
    car: 'Honda Civic',
    preferences: ['Music OK', 'AC'],
  },
];

const SuggestedRidesScreen = ({ navigation }: any) => {
  const [rides, setRides] = useState(mockResults);

  const handleRemove = (id: string) => {
    setRides(rides.filter(r => r.id !== id));
  };

  const handleRequest = (id: string) => {
    // Handle ride request
    console.log('Request ride:', id);
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
          <RideCard
            key={ride.id}
            ride={ride}
            showActions={true}
            onRequest={() => handleRequest(ride.id)}
            onRemove={() => handleRemove(ride.id)}
          />
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
  noRides: {
    textAlign: 'center',
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 40,
  },
});

export default SuggestedRidesScreen; 