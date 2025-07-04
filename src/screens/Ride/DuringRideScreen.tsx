import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, Button, Card, Avatar, IconButton } from 'react-native-paper';
import { COLORS } from '../../constants/colors';

const DuringRideScreen = ({ navigation, route }: any) => {
  const { rideData } = route.params || {};

  const handleEndRide = () => {
    navigation.navigate('RateRide', { rideData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#000000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Trip in Progress</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>🗺️ Live Map View</Text>
        <Text style={styles.mapSubtext}>Tracking your route in real-time</Text>
      </View>

      <Card style={styles.personCard}>
        <Card.Content style={styles.personContent}>
          <Avatar.Text size={50} label="JD" style={styles.avatar} />
          <View style={styles.personInfo}>
            <Text style={styles.personName}>John Doe</Text>
            <Text style={styles.personRole}>Driver</Text>
            <Text style={styles.rating}>⭐ 4.8</Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleEndRide}
        style={styles.endRideButton}
        labelStyle={styles.buttonLabel}
      >
        End Ride
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    flex: 1,
    textAlign: 'center',
  },
  mapContainer: {
    height: 250,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  mapPlaceholder: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.accent,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  personCard: {
    margin: 16,
    borderRadius: 12,
  },
  personContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  personInfo: {
    flex: 1,
    marginLeft: 16,
  },
  personName: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  personRole: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  endRideButton: {
    margin: 16,
    marginTop: 24,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.primary,
    paddingVertical: 8,
  },
});

export default DuringRideScreen; 