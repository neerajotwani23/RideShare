import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleSignInService } from '../services/googleSignInService';
import { GOOGLE_CONFIG } from '../config/googleConfig';

interface UnifiedGoogleSignInProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  style?: any;
  textStyle?: any;
  navigation?: any;
  isOnSignupScreen?: boolean; // Add this prop to differentiate behavior
}

const UnifiedGoogleSignIn: React.FC<UnifiedGoogleSignInProps> = ({
  onSuccess,
  onError,
  style,
  textStyle,
  navigation,
  isOnSignupScreen = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Reset attempt flag when component mounts or screen changes
  useEffect(() => {
    setHasAttempted(false);
  }, [isOnSignupScreen]);

  const handleGoogleSignIn = async () => {
    if (isLoading || hasAttempted) {
      console.log('🚫 Google Sign-In already in progress or attempted');
      return;
    }
    
    console.log('🚀 Starting Google Sign-In process...');
    setIsLoading(true);
    setHasAttempted(true);
    
    try {
      console.log('📞 Calling Google Sign-In service...');
      
      // Call Google Sign-In service directly
      const data = await GoogleSignInService.loginWithGoogle();
      
      console.log('✅ Google Sign-In successful:', data);
      
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      
      // Check if error indicates user doesn't exist or requires signup
      const errorMessage = error.message || 'Google Sign-In failed';
      console.log('🔍 Error message:', errorMessage);

      if (errorMessage === 'USER_REQUIRES_SIGNUP' ||
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('User not found') ||
          errorMessage.includes('Invalid credentials')) {
        // User doesn't exist or requires signup completion
        if (isOnSignupScreen) {
          // If we're already on signup screen, just show an error
          console.log('ℹ️ Already on signup screen - user needs to complete the form');
          if (onError) {
            onError('Please complete the signup form with your details');
          } else {
            Alert.alert('Signup Required', 'Please complete the signup form with your details');
          }
        } else {
          // Navigate to signup screen
          console.log('🔄 New user detected - navigating to signup screen');
          if (navigation) {
            // Get Google user data for signup
            try {
              const userInfo = await GoogleSignin.getCurrentUser();
              const googleUserData = {
                id: (userInfo as any).user?.id || (userInfo as any).id || '',
                name: (userInfo as any).user?.name || (userInfo as any).name || '',
                email: (userInfo as any).user?.email || (userInfo as any).email || '',
                photo: (userInfo as any).user?.photo || (userInfo as any).photo || undefined,
                familyName: (userInfo as any).user?.familyName || (userInfo as any).familyName || undefined,
                givenName: (userInfo as any).user?.givenName || (userInfo as any).givenName || undefined,
              };
              console.log('📋 Pre-filling signup form with Google data');
              navigation.navigate('Signup', { googleUserData });
            } catch (getUserError) {
              console.error('❌ Error getting Google user data:', getUserError);
              navigation.navigate('Signup');
            }
          } else {
            Alert.alert('Error', 'Navigation not available');
          }
        }
      } else if (errorMessage.includes('Google account mismatch') ||
                 errorMessage.includes('already linked to another email')) {
        // Google account linking issues
        console.log('🔗 Google account linking issue:', errorMessage);
        if (onError) {
          onError(errorMessage);
        } else {
          Alert.alert('Account Linking Error', errorMessage);
        }
      } else {
        // Other error
        console.log('❓ Other error:', errorMessage);
        if (onError) {
          onError(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } finally {
      console.log('🏁 Finishing Google Sign-In process');
      setIsLoading(false);
      // Reset the attempt flag after a delay to allow for navigation
      setTimeout(() => {
        console.log('🔄 Resetting attempt flag');
        setHasAttempted(false);
      }, 2000);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleGoogleSignIn}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#4285F4" size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.icon, textStyle]}>G</Text>
          <Text style={[styles.text, textStyle]}>
            Continue with Google
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3c4043',
  },
});

export default UnifiedGoogleSignIn; 