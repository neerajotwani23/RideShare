import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import Icon from './Icon';
import { COLORS } from '../constants/colors';

interface RideCardProps {
  ride: {
    id: string;
    driver: string;
    rating: number;
    fare: string;
    from: string;
    to: string;
    departureTime: string;
    availableSeats: number;
    car: string;
    preferences: string[];
  };
  onPress?: () => void;
  showActions?: boolean;
  onRequest?: () => void;
  onRemove?: () => void;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  onPress,
  showActions = false,
  onRequest,
  onRemove,
}) => {
  return (
    <Card
      style={styles.rideCard}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.rideHeader}>
          <View style={styles.driverInfo}>
            <View style={styles.driverNameRow}>
              <Icon name="account" size={20} color={COLORS.accent} />
              <Text style={styles.driverName}>{ride.driver}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{ride.rating}</Text>
            </View>
          </View>
          <View style={styles.fareContainer}>
            <Icon name="currency-inr" size={16} color={COLORS.accent} />
            <Text style={styles.fare}>{ride.fare}</Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.routeRow}>
            <Icon name="map-marker" size={16} color={COLORS.accent} />
            <Text style={styles.routeText}>{ride.from}</Text>
          </View>
          <View style={styles.routeRow}>
            <Icon name="map-marker-check" size={16} color={COLORS.success} />
            <Text style={styles.routeText}>{ride.to}</Text>
          </View>
        </View>

        <View style={styles.rideDetails}>
          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{ride.departureTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="car-seat" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{ride.availableSeats} seats available</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="car" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{ride.car}</Text>
          </View>
        </View>

        <View style={styles.preferences}>
          {ride.preferences.map((pref, index) => (
            <Chip
              key={index}
              style={styles.preferenceChip}
              textStyle={styles.preferenceText}
            >
              {pref}
            </Chip>
          ))}
        </View>

        {showActions && (
          <View style={styles.buttonRow}>
            <Chip
              mode="flat"
              style={styles.requestButton}
              textStyle={styles.requestButtonLabel}
              onPress={onRequest}
            >
              <Text style={styles.requestButtonText}>Request</Text>
            </Chip>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  rideCard: {
    marginBottom: 16,
    borderRadius: 12,
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
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fare: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.accent,
    marginLeft: 4,
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  rideDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  preferenceChip: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: COLORS.lightGray,
  },
  preferenceText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
  },
  requestButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  requestButtonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  requestButtonText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  removeButton: {
    flex: 1,
    borderColor: COLORS.border,
  },
  removeButtonLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textSecondary,
  },
});

export default RideCard; 