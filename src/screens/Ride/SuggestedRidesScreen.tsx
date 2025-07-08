import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Icon, RideCard, RideFilters } from '../../components';

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
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    carType: [],
    amenities: [],
    rating: 0,
  });

  const handleRemove = (id: string) => {
    setRides(rides.filter(r => r.id !== id));
  };

  const handleRequest = (id: string) => {
    // Handle ride request
    console.log('Request ride:', id);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    // Apply filters to rides
    const filteredRides = mockResults.filter(ride => {
      // Filter by amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity: string) =>
          ride.preferences.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Filter by car type
      if (filters.carType.length > 0 && !filters.carType.includes('Any')) {
        if (!filters.carType.some((type: string) => ride.car.includes(type))) {
          return false;
        }
      }

      // Filter by price
      const fareNumber = parseInt(ride.fare.replace('Rs. ', ''));
      if (fareNumber < filters.priceRange[0] || fareNumber > filters.priceRange[1]) {
        return false;
      }

      // Filter by rating
      if (filters.rating > 0 && ride.rating < filters.rating) {
        return false;
      }

      return true;
    });

    setRides(filteredRides);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggested Rides</Text>
        <TouchableOpacity 
          onPress={() => setShowFilters(true)} 
          style={styles.filterButton}
        >
          <Icon name="filter" size={24} color="#111" />
        </TouchableOpacity>
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
        {rides.length === 0 && <Text style={styles.noRides}>No rides found matching your filters.</Text>}
      </ScrollView>

      <RideFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
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
    flex: 1,
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#111',
  },
  filterButton: {
    padding: 4,
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