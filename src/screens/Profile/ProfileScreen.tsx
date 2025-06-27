import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Text, Button, Avatar, Card, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const mockUser = {
  name: 'Ahmed Khan',
  gender: 'Male',
  bio: 'Passionate about sustainable transportation and meeting new people through carpooling.',
  rides: 23,
  rating: 4.8,
  phone: '+92 300 1234567',
  email: 'ahmed.khan@email.com',
  role: 'driver', // This would come from context in real app
};

const ProfileScreen = ({ navigation }: any) => {
  const user = mockUser;
  const [currentRole, setCurrentRole] = useState(user.role);
  const [animatedValue] = useState(new Animated.Value(user.role === 'driver' ? 1 : 0));
  const { logout } = useAuth();

  const handleRoleSwitch = () => {
    const newRole = currentRole === 'driver' ? 'passenger' : 'driver';
    setCurrentRole(newRole);
    
    Animated.timing(animatedValue, {
      toValue: newRole === 'driver' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = () => {
    logout();
    // Navigation will be handled automatically by AppNavigator based on auth state
  };

  const switchTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 90], // Move from left (3px) to right (63px)
  });

  const passengerTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#666666'],
  });

  const driverTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#666666', '#FFFFFF'],
  });

  const switchBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#34C759', '#007AFF'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.rides}</Text>
                <Text style={styles.statLabel}>Total Rides</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>

        <View style={styles.roleSwitchSection}>
          <Text style={styles.sectionTitle}>Account Mode</Text>
          <View style={styles.roleSwitchContainer}>
            <TouchableOpacity 
              style={styles.roleSwitch}
              onPress={handleRoleSwitch}
              activeOpacity={0.8}
            >
              <Animated.View 
                style={[
                  styles.roleSwitchBackground,
                  { backgroundColor: switchBackgroundColor }
                ]}
              >
                <View style={styles.roleSwitchTextContainer}>
                  <Animated.Text 
                    style={[
                      styles.roleSwitchTextLeft,
                      { color: passengerTextColor }
                    ]}
                  >
                    {currentRole === 'passenger' ? 'Passenger' : ''}
                  </Animated.Text>
                  <Animated.Text 
                    style={[
                      styles.roleSwitchTextRight,
                      { color: driverTextColor }
                    ]}
                  >
                    {currentRole === 'driver' ? 'Driver' : ''}
                  </Animated.Text>
                </View>
                <Animated.View 
                  style={[
                    styles.roleSwitchThumb,
                    { transform: [{ translateX: switchTranslateX }] }
                  ]}
                />
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.roleSwitchDescription}>
              {currentRole === 'driver' 
                ? 'You can offer rides to passengers' 
                : 'You can find and book rides'
              }
            </Text>
          </View>
        </View>

        <View style={styles.menuItems}>
          <Button 
            mode="contained-tonal" 
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
            onPress={() => navigation && navigation.navigate('EditProfile')}
            icon="account-edit"
          >
            Edit Profile
          </Button>

          <Button 
            mode="contained-tonal" 
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
            onPress={() => navigation && navigation.navigate('Reviews')}
            icon="star"
          >
            My Reviews
          </Button>

          {currentRole === 'driver' && (
            <Button 
              mode="contained-tonal" 
              style={styles.menuButton}
              contentStyle={styles.menuButtonContent}
              onPress={() => navigation && navigation.navigate('VehicleDetails')}
              icon="car"
            >
              Vehicle Details
            </Button>
          )}

          <Button 
            mode="contained-tonal" 
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
            onPress={() => navigation && navigation.navigate('Wallet')}
            icon="wallet"
          >
            Wallet
          </Button>

          <Button 
            mode="contained-tonal" 
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
            onPress={() => navigation && navigation.navigate('Notifications')}
            icon="bell"
          >
            Notifications
          </Button>

          <Button 
            mode="contained-tonal" 
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
            icon="help-circle"
          >
            Help & Support
          </Button>

          <Button 
            mode="contained-tonal" 
            style={[styles.menuButton, styles.logoutButton]}
            contentStyle={styles.menuButtonContent}
            onPress={handleLogout}
            icon="logout"
          >
            Logout
          </Button>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#007AFF',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  statsCard: {
    marginBottom: 24,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    height: 40,
    width: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    lineHeight: 24,
  },
  menuItems: {
    flex: 1,
  },
  menuButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  menuButtonContent: {
    paddingVertical: 8,
    justifyContent: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 16,
  },
  roleSwitchSection: {
    marginBottom: 24,
  },
  roleSwitchContainer: {
    alignItems: 'center',
  },
  roleSwitch: {
    marginBottom: 12,
  },
  roleSwitchBackground: {
    width: 130,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  roleSwitchTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 3,
  },
  roleSwitchTextLeft: {
    flex: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'right',
    lineHeight: 40,
    paddingLeft: 50,
    
  },
  roleSwitchTextRight: {
    position: 'absolute',
    left: 0,
    flex: 0,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'left',
    lineHeight: 40,
    paddingLeft:35,
  },
  roleSwitchThumb: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
    top: 3,
  },
  roleSwitchDescription: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileScreen; 