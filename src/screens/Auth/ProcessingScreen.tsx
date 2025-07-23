import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

interface ProcessingScreenProps {
  message?: string;
  onComplete?: () => void;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ 
  message = 'Setting up your account...',
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const steps = [
    'Verifying your account...',
    'Loading your profile...',
    'Checking your preferences...',
    'Preparing your experience...'
  ];

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

    // Cycle through different messages
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 500); // Change message every 500ms

    // Complete after 2 seconds
    const completionTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completionTimer);
    };
  }, [onComplete, steps.length, fadeAnim, scaleAnim]);

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
      
      <Animated.View style={[
        styles.processingContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.message}>{steps[currentStep]}</Text>
        <Text style={styles.subMessage}>Please wait while we prepare your experience</Text>
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
    marginBottom: 40,
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
  },
  processingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  message: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
});

export default ProcessingScreen; 