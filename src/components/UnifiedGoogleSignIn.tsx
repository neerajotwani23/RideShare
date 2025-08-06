import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';

interface UnifiedGoogleSignInProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  style?: any;
  textStyle?: any;
  navigation?: any;
  isOnSignupScreen?: boolean;
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
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    if (isLoading) {
      console.log('🚫 Google Sign-In already in progress');
      return;
    }
    
    console.log('🚀 Starting Google Sign-In process...');
    setIsLoading(true);
    
    try {
      // Validate configuration first
      if (!GoogleSignInService.validateConfiguration()) {
        throw new Error('Google Sign-In is not properly configured');
      }
      
      // Login with Google (this handles sign-in, token, and backend call internally)
      console.log('🚀 Starting Google login process...');
      const response = await loginWithGoogle();
      console.log('📥 Backend response:', response);
      
      // If successful, call onSuccess
      if (onSuccess) {
        onSuccess(response);
      }
      
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);
      
      const errorMessage = error.message || 'Google Sign-In failed';
      console.log('🔍 Error message:', errorMessage);

      if (errorMessage === 'USER_REQUIRES_SIGNUP' ||
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('User not found') ||
          errorMessage.includes('Invalid credentials')) {
        
        // User doesn't exist - navigate to signup with Google data
        console.log('🔄 New user detected - navigating to signup screen');
        
        if (navigation) {
          try {
            // Get Google user data for signup pre-filling before signing out
            const googleUser = await GoogleSignInService.getCurrentUser();
            let googleUserData = null;
            
            if (googleUser) {
              googleUserData = {
                id: googleUser.id,
                name: googleUser.name,
                email: googleUser.email,
                photo: googleUser.photo,
                familyName: googleUser.familyName,
                givenName: googleUser.givenName,
                auth_provider: 'google',
              };
              console.log('📋 Google data for signup pre-filling:', googleUserData);
            }
            
            // Navigate to signup with Google data first, then sign out
            if (googleUserData) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Signup', params: { googleUserData } }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Signup' }],
              });
            }
            
            // Sign out from Google after navigation to prevent state conflicts
            setTimeout(async () => {
              try {
                await GoogleSignInService.signOut();
                console.log('✅ Signed out from Google after signup navigation');
              } catch (signOutError) {
                console.log('ℹ️ Sign out error (continuing anyway):', signOutError);
              }
            }, 1000);
            
          } catch (getUserError) {
            console.error('❌ Error getting Google user data:', getUserError);
            // Navigate to signup first, then sign out
            navigation.navigate('Signup');
            
            setTimeout(async () => {
              try {
                await GoogleSignInService.signOut();
                console.log('✅ Signed out from Google after error');
              } catch (signOutError) {
                console.log('ℹ️ Sign out error:', signOutError);
              }
            }, 1000);
          }
        } else {
          Alert.alert('Error', 'Navigation not available');
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
      } else if (errorMessage.includes('cancelled by user')) {
        // User cancelled the sign-in - don't show error
        console.log('🚫 User cancelled Google Sign-In');
      } else if (errorMessage.includes('Google Play Services not available')) {
        // Play Services issue
        console.log('📱 Google Play Services issue:', errorMessage);
        if (onError) {
          onError('Please update Google Play Services to use Google Sign-In');
        } else {
          Alert.alert('Google Play Services Required', 'Please update Google Play Services to use Google Sign-In');
        }
      } else if (errorMessage.includes('configuration error')) {
        // Configuration issue
        console.log('⚙️ Configuration issue:', errorMessage);
        if (onError) {
          onError('Google Sign-In is not properly configured. Please contact support.');
        } else {
          Alert.alert('Configuration Error', 'Google Sign-In is not properly configured. Please contact support.');
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