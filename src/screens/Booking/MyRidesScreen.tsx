import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Text, Button, Card, SegmentedButtons, Chip, IconButton } from 'react-native-paper';

const mockUpcoming = [
  { 
    id: 1, 
    from: 'Downtown', 
    to: 'Campus', 
    date: '2025-06-28', 
    time: '09:00 AM', 
    status: 'Confirmed', 
    seats: 2, 
    fare: 200,
    type: 'scheduled',
    canCancel: true,
    driver: 'Sarah Ahmed'
  },
  { 
    id: 2, 
    from: 'Mall', 
    to: 'Office Complex', 
    date: 'Today', 
    time: 'Now', 
    status: 'Active', 
    seats: 1, 
    fare: 150,
    type: 'immediate',
    canCancel: false,
    driver: 'Ali Hassan'
  },
  { 
    id: 3, 
    from: 'Airport', 
    to: 'Hotel', 
    date: '2025-06-30', 
    time: '02:00 PM', 
    status: 'Pending', 
    seats: 3, 
    fare: 350,
    type: 'scheduled',
    canCancel: true,
    driver: 'Fatima Khan'
  },
];

const mockPast = [
  { 
    id: 4, 
    from: 'Home', 
    to: 'University', 
    date: '2025-06-20', 
    time: '08:30 AM', 
    status: 'Completed', 
    seats: 2, 
    fare: 180,
    type: 'immediate',
    canCancel: false,
    driver: 'Ahmed Ali'
  },
  { 
    id: 5, 
    from: 'Cafe', 
    to: 'Library', 
    date: '2025-06-18', 
    time: '02:00 PM', 
    status: 'Completed', 
    seats: 1, 
    fare: 100,
    type: 'scheduled',
    canCancel: false,
    driver: 'Maria Santos'
  },
  { 
    id: 6, 
    from: 'Office', 
    to: 'Home', 
    date: '2025-06-15', 
    time: '06:00 PM', 
    status: 'Cancelled', 
    seats: 2, 
    fare: 220,
    type: 'scheduled',
    canCancel: false,
    driver: 'John Doe'
  },
];

const MyRidesScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState('upcoming');

  const rides = tab === 'upcoming' ? mockUpcoming : mockPast;

  const handleCancelRide = (rideId: number, rideName: string) => {
    Alert.alert(
      'Cancel Ride',
      `Are you sure you want to cancel your ride from ${rideName}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Here you would typically make an API call to cancel the ride
            console.log('Cancelling ride:', rideId);
            Alert.alert('Success', 'Your ride has been cancelled successfully.');
          },
        },
      ]
    );
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return '#34C759';
      case 'Active': return '#007AFF';
      case 'Pending': return '#FF9500';
      case 'Completed': return '#34C759';
      case 'Cancelled': return '#FF3B30';
      default: return '#666666';
    }
  };

  const getRideTypeIcon = (type: string) => {
    return type === 'scheduled' ? 'calendar-clock' : 'clock-fast';
  };

  const getRideTypeColor = (type: string) => {
    return type === 'scheduled' ? '#007AFF' : '#34C759';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
        <Text style={styles.subtitle}>Track your ride history</Text>
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Past', value: 'past' },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {rides.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {tab === 'upcoming' ? 'No upcoming rides.' : 'No past rides.'}
            </Text>
          </View>
        ) : (
          rides.map(ride => (
            <Card 
              key={ride.id} 
              style={styles.rideCard} 
              onPress={() => navigation && navigation.navigate('RideDetails', { rideId: ride.id })}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.routeInfo}>
                    <View style={styles.routeRow}>
                      <Text style={styles.routeText}>📍 {ride.from} → 🏢 {ride.to}</Text>
                      <Chip 
                        icon={getRideTypeIcon(ride.type)}
                        style={[styles.typeChip, { backgroundColor: getRideTypeColor(ride.type) + '20' }]}
                        textStyle={[styles.typeText, { color: getRideTypeColor(ride.type) }]}
                      >
                        {ride.type === 'scheduled' ? 'Scheduled' : 'Immediate'}
                      </Chip>
                    </View>
                    <Text style={styles.dateTimeText}>⏰ {ride.date} at {ride.time}</Text>
                    <Text style={styles.driverText}>👤 Driver: {ride.driver}</Text>
                  </View>
                  
                  <View style={styles.headerRight}>
                    <Chip 
                      style={[styles.statusChip, { backgroundColor: getStatusChipColor(ride.status) }]}
                      textStyle={styles.statusText}
                    >
                      {ride.status}
                    </Chip>
                    
                    {ride.canCancel && tab === 'upcoming' && (
                      <IconButton
                        icon="close-circle"
                        iconColor="#FF3B30"
                        size={24}
                        onPress={() => handleCancelRide(ride.id, `${ride.from} to ${ride.to}`)}
                        style={styles.cancelButton}
                      />
                    )}
                  </View>
                </View>
                
                <View style={styles.rideDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Seats</Text>
                    <Text style={styles.detailValue}>{ride.seats}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Fare</Text>
                    <Text style={styles.detailValue}>Rs. {ride.fare}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={styles.detailValue}>Rs. {ride.fare * ride.seats}</Text>
                  </View>
                </View>

                {ride.type === 'scheduled' && ride.canCancel && tab === 'upcoming' && (
                  <Text style={styles.cancelNote}>
                    You can cancel this scheduled ride up to 1 hour before departure
                  </Text>
                )}

                <View style={styles.rideFooter}>
                  <Text style={styles.seatsText}>👥 {ride.seats} seat{ride.seats > 1 ? 's' : ''}</Text>
                  <Text style={styles.fareText}>💰 Rs. {ride.fare}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
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
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  segmentedButtons: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
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
  routeInfo: {
    flex: 1,
    marginRight: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    flex: 1,
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
  },
  dateTimeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  driverText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#999999',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  cancelButton: {
    margin: 0,
    marginTop: 4,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  cancelNote: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  seatsText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  fareText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
});

export default MyRidesScreen; 