import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, HelperText, Divider, TextInput, ActivityIndicator } from 'react-native-paper';


import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { CustomTextInput, CustomButton, FormCard, Icon } from '../../components';
import UnifiedGoogleSignIn from '../../components/UnifiedGoogleSignIn';
import { api } from '../../services/api';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();



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
      console.log('🔍 Google Sign-In Error in LoginScreen:', e);
      
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

});

export default LoginScreen; 