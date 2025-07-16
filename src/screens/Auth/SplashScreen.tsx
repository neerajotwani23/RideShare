import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const { isAuthenticated, roleSelected, profileSetupComplete, vehicleDetailsComplete, currentRole } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      // Fade out animation before navigation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Navigate based on authentication state and onboarding completion
        if (isAuthenticated && roleSelected && profileSetupComplete) {
          if (currentRole === 'driver' && !vehicleDetailsComplete) {
            // Driver needs to complete vehicle details
            navigation.replace('VehicleDetails');
          } else {
            // User has completed all required onboarding
            navigation.replace('MainTabs');
          }
        } else if (isAuthenticated && roleSelected && !profileSetupComplete) {
          // User needs to complete profile setup
          navigation.replace('ProfileSetup');
        } else if (isAuthenticated && !roleSelected) {
          // User needs to select role
          navigation.replace('RoleSelection');
        } else {
          // User is not authenticated
          navigation.replace('Login');
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, roleSelected, profileSetupComplete, vehicleDetailsComplete, currentRole, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={[styles.logoImage, { tintColor: '#FFFFFF' }]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
  },
});

export default SplashScreen; 