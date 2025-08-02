import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, HelperText, Divider, TextInput, ActivityIndicator } from 'react-native-paper';


import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { CustomTextInput, CustomButton, FormCard, Icon } from '../../components';
import UnifiedGoogleSignIn from '../../components/UnifiedGoogleSignIn';
import { getDetailedErrorInfo, debugGoogleSignIn } from '../../utils/debugGoogleSignIn';
import { GOOGLE_CONFIG } from '../../config/googleConfig';
import { ENV_CONFIG } from '../../config/env';
import { api } from '../../services/api';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();

                // Test environment configuration on component mount
              useEffect(() => {
                console.log('🚀 LoginScreen mounted - testing environment...');
                console.log('✅ Environment loaded successfully');
              }, []);

              const handleDebugGoogleSignIn = async () => {
                console.log('🔍 Starting simple Google Sign-In test...');
                
                try {
                  // Test 1: Check configuration
                  console.log('1. Testing Google Sign-In configuration...');
                  console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);
                  console.log('API Base URL:', ENV_CONFIG.API_BASE_URL);
                  
                  // Test 1.5: Check if configuration is valid
                  if (!GOOGLE_CONFIG.webClientId || GOOGLE_CONFIG.webClientId.includes('YOUR_')) {
                    throw new Error('Invalid Web Client ID configuration');
                  }
                  
                  // Test 1.6: Check if Google Sign-In service is configured
                  console.log('1.6. Checking Google Sign-In service configuration...');
                  const { GoogleSignInService } = await import('../../services/googleSignInService');
                  const isServiceConfigured = GoogleSignInService.isConfigured();
                  console.log('Google Sign-In service configured:', isServiceConfigured);
                  
                  if (!isServiceConfigured) {
                    throw new Error('Google Sign-In service not properly configured');
                  }
                  
                  // Test 2: Check if Google Sign-In is available
                  console.log('2. Testing Google Sign-In availability...');
                  let GoogleSignin: any;
                  try {
                    const module = await import('@react-native-google-signin/google-signin');
                    GoogleSignin = module.GoogleSignin;
                    console.log('✅ GoogleSignin imported successfully');
                  } catch (importError) {
                    console.error('❌ Failed to import GoogleSignin:', importError);
                    throw new Error(`Failed to import GoogleSignin: ${importError}`);
                  }
                  
                  // Test 3: Check Play Services
                  console.log('3. Testing Google Play Services...');
                  await GoogleSignin.hasPlayServices();
                  console.log('✅ Google Play Services available');
                  
                  // Test 4: Check if already signed in
                  console.log('4. Checking if already signed in...');
                  const isSignedIn = await GoogleSignin.isSignedIn();
                  console.log('Is signed in:', isSignedIn);
                  
                  if (isSignedIn) {
                    const currentUser = await GoogleSignin.getCurrentUser();
                    console.log('Current user:', currentUser);
                  }
                  
                  // Test 5: Try to sign in
                  console.log('5. Attempting Google Sign-In...');
                  const userInfo = await GoogleSignin.signIn();
                  console.log('✅ Google Sign-In successful!');
                  console.log('User info:', JSON.stringify(userInfo, null, 2));
                  
                  // Test 6: Try to call backend
                  console.log('6. Testing backend call...');
                  const googleUser = userInfo as any;
                  const loginData = {
                    email: googleUser.user?.email || googleUser.email || '',
                    google_id: googleUser.user?.id || googleUser.id || '',
                    access_token: 'test_token',
                    auth_provider: 'google',
                  };
                  
                  console.log('Sending to backend:', loginData);
                  const response = await api.loginWithGoogle(loginData);
                  console.log('✅ Backend response:', response);
                  
                } catch (error: any) {
                  console.error('❌ Test failed:', error);
                  console.error('Error code:', error.code);
                  console.error('Error message:', error.message);
                  console.error('Full error object:', JSON.stringify(error, null, 2));
                  
                  // Show specific error messages based on error code
                  if (error.code === 'DEVELOPER_ERROR') {
                    setError('DEVELOPER_ERROR: Check OAuth configuration in Google Cloud Console');
                  } else if (error.code === 'SIGN_IN_CANCELLED') {
                    setError('Sign-in was cancelled by user');
                  } else if (error.code === 'IN_PROGRESS') {
                    setError('Sign-in is already in progress');
                  } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                    setError('Google Play Services not available');
                  } else {
                    setError(`Debug failed: ${error.message}`);
                  }
                }
              };

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        await login({ email: email.trim().toLowerCase(), password });
        // Navigation will be handled by AuthContext state change
      } catch (e: any) {
        let message = 'An error occurred during login.';
        if (typeof e === 'string') {
          message = e;
        } else if (e && typeof e === 'object') {
          if (e.message) {
            message = e.message;
          } else if (e.detail) {
            message = e.detail;
          } else if (Array.isArray(e) && e[0]?.msg) {
            message = e[0].msg;
          } else {
            try {
              message = JSON.stringify(e);
            } catch {
              message = 'An error occurred during login.';
            }
          }
        }
        setError(message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      // Navigation will be handled by AuthContext state change
    } catch (e: any) {
      console.log('🔍 Google Sign-In Error in LoginScreen:');
      getDetailedErrorInfo(e);
      
      let message = 'An error occurred during Google sign in.';
      if (typeof e === 'string') {
        message = e;
      } else if (e && typeof e === 'object' && e.message) {
        message = e.message;
      }
      setError(message);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.centeredContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <Text style={styles.welcomeSubtitle}>Please Log in to continue.</Text>
        
        <FormCard>
          <CustomTextInput
            label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            left={<TextInput.Icon icon={() => <Icon name="email-outline" size={22} color={COLORS.textSecondary} />} />}
            />
            
          <CustomTextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            left={<TextInput.Icon icon={() => <Icon name="lock-outline" size={22} color={COLORS.textSecondary} />} />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off-outline" : "eye-outline"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            />

            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {error ? <HelperText type="error" visible style={styles.errorText}>{error}</HelperText> : null}

          {isLoading ? (
            <ActivityIndicator animating={true} color={COLORS.accent} style={styles.loginButton} />
          ) : (
            <CustomButton 
                onPress={handleLogin} 
                style={styles.loginButton}
                disabled={isLoading}
              >
                Log In
            </CustomButton>
          )}

            <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.divider} />
            </View>

                                <UnifiedGoogleSignIn
                        key="login-google-signin"
                        navigation={navigation}
                        onSuccess={(result) => {
                          console.log('Google login successful:', result);
                          // The AuthContext will handle the navigation
                        }}
                        onError={(error) => {
                          setError(error);
                        }}
                      />

                      {/* Debug button for testing */}
                      <TouchableOpacity 
                        style={styles.debugButton} 
                        onPress={handleDebugGoogleSignIn}
                      >
                        <Text style={styles.debugButtonText}>Debug Google Sign-In</Text>
                      </TouchableOpacity>

                      {/* Simple test button */}
                      <TouchableOpacity 
                        style={[styles.debugButton, { backgroundColor: '#4CAF50', marginTop: 8 }]} 
                        onPress={() => {
                          console.log('🔍 Simple test - Configuration check:');
                          console.log('Web Client ID:', GOOGLE_CONFIG.webClientId);
                          console.log('API Base URL:', ENV_CONFIG.API_BASE_URL);
                          setError('Simple test completed - check console logs');
                        }}
                      >
                        <Text style={styles.debugButtonText}>Simple Config Test</Text>
                      </TouchableOpacity>
        </FormCard>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Montserrat-Black',
    fontWeight: '900',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 17,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
  },
  loginButton: {
    marginTop: 4,
    marginBottom: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
  },
  googleButton: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  googleButtonLabel: {
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 17,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  signupText: {
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  signupLink: {
    fontFamily: 'Montserrat-Bold',
    color: COLORS.accent,
    fontSize: 16,
  },
  debugButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
});

export default LoginScreen; 