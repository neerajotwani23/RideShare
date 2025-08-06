import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const MainApp = ({ navigation }: any) => {
  const { currentRole, isAuthenticated, roleSelected, profileSetupComplete, vehicleDetailsComplete, user } = useAuth();

  useEffect(() => {
    console.log('🏠 MainApp - Auth state:', {
      isAuthenticated,
      roleSelected,
      profileSetupComplete,
      vehicleDetailsComplete,
      currentRole
    });
    
    // Add detailed debugging for vehicle details
    if (user && currentRole === 'driver') {
      console.log('🚗 MainApp - Vehicle details debug:', {
        userType: user.user_type,
        drivingLicense: user.driving_license,
        hasDrivingLicense: !!(user.driving_license && user.driving_license.trim()),
        vehicleDetailsComplete,
        user: user
      });
    }
    
    // This screen acts as a router for authenticated users
    // The AppNavigator will handle the actual routing based on auth state
    if (isAuthenticated && roleSelected && profileSetupComplete) {
      if (currentRole === 'driver' && !vehicleDetailsComplete) {
        console.log('➡️ MainApp: Navigating to VehicleDetails');
        navigation.replace('VehicleDetails');
      } else if (currentRole === 'passenger') {
        console.log('➡️ MainApp: Navigating to PassengerTabs');
        navigation.replace('PassengerTabs');
      } else if (currentRole === 'driver') {
        console.log('➡️ MainApp: Navigating to DriverTabs');
        navigation.replace('DriverTabs');
      }
    }
  }, [isAuthenticated, roleSelected, profileSetupComplete, vehicleDetailsComplete, currentRole, navigation, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0A80ED" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Medium',
  },
});

export default MainApp; 