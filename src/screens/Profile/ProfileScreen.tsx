import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import { 
  UserIcon, 
  CarIcon, 
  StarIcon, 
  EditIcon, 
  SettingsIcon, 
  HelpIcon, 
  LogoutIcon, 
  ArrowLeftIcon,
  UserEditIcon
} from '../../components/icons';
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
    outputRange: [3, 90], // Move from left (3px) to right (90px)
  });

  const passengerTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.primary, COLORS.textSecondary],
  });

  const driverTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.primary],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserIcon size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CarIcon size={24} color={COLORS.secondary} />
                <Text style={styles.statNumber}>{user.rides}</Text>
                <Text style={styles.statLabel}>Total Rides</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <StarIcon size={24} color={COLORS.secondary} />
                <Text style={styles.statNumber}>{user.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <EditIcon size={24} color={COLORS.secondary} />
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
              <View style={styles.roleSwitchBackground}>
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
              </View>
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
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation && navigation.navigate('EditProfile')}
          >
            <View style={styles.menuButtonContent}>
              <UserEditIcon size={24} color={COLORS.secondary} />
              <Text style={styles.menuButtonText}>Edit Profile</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation && navigation.navigate('Reviews')}
          >
            <View style={styles.menuButtonContent}>
              <StarIcon size={24} color={COLORS.secondary} />
              <Text style={styles.menuButtonText}>My Reviews</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          {currentRole === 'driver' && (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => navigation && navigation.navigate('VehicleDetails')}
            >
              <View style={styles.menuButtonContent}>
                <CarIcon size={24} color={COLORS.secondary} />
                <Text style={styles.menuButtonText}>Vehicle Details</Text>
                <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => {/* Handle help */}}
          >
            <View style={styles.menuButtonContent}>
              <HelpIcon size={24} color={COLORS.secondary} />
              <Text style={styles.menuButtonText}>Help & Support</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => {/* Handle settings */}}
          >
            <View style={styles.menuButtonContent}>
              <SettingsIcon size={24} color={COLORS.secondary} />
              <Text style={styles.menuButtonText}>Settings</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleLogout}
          >
            <View style={styles.menuButtonContent}>
              <LogoutIcon size={24} color={COLORS.error} />
              <Text style={[styles.menuButtonText, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  statsCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    backgroundColor: COLORS.border,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.secondary,
    marginBottom: 4,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  menuItems: {
    flex: 1,
  },
  menuButton: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    marginLeft: 12,
    flex: 1,
  },
  chevronIcon: {
    transform: [{ rotate: '180deg' }],
  },
  logoutText: {
    color: COLORS.error,
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
    backgroundColor: COLORS.textSecondary,
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
    paddingLeft: 35,
  },
  roleSwitchThumb: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
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
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileScreen; 