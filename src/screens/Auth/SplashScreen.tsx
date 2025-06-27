import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // For now, let's navigate directly to Login to test
      // Later we can add proper authentication state management
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

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