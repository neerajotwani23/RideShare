import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const { isAuthenticated, roleSelected, profileSetupComplete } = useAuth();
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
        // Navigate based on authentication state
        if (isAuthenticated && roleSelected && profileSetupComplete) {
          navigation.replace('MainTabs');
        } else if (isAuthenticated && roleSelected && !profileSetupComplete) {
          navigation.replace('ProfileSetup');
        } else if (isAuthenticated && !roleSelected) {
          navigation.replace('RoleSelection');
        } else {
          navigation.replace('Login');
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, roleSelected, profileSetupComplete, fadeAnim, scaleAnim]);

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