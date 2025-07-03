import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Text, Button, Card, SegmentedButtons, Chip, IconButton } from 'react-native-paper';
import { LocationIcon, LocationCheckIcon, ClockIcon, UserIcon, UsersIcon } from '../../components/icons';
import { COLORS } from '../../constants/colors';

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
      case 'Confirmed': return COLORS.success;
      case 'Active': return COLORS.accent;
      case 'Pending': return '#FF9500';
      case 'Completed': return COLORS.success;
      case 'Cancelled': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getRideTypeIcon = (type: string) => {
    return type === 'scheduled' ? 'calendar-clock' : 'clock-fast';
  };

  const getRideTypeColor = (type: string) => {
    return type === 'scheduled' ? COLORS.accent : COLORS.success;
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
          { 
            label: 'Upcoming', 
            value: 'upcoming',
            style: { 
              backgroundColor: tab === 'upcoming' ? COLORS.secondary : COLORS.lightGray,
              borderRadius: 8 
            },
            labelStyle: { 
              color: tab === 'upcoming' ? COLORS.primary : COLORS.secondary,
              fontFamily: 'Montserrat-Bold' 
            }
          },
          { 
            label: 'Past', 
            value: 'past',
            style: { 
              backgroundColor: tab === 'past' ? COLORS.secondary : COLORS.lightGray,
              borderRadius: 8 
            },
            labelStyle: { 
              color: tab === 'past' ? COLORS.primary : COLORS.secondary,
              fontFamily: 'Montserrat-Bold' 
            }
          },
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
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <LocationIcon size={18} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.routeText}>{ride.from}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <LocationCheckIcon size={18} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.routeText}>{ride.to}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <ClockIcon size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                      <Text style={styles.dateTimeText}>{ride.date} at {ride.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <UserIcon size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                      <Text style={styles.driverText}>Driver: {ride.driver}</Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8 }}>
                      <Chip 
                        icon={getRideTypeIcon(ride.type)}
                        style={[styles.typeChip, { backgroundColor: getRideTypeColor(ride.type) + '20' }]}
                        textStyle={[styles.typeText, { color: getRideTypeColor(ride.type) }]}
                      >
                        {ride.type === 'scheduled' ? 'Scheduled' : 'Immediate'}
                      </Chip>
                    </View>
                  <View style={styles.headerRight}>
                    <Chip 
                      style={[styles.statusChip, { backgroundColor: getStatusChipColor(ride.status) }]}
                      textStyle={styles.statusText}
                    >
                      {ride.status}
                    </Chip>
                    {ride.canCancel && tab === 'upcoming' && (
                      <Button
                        mode="text"
                        onPress={() => handleCancelRide(ride.id, `${ride.from} to ${ride.to}`)}
                        labelStyle={{ color: COLORS.error, fontFamily: 'Montserrat-Bold', fontSize: 14 }}
                        style={{ marginTop: 4 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </View>
                </View>
                
                <View style={styles.rideDetails}>
                  <View style={styles.detailItem}>
                    <UsersIcon size={16} color={COLORS.textSecondary} style={{ marginBottom: 2 }} />
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
    backgroundColor: COLORS.primary,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  segmentedButtons: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rideCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    backgroundColor: COLORS.lightGray,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  dateTimeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  driverText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.darkGray,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  cancelNote: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MyRidesScreen; 