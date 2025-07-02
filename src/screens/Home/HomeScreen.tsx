import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Searchbar, FAB, Avatar } from 'react-native-paper';
import Icon from '../../components/Icon';

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
            iconColor="#666666"
          />
        </View>

        <Card style={styles.mapCard}>
          <Card.Content style={styles.mapContent}>
            <Icon name="map-marker" size={48} color="#666666" style={styles.mapIcon} />
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
                    color="#007AFF"
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
                    <Icon name="map-marker" size={16} color="#007AFF" />
                    <Text style={styles.rideFrom}>Downtown</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color="#34C759" />
                    <Text style={styles.rideTo}>Business District</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color="#666666" />
                    <Text style={styles.rideTime}>8:30 AM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color="#666666" />
                    <Text style={styles.ridePrice}>Rs. 150</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card style={styles.rideCard}>
              <Card.Content style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={16} color="#007AFF" />
                    <Text style={styles.rideFrom}>University</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color="#34C759" />
                    <Text style={styles.rideTo}>Mall</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color="#666666" />
                    <Text style={styles.rideTime}>2:00 PM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color="#666666" />
                    <Text style={styles.ridePrice}>Rs. 200</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
            <Card style={styles.rideCard}>
              <Card.Content style={styles.rideCardContent}>
                <View style={styles.rideHeader}>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={16} color="#007AFF" />
                    <Text style={styles.rideFrom}>Airport</Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <Icon name="map-marker-check" size={16} color="#34C759" />
                    <Text style={styles.rideTo}>City Center</Text>
                  </View>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.rideDetail}>
                    <Icon name="clock-outline" size={16} color="#666666" />
                    <Text style={styles.rideTime}>6:15 PM</Text>
                  </View>
                  <View style={styles.rideDetail}>
                    <Icon name="currency-inr" size={16} color="#666666" />
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
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  profileAvatar: {
    backgroundColor: '#007AFF',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  mapCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
  },
  mapContent: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  mapIcon: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666666',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#999999',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    margin: 0,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    textAlign: 'center',
  },
  suggestedRides: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  rideCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
  },
  rideCardContent: {
    padding: 12,
  },
  rideHeader: {
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rideFrom: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginLeft: 4,
  },
  rideTo: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginLeft: 4,
  },
  rideTime: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  ridePrice: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
    marginLeft: 4,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HomeScreen; 