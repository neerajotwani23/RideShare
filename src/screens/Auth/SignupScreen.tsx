import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, IconButton, Menu, Card, ActivityIndicator } from 'react-native-paper';

import { useAuth } from '../../context/AuthContext';
import { PhoneNumberInput } from '../../components';
import UnifiedGoogleSignIn from '../../components/UnifiedGoogleSignIn';
import { COLORS } from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const SignupScreen = ({ navigation, route }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [selectedGender, setSelectedGender] = useState(''); // Reset to empty string
  const [renderKey, setRenderKey] = useState(0); // Force re-render
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cnicError, setCnicError] = useState('');
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  useEffect(() => {
    console.log('🎯 Gender state changed to:', selectedGender);
    console.log('🎯 Gender state type:', typeof selectedGender);
    console.log('🎯 Gender state length:', selectedGender.length);
    console.log('🎯 Gender state matches backend enum:', selectedGender === 'male' || selectedGender === 'female');
    console.log('🎯 Component should re-render with new gender value');
  }, [selectedGender]);

  useEffect(() => {
    console.log('🎯 Gender menu visibility changed to:', showGenderMenu);
  }, [showGenderMenu]);

  // Handle Google user data from navigation params
  useEffect(() => {
    if (route.params?.googleUserData) {
      const googleData = route.params.googleUserData;
      console.log('Google user data received:', googleData);
      
      // Pre-fill the form with Google data
      setFirstName(googleData.givenName || '');
      setLastName(googleData.familyName || '');
      setEmail(googleData.email || '');
      setIsGoogleSignup(true);
      
      // Clear the params to avoid re-filling on re-render
      navigation.setParams({ googleUserData: undefined });
    }
  }, [route.params?.googleUserData]);

  const [formError, setFormError] = useState('');

  const { storePendingSignupData, signupWithGoogle, isLoading } = useAuth();

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];
  
  console.log('Gender options:', genderOptions);
  console.log('Current gender state:', selectedGender);

  const handleGenderChange = (genderValue: string) => {
    console.log('🎯 handleGenderChange called with:', genderValue);
    console.log('🎯 Previous gender state:', selectedGender);
    
    // Update gender state
    setSelectedGender(genderValue);
    
    // Close the menu after a small delay to ensure state update
    setTimeout(() => {
    setShowGenderMenu(false);
      console.log('🎯 Gender state after update:', genderValue);
    }, 100);
  };

  const getGenderLabel = (genderValue: string) => {
    const option = genderOptions.find(g => g.value === genderValue);
    return option ? option.label : genderValue;
  };

  const handleOutsidePress = () => {
    // Only close gender menu if it's open and we're not clicking on the gender selector
    if (showGenderMenu) {
      setShowGenderMenu(false);
    }
  };

  const formatCnic = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 5) {
      return cleaned;
    } else if (cleaned.length <= 12) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    } else {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
    }
  };

  const handleCnicChange = (text: string) => {
    const formatted = formatCnic(text);
    setCnic(formatted);
    
    const cleanedCnic = formatted.replace(/\D/g, '');
    if (cleanedCnic.length > 0 && cleanedCnic.length !== 13) {
      setCnicError('CNIC must be 13 digits');
    } else {
      setCnicError('');
    }
  };

  const validateForm = () => {
    const isValid = (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      selectedGender.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      !cnicError &&
      password === confirmPassword
    );
    
    console.log('🔍 Form validation check:');
    console.log('  - firstName:', !!firstName.trim());
    console.log('  - lastName:', !!lastName.trim());
    console.log('  - email:', !!email.trim());
    console.log('  - gender:', !!selectedGender.trim(), `(value: "${selectedGender}")`);
    console.log('  - password:', !!password.trim());
    console.log('  - confirmPassword:', !!confirmPassword.trim());
    console.log('  - !cnicError:', !cnicError);
    console.log('  - password === confirmPassword:', password === confirmPassword);
    console.log('  - Form is valid:', isValid);
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setFormError('Please fill all required fields correctly.');
      return;
    }

    console.log('🔍 Signup form data:');
    console.log('Gender value:', selectedGender);
    console.log('Gender type:', typeof selectedGender);

    // Store signup data in context and navigate to role selection
    const signupData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_no: phoneNumber,
      cnic,
      gender: selectedGender,
      isGoogleSignup, // Add flag to indicate if this is Google signup
    };

    console.log('📤 Complete signup data:', signupData);

    // Store the signup data in context for later use
    storePendingSignupData(signupData);
    // Don't navigate manually - let AppNavigator handle navigation based on auth state
    // The user will be automatically redirected to the appropriate screen
  };

  const handleGoogleSignup = async () => {
    try {
      // For Google signup, let the AppNavigator handle navigation
      // The user will be automatically redirected to the appropriate screen
      console.log('🎯 Google signup initiated - letting AppNavigator handle navigation');
    } catch (e: any) {
      let message = 'An error occurred during Google sign up.';
      if (typeof e === 'string') {
        message = e;
      } else if (e && typeof e === 'object' && e.message) {
        message = e.message;
      }
      setFormError(message);
    }
  };

  const getPhonePlaceholder = (countryCode: string) => {
    switch (countryCode) {
      case 'US':
      case 'CA':
        return '3XX XXX XXXX';
      case 'PK':
        return '3XX XXX XXXX';
      default:
        return 'Enter phone number';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onTouchStart={handleOutsidePress}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={COLORS.accent}
              style={{ margin: 0 }}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Join RideShare</Text>
          <Text style={styles.welcomeSubtitle}>Create your account to start sharing rides</Text>
          {isGoogleSignup && (
            <View style={styles.googleInfo}>
              <Text style={styles.googleInfoText}>
                ✓ Information from your Google account has been pre-filled
              </Text>
            </View>
          )}
        </View>

        {/* Form Section */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            {/* Name Fields */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.secondary}
                  contentStyle={styles.inputContent}
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  label="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.secondary}
                  contentStyle={styles.inputContent}
                />
              </View>
            </View>

            {/* Email */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              contentStyle={styles.inputContent}
            />

            {/* Phone Number */}
            <PhoneNumberInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              label="Phone number"
              contentStyle={styles.inputContent}
            />

            {/* CNIC */}
            <TextInput
              label="CNIC (i.e. xxxxx-xxxxxxx-x)"
              value={cnic}
              onChangeText={handleCnicChange}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              placeholder="42101-1234567-8"
              error={!!cnicError}
              contentStyle={styles.inputContent}
            />
            {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}

            {/* Gender */}
            <View style={styles.genderContainer}>
              {/* Debug display */}
              <Text style={{ color: 'red', fontSize: 12, marginBottom: 4 }}>
                Debug: selectedGender = "{selectedGender}" (length: {selectedGender.length})
              </Text>
              <TouchableOpacity
                style={styles.genderSelector}
                onPress={() => {
                  console.log('🎯 Gender selector pressed, current state:', showGenderMenu);
                  setShowGenderMenu(!showGenderMenu);
                }}
                activeOpacity={0.8}
              >
                <Text 
                  key={`gender-text-${renderKey}`}
                  style={[styles.genderText, !selectedGender && styles.placeholderText]}
                >
                  {selectedGender === 'male' ? 'Male' : 
                   selectedGender === 'female' ? 'Female' : 
                   'Select Gender'}
                </Text>
                <IconButton 
                  icon={showGenderMenu ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  iconColor={COLORS.textSecondary} 
                  style={styles.chevronIcon} 
                />
              </TouchableOpacity>
              
              {showGenderMenu && (
                <View style={styles.genderDropdown}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      selectedGender === 'male' && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      console.log('🎯 Male option pressed');
                      console.log('🎯 Current selectedGender before update:', selectedGender);
                      console.log('🎯 Setting selectedGender to male');
                      setSelectedGender('male');
                      setShowGenderMenu(false);
                      setRenderKey(prev => prev + 1);
                      console.log('🎯 selectedGender should now be male');
                      // Force immediate state check
                      setTimeout(() => {
                        console.log('🎯 selectedGender after timeout:', selectedGender);
                      }, 0);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      selectedGender === 'male' && styles.genderOptionTextSelected
                    ]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      selectedGender === 'female' && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      console.log('🎯 Female option pressed');
                      console.log('🎯 Current selectedGender before update:', selectedGender);
                      console.log('🎯 Setting selectedGender to female');
                      setSelectedGender('female');
                      setShowGenderMenu(false);
                      setRenderKey(prev => prev + 1);
                      console.log('🎯 selectedGender should now be female');
                      // Force immediate state check
                      setTimeout(() => {
                        console.log('🎯 selectedGender after timeout:', selectedGender);
                      }, 0);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      selectedGender === 'female' && styles.genderOptionTextSelected
                    ]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Password */}
            <View style={styles.passwordContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              contentStyle={styles.inputContent}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            </View>

            {/* Confirm Password */}
            <View style={styles.passwordContainer}>
            <TextInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              mode="outlined"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              contentStyle={styles.inputContent}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            </View>

            {/* Sign Up Button */}
            {isLoading ? (
              <ActivityIndicator animating={true} color={COLORS.primary} style={styles.signupButton} />
            ) : (
            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
                disabled={!validateForm() || isLoading}
            >
              Create Account
            </Button>
            )}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <UnifiedGoogleSignIn
              key="signup-google-signin"
              navigation={navigation}
              isOnSignupScreen={true}
              onSuccess={(result) => {
                console.log('Google signup successful:', result);
                // The AuthContext will handle the navigation
              }}
              onError={(error) => {
                setFormError(error);
              }}
            />
          </Card.Content>
        </Card>

        {/* Sign In Section */}
        <View style={styles.signinSection}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signinLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: COLORS.primary,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 4,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: -8,
    top: -8,
  },
  logoImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Montserrat-Black',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  formContent: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    backgroundColor: COLORS.primary,
    color: COLORS.secondary,
    marginBottom: 12,
    borderRadius: 16,
  },
  inputContent: {
    color: COLORS.secondary,
  },

  genderContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 12,
  },
  chevronIcon: {
    marginLeft: 0,
  },
  passwordContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 12,
  },

  genderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    minHeight: 56,
  },
  genderText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },
  placeholderText: {
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 8,
  },
  signupButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  googleButton: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginBottom: 8,
  },
  googleButtonLabel: {
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  signinSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signinText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  signinLink: {
    color: COLORS.accent,
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
  },
  formError: {
    color: COLORS.error,
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  genderDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginTop: 4,
    elevation: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1001,
    maxHeight: 120,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  genderOptionSelected: {
    backgroundColor: COLORS.lightGray,
  },
  genderOptionText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontFamily: 'Montserrat-Regular',
  },
  genderOptionTextSelected: {
    color: COLORS.accent,
    fontFamily: 'Montserrat-SemiBold',
  },
  googleInfo: {
    backgroundColor: '#e8f5e8',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  googleInfoText: {
    color: '#2e7d32',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
});

export default SignupScreen; 