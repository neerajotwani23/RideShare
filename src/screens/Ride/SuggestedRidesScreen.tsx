import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Icon, RideCard, RideFilters } from '../../components';
import { COLORS } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

const SuggestedRidesScreen = ({ navigation, route }: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 1000],
    carType: [],
    amenities: [],
    rating: 0,
  });

  const { 
    availableRides, 
    refreshAvailableRides, 
    isLoading, 
    isRefreshing 
  } = useApp();

  // Get search parameters and user preferences from route
  const searchParams = route?.params?.searchParams || {};
  const userPreferences = route?.params?.userPreferences || {};

  useEffect(() => {
    // Fetch available rides with search parameters and user preferences
    if (Object.keys(searchParams).length > 0) {
      refreshAvailableRides(searchParams, userPreferences);
    } else {
      refreshAvailableRides();
    }
  }, [searchParams, userPreferences]);

  const handleRemove = (id: string) => {
    // This would typically remove from favorites or hide the ride
    console.log('Remove ride:', id);
  };

  const handleRequest = (id: string) => {
    // Handle ride request
    console.log('Request ride:', id);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    // Apply filters to rides - this would typically call the API with filters
    refreshAvailableRides(filters);
  };

  const formatRideData = (ride: any) => ({
    id: ride.id?.toString() || ride.id,
    driver: ride.driver?.name || ride.driver_name || 'Unknown Driver',
    rating: ride.driver?.rating || ride.rating || 0,
    from: ride.source || ride.from,
    to: ride.destination || ride.to,
    departureTime: ride.scheduled_time || ride.departure_time || 'Now',
    availableSeats: ride.available_seats || ride.seats || 0,
    fare: `Rs. ${ride.fare || 0}`,
    car: ride.vehicle?.model || ride.car_model || 'Car',
    preferences: [
      ...(ride.ac ? ['AC'] : []),
      ...(ride.music ? ['Music OK'] : []),
      ...(ride.smoking_allowed ? [] : ['No Smoking']),
    ],
  });

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
          <Icon name="filter" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Finding rides for you...</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.content}>
          {availableRides.length > 0 ? (
            availableRides.map((ride) => (
          <RideCard
            key={ride.id}
                ride={formatRideData(ride)}
            showActions={true}
            onRequest={() => handleRequest(ride.id)}
            onRemove={() => handleRemove(ride.id)}
          />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="car-off" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyTitle}>No Rides Available</Text>
                <Text style={styles.emptySubtext}>
                  There are currently no rides available matching your criteria. 
                  Try adjusting your filters or check back later.
                </Text>
              </Card.Content>
            </Card>
          )}
      </ScrollView>
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
  },
  emptyCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Montserrat-Regular',
  },
});

export default SuggestedRidesScreen; 