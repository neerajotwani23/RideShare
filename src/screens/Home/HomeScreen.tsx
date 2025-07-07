import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Avatar, Card } from 'react-native-paper';
import Icon from '../../components/Icon';
import { COLORS } from '../../constants/colors';

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const quickActions = [
    { 
      title: 'Post Ride', 
      icon: 'car',
      onPress: () => navigation.navigate('Post Ride')
    },
    { 
      title: 'Find Ride', 
      icon: 'magnify',
      onPress: () => navigation.navigate('Find Ride')
    },
    { 
      title: 'My Rides', 
      icon: 'format-list-bulleted',
      onPress: () => navigation.navigate('My Rides')
    },
    { 
      title: 'Wallet', 
      icon: 'wallet-outline',
      onPress: () => navigation.navigate('Profile')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning!</Text>
              <Text style={styles.subtitle}>Where are you going today?</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar.Icon 
                size={40} 
                icon="account" 
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search for a destination"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={COLORS.textSecondary}
          />
        </View>

        <Card style={styles.mapCard}>
          <Card.Content style={styles.mapContent}>
            <Icon name="map-marker" size={48} color={COLORS.textSecondary} style={styles.mapIcon} />
            <Text style={styles.mapPlaceholder}>Map Integration</Text>
            <Text style={styles.mapSubtext}>Interactive map will be displayed here</Text>
          </Card.Content>
        </Card>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={styles.actionIconContainer}>
                  <Icon
                    name={action.icon}
                    size={24}
                    color={COLORS.accent}
                    style={styles.actionIcon}
                  />
                </View>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.suggestedRides}>
          <Text style={styles.sectionTitle}>Suggested Rides</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Card style={styles.rideCard}>
              <Card.Content style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={16} color={COLORS.accent} />
                    <Text style={styles.rideFrom}>Downtown</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color={COLORS.success} />
                    <Text style={styles.rideTo}>Business District</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.rideTime}>8:30 AM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.ridePrice}>Rs. 150</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card style={styles.rideCard}>
              <Card.Content style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={16} color={COLORS.accent} />
                    <Text style={styles.rideFrom}>University</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color={COLORS.success} />
                    <Text style={styles.rideTo}>Mall</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.rideTime}>2:00 PM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.ridePrice}>Rs. 200</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card style={styles.rideCard}>
              <Card.Content style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={16} color={COLORS.accent} />
                    <Text style={styles.rideFrom}>Airport</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color={COLORS.success} />
                    <Text style={styles.rideTo}>City Center</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.rideTime}>6:15 PM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.ridePrice}>Rs. 500</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  profileAvatar: {
    backgroundColor: COLORS.accent,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapContent: {
    padding: 24,
    alignItems: 'center',
  },
  mapIcon: {
    marginBottom: 12,
  },
  mapPlaceholder: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    // Icon styling handled by Icon component
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  suggestedRides: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  rideCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rideCardContent: {
    padding: 16,
  },
  rideHeader: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rideFrom: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  rideTo: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideTime: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  ridePrice: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginLeft: 4,
  },
});

export default HomeScreen; 