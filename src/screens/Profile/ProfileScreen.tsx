import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Divider, ActivityIndicator } from 'react-native-paper';
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
import { useApp } from '../../context/AppContext';

const ProfileScreen = ({ navigation }: any) => {
  const [currentRole, setCurrentRole] = useState<'driver' | 'passenger' | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));
  const { logout, user } = useAuth();
  const { 
    userProfile, 
    reviewsReceived, 
    myRides, 
    refreshUserProfile, 
    refreshReviews, 
    refreshMyRides,
    updateUserRole,
    isLoading,
    isRefreshing 
  } = useApp();

  // Load data when component mounts
  useEffect(() => {
    refreshUserProfile();
    refreshReviews();
    refreshMyRides();
  }, []);

  // Set current role based on user data
  useEffect(() => {
    if (userProfile?.user_type) {
      // Convert database role to lowercase for local state
      const role = userProfile.user_type.toLowerCase();
      console.log('Setting role from database:', userProfile.user_type, '->', role);
      setCurrentRole(role as 'driver' | 'passenger');
      Animated.timing(animatedValue, {
        toValue: role === 'driver' ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [userProfile]);

  const handleRoleSwitch = async () => {
    // Don't allow switching if we're still loading or if there's no current role
    if (!currentRole || isRefreshing) {
      return;
    }
    
    const newRole = currentRole === 'driver' ? 'passenger' : 'driver';
    console.log('Switching role from:', currentRole, 'to:', newRole);
    
    try {
      // Update role in database
      await updateUserRole(newRole);
      
      // The profile will be refreshed automatically by updateUserRole
      // so we don't need to manually update local state here
      
      Alert.alert(
        'Role Updated',
        `Your account is now set to ${newRole} mode.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to update role. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const switchTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 90], // Move from left (3px) to right (90px)
  });

  const passengerTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.accent, COLORS.textSecondary],
  });

  const driverTextColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.accent],
  });

  // Get user data with fallbacks
  const getUserName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return 'User';
  };

  const getUserEmail = () => {
    return userProfile?.email || user?.email || 'No email';
  };

  const getUserBio = () => {
    return userProfile?.bio || 'No bio available';
  };

  const getUserPhone = () => {
    return userProfile?.phone_no || user?.phone_no || 'No phone';
  };

  const getTotalRides = () => {
    return myRides.length;
  };

  const getAverageRating = () => {
    if (reviewsReceived.length === 0) return 0;
    const totalRating = reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviewsReceived.length).toFixed(1);
  };

  const getTotalReviews = () => {
    return reviewsReceived.length;
  };

  if (isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {userProfile?.profile_picture ? (
              <Image 
                source={{ uri: userProfile.profile_picture }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <UserIcon size={60} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.name}>{getUserName()}</Text>
          <Text style={styles.email}>{getUserEmail()}</Text>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CarIcon size={24} color={COLORS.accent} />
                <Text style={styles.statNumber}>{getTotalRides()}</Text>
                <Text style={styles.statLabel}>Total Rides</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <StarIcon size={24} color={COLORS.accent} />
                <Text style={styles.statNumber}>{getAverageRating()}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <EditIcon size={24} color={COLORS.accent} />
                <Text style={styles.statNumber}>{getTotalReviews()}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{getUserBio()}</Text>
        </View>

        <View style={styles.roleSwitchSection}>
          <Text style={styles.sectionTitle}>Account Mode</Text>
          <View style={styles.roleSwitchContainer}>
            <TouchableOpacity 
              style={[
                styles.roleSwitch,
                (!currentRole || isRefreshing || isLoading) && styles.roleSwitchDisabled
              ]}
              onPress={handleRoleSwitch}
              activeOpacity={0.8}
              disabled={!currentRole || isRefreshing || isLoading}
            >
              <View style={styles.roleSwitchBackground}>
                <View style={styles.roleSwitchTextContainer}>
                  <Animated.Text 
                    style={[
                      styles.roleSwitchTextLeft,
                      { color: passengerTextColor }
                    ]}
                  >
                    {currentRole === 'passenger' ? 'Passenger' : (currentRole === 'driver' ? '' : 'Passenger')}
                  </Animated.Text>
                  <Animated.Text 
                    style={[
                      styles.roleSwitchTextRight,
                      { color: driverTextColor }
                    ]}
                  >
                    {currentRole === 'driver' ? 'Driver' : (currentRole === 'passenger' ? '' : 'Driver')}
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
                : currentRole === 'passenger'
                ? 'You can find and book rides'
                : 'Loading...'
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
              <UserEditIcon size={24} color={COLORS.accent} />
              <Text style={styles.menuButtonText}>Edit Profile</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation && navigation.navigate('Reviews')}
          >
            <View style={styles.menuButtonContent}>
              <StarIcon size={24} color={COLORS.accent} />
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
                <CarIcon size={24} color={COLORS.accent} />
                <Text style={styles.menuButtonText}>Vehicle Details</Text>
                <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation && navigation.navigate('HelpSupport')}
          >
            <View style={styles.menuButtonContent}>
              <HelpIcon size={24} color={COLORS.accent} />
              <Text style={styles.menuButtonText}>Help & Support</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation && navigation.navigate('Settings')}
          >
            <View style={styles.menuButtonContent}>
              <SettingsIcon size={24} color={COLORS.accent} />
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
              <Text style={[styles.menuButtonText, { color: COLORS.error }]}>Logout</Text>
              <ArrowLeftIcon size={20} color={COLORS.textSecondary} style={styles.chevronIcon} />
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
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    backgroundColor: '#E5E5EA',
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
    backgroundColor: COLORS.accent,
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
  roleSwitchDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen; 