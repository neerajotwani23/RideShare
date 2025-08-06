import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Avatar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { COLORS } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { userProfile, walletBalance, isRefreshing } = useApp();
  const { user } = useAuth();

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
      onPress: () => navigation.navigate('Wallet')
    },
  ];

  const getUserName = () => {
    if (userProfile) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
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

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.quickActionCard}
                onPress={action.onPress}
              >
                <Icon name={action.icon} size={32} color={COLORS.accent} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Card style={styles.walletCard}>
          <Card.Content style={styles.walletContent}>
            <View style={styles.walletHeader}>
              <Icon name="wallet-outline" size={24} color={COLORS.accent} />
              <Text style={styles.walletTitle}>Wallet Balance</Text>
            </View>
            <Text style={styles.walletBalance}>
              Rs. {walletBalance.toFixed(2)}
            </Text>
            <TouchableOpacity 
              style={styles.addMoneyButton}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
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
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  walletCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletContent: {
    padding: 24,
    alignItems: 'center',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginLeft: 8,
  },
  walletBalance: {
    fontSize: 36,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  addMoneyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  addMoneyText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
});

export default HomeScreen; 