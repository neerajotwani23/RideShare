import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const { isAuthenticated, roleSelected, profileSetupComplete } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate session check - navigate based on authentication state
      if (isAuthenticated && roleSelected && profileSetupComplete) {
        // User has a valid session and completed setup - go to main app
        navigation.replace('MainTabs');
      } else if (isAuthenticated && roleSelected && !profileSetupComplete) {
        // User logged in and selected role but didn't complete profile setup
        navigation.replace('ProfileSetup');
      } else if (isAuthenticated && !roleSelected) {
        // User logged in but didn't select role
        navigation.replace('RoleSelection');
      } else {
        // No valid session - go to login
        navigation.replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, roleSelected, profileSetupComplete]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A59A2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: screenWidth * 0.6, // Same as LoginScreen (60% of screen width)
    height: screenWidth * 0.6,
  },
});

export default SplashScreen; 