import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Text , Button, Card, SegmentedButtons, Chip, IconButton, Checkbox } from 'react-native-paper';
import { LocationIcon, LocationCheckIcon, ClockIcon, UserIcon, UsersIcon } from '../../components/icons';
import { COLORS } from '../../constants/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
import { I18nManager } from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusFilters, setStatusFilters] = useState({ Confirmed: true, Active: true, Pending: true });

  const rides = (tab === 'upcoming' ? mockUpcoming : mockPast).filter(ride => {
    if (tab === 'upcoming') {
      return statusFilters[ride.status as keyof typeof statusFilters];
    } else {
      // For past, only filter if status is Confirmed, Active, or Pending
      if (['Confirmed', 'Active', 'Pending'].includes(ride.status)) {
        return statusFilters[ride.status as keyof typeof statusFilters];
      }
      return true;
    }
  });

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
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>My Rides</Text>
          <Text style={styles.subtitle}>Track your ride history</Text>
        </View>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
          <IconButton icon="filter" size={24} iconColor={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Status</Text>
            {(['Confirmed', 'Active', 'Pending'] as const).map((status) => (
              <View key={status} style={styles.checkboxRow}>
                <Checkbox
                  status={statusFilters[status] ? 'checked' : 'unchecked'}
                  onPress={() => setStatusFilters(f => ({ ...f, [status]: !f[status] }))}
                  color={COLORS.accent}
                />
                <Text style={styles.checkboxLabel}>{status}</Text>
              </View>
            ))}
            <Button mode="contained" style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
              Apply
            </Button>
          </View>
        </View>
      </Modal>

      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { 
            label: 'Upcoming', 
            value: 'upcoming',
            style: { 
              backgroundColor: tab === 'upcoming' ? COLORS.secondary : COLORS.lightGray,
              borderRadius: 24,
            },
            labelStyle: { 
              color: tab === 'upcoming' ? COLORS.primary : COLORS.secondary,
              fontFamily: 'Montserrat-Bold',
            },
          },
          { 
            label: 'Past', 
            value: 'past',
            style: { 
              backgroundColor: tab === 'past' ? COLORS.secondary : COLORS.lightGray,
              borderRadius: 24,
            },
            labelStyle: { 
              color: tab === 'past' ? COLORS.primary : COLORS.secondary,
              fontFamily: 'Montserrat-Bold',
            },
          },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView  keyboardShouldPersistTaps="handled"  showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {rides.length === 0 ? (
          <View style={styles.emptyState}>
            <Text  style={styles.emptyText}>
              {tab === 'upcoming' ? 'No upcoming rides.' : 'No past rides.'}
            </Text >
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
                    <View style={{ flexDirection: 'column', alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
                      <View style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', marginBottom: 2 }}>
                        <LocationIcon size={18} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                        <Text  style={styles.routeText}>{ride.from}</Text >
                      </View>
                      <View style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'}}>
                        <LocationCheckIcon size={18} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.routeText}>{ride.to}</Text >
                      </View>
                    </View>
                    <View style={{flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', marginBottom: 2 }}>
                      <ClockIcon size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                      <Text style={styles.dateTimeText}>{ride.date} at {ride.time}</Text >
                    </View>
                    <View style={{flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
                      <UserIcon size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                      <Text style={styles.driverText}>Driver: {ride.driver}</Text >
                    </View>
                  </View>
                  <View style={{flexDirection: 'column' }}>
                  <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginLeft: 12, marginBottom: 8 }}>
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
                        labelStyle={{ color: COLORS.error, fontFamily: 'Montserrat-Bold', fontSize: 12 }}
                        style={{ backgroundColor:'pink', width:100 , marginTop: 4 }}
                      >
                        Cancel
                      </Button>
                    )}
                  </View>
                  </View>
                </View>
                
                <View style={styles.rideDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Seats</Text >
                    <Text style={styles.detailValue}>{ride.seats}</Text >
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Fare</Text >
                    <Text style={styles.detailValue}>Rs. {ride.fare}</Text >
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total</Text >
                    <Text style={styles.detailValue}>Rs. {ride.fare * ride.seats}</Text >
                  </View>
                </View>

                {ride.type === 'scheduled' && ride.canCancel && tab === 'upcoming' && (
                  <Text style={styles.cancelNote}>
                    You can cancel this scheduled ride up to 1 hour before departure
                  </Text >
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
    padding: scale(24),
    paddingBottom: verticalScale(16),
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: 'Montserrat-Bold',
    color: COLORS.accent,
    marginBottom: 0,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  segmentedButtons: {
    marginHorizontal: scale(24),
    marginBottom: verticalScale(16),
    backgroundColor: COLORS.lightGray,
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(24),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(60),
  },
  emptyText: {
    fontSize: moderateScale(16),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  rideCard: {
    width: SCREEN_WIDTH - scale(48),
    marginBottom: verticalScale(16),
    borderRadius: scale(12),
    elevation: 2,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    padding: scale(16),
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
    marginRight: 12,
  },
  routeRow: {
    flexDirection: 'column',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    marginBottom: 4,
  },
  routeText: {
    fontSize: moderateScale(18),
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  typeChip: {
    alignSelf: 'flex-end',
    marginLeft: scale(8),
    backgroundColor: COLORS.lightGray,
  },
  typeText: {
    fontSize: moderateScale(10),
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  dateTimeText: {
    fontSize: moderateScale(14),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(2),
    minWidth: scale(100)
  },
  driverText: {
    fontSize: moderateScale(12),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.darkGray,
  },
  headerRight: {
    alignItems: 'flex-start',
    marginLeft: scale(22)
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: verticalScale(4),
  },
  statusText: {
    color: COLORS.primary,
    fontSize: moderateScale(12),
    fontFamily: 'Montserrat-Medium',
    minWidth: scale(65),
    textAlign: 'center',

  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: moderateScale(12),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(4),
  },
  detailValue: {
    fontSize: moderateScale(16),
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  cancelNote: {
    fontSize: moderateScale(11),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  filterButton: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 16,
    color: COLORS.secondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  applyButton: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
  },
});

export default MyRidesScreen; 