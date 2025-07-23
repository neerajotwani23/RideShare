import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, IconButton, Menu, Card, ActivityIndicator } from 'react-native-paper';

import { useAuth } from '../../context/AuthContext';
import { PhoneNumberInput, GoogleSignInButton } from '../../components';
import { COLORS } from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const SignupScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState(''); // Reset to empty string
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cnicError, setCnicError] = useState('');
  const [showGenderMenu, setShowGenderMenu] = useState(false);

  useEffect(() => {
    console.log('Gender state changed to:', gender);
  }, [gender]);

  const [formError, setFormError] = useState('');

  const { storePendingSignupData, signupWithGoogle, isLoading } = useAuth();

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];
  
  console.log('Gender options:', genderOptions);
  console.log('Current gender state:', gender);

  const handleGenderChange = (selectedGender: string) => {
    console.log('Selected gender:', selectedGender);
    setGender(selectedGender);
    setShowGenderMenu(false);
  };

  const getGenderLabel = (genderValue: string) => {
    const option = genderOptions.find(g => g.value === genderValue);
    return option ? option.label : genderValue;
  };

  const handleOutsidePress = () => {
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
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      gender.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      !cnicError &&
      password === confirmPassword
    );
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setFormError('Please fill all required fields correctly.');
      return;
    }

    // Store signup data in context and navigate to role selection
    const signupData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      phone_no: phoneNumber,
      cnic,
      gender,
    };

    // Store the signup data in context for later use
    storePendingSignupData(signupData);
    navigation.navigate('RoleSelection');
  };

  const handleGoogleSignup = async () => {
    try {
      // For Google signup, we'll navigate to role selection first
      // Then complete the signup with Google data
      navigation.navigate('RoleSelection', { isGoogleSignup: true });
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
              <TouchableOpacity
                style={styles.genderSelector}
                onPress={() => setShowGenderMenu(!showGenderMenu)}
              >
                <Text style={[styles.genderText, !gender && styles.placeholderText]}>
                  {gender === 'male' ? 'Male' : 
                   gender === 'female' ? 'Female' : 
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
                      gender === 'male' && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      setGender('male');
                      setShowGenderMenu(false);
                    }}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      gender === 'male' && styles.genderOptionTextSelected
                    ]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      gender === 'female' && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      setGender('female');
                      setShowGenderMenu(false);
                    }}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      gender === 'female' && styles.genderOptionTextSelected
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

            <GoogleSignInButton
              mode="signup"
              role="passenger"
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
    zIndex: 10,
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
    zIndex: 1000,
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
});

export default SignupScreen; 