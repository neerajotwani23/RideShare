import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  Text,
  ActivityIndicator,
  StatusBar,
  Platform
} from 'react-native';
import { appInitializationService, InitializationProgress, InitializationResult } from '../../services/appInitializationService';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const [initializationProgress, setInitializationProgress] = useState<InitializationProgress | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    setProcessing,
    selectRole,
    completeProfileSetup,
    completeVehicleDetails
  } = useAuth();

  useEffect(() => {
    // Start animations immediately to prevent black screen
    startAnimations();
    
    // Initialize app
    initializeApp();
  }, []);

  const startAnimations = () => {
    // Start animations immediately to show splash screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  };

  const initializeApp = async () => {
    try {
      console.log('🚀 Starting app initialization...');
      
      // Set up progress callback
      appInitializationService.setProgressCallback((progress) => {
        setInitializationProgress(progress);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: progress.progress / progress.total,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });

      // Perform initialization
      const result: InitializationResult = await appInitializationService.initializeApp();
      
      console.log('✅ App initialization completed:', result);
      
      if (result.success) {
        // Update auth context with initialization results
        setProcessing(false);
        
        // Set role if authenticated and role is selected
        if (result.isAuthenticated && result.roleSelected && result.currentRole) {
          selectRole(result.currentRole);
        }
        
        // Complete profile setup if needed
        if (result.profileSetupComplete) {
          completeProfileSetup();
        }
        
        // Complete vehicle details if needed
        if (result.vehicleDetailsComplete) {
          completeVehicleDetails();
        }

        // Wait a bit to show completion, then navigate
        setTimeout(() => {
          navigateBasedOnAuthState(result);
        }, 500);
      } else {
        setError(result.error || 'Initialization failed');
        // Still navigate to login even if there's an error
        setTimeout(() => {
        navigation.replace('Login');
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ App initialization error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      // Navigate to login on error
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    } finally {
      setIsInitializing(false);
    }
  };

  const navigateBasedOnAuthState = (result: InitializationResult) => {
    if (!result.isAuthenticated) {
      navigation.replace('Login');
    } else if (!result.roleSelected) {
      navigation.replace('RoleSelection');
    } else if (!result.profileSetupComplete) {
      navigation.replace('ProfileSetup');
    } else if (result.currentRole === 'driver' && !result.vehicleDetailsComplete) {
      navigation.replace('VehicleDetails');
    } else {
      // User is fully set up, navigate to main app
      // The AppNavigator will handle the routing
      navigation.replace('Login'); // This will trigger the AppNavigator to show the correct screen
    }
  };

  const getProgressText = () => {
    if (error) {
      return `Error: ${error}`;
    }
    if (initializationProgress) {
      return initializationProgress.message;
    }
    return 'Initializing app...';
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0A80ED"
        translucent={true}
      />
      
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
        
        <Text style={styles.appName}>RideShare</Text>
        
        {isInitializing && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{getProgressText()}</Text>
            
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
            
            {initializationProgress && (
              <Text style={styles.progressStep}>
                {initializationProgress.step} ({initializationProgress.progress}/{initializationProgress.total})
              </Text>
            )}
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Text style={styles.errorSubtext}>Redirecting to login...</Text>
          </View>
        )}
        
        {!isInitializing && !error && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✅ Ready!</Text>
          </View>
        )}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoImage: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    fontFamily: 'Montserrat-Bold',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Montserrat-Medium',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressStep: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Montserrat-Regular',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FFE5E5',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Montserrat-Medium',
  },
  errorSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Montserrat-Regular',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
});

export default SplashScreen; 