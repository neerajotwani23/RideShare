import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, TextInput, Button, IconButton, Menu, Card } from 'react-native-paper';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const SignupScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'PK',
    callingCode: '+92',
    flag: 'PK',
    name: 'Pakistan'
  });
  const [phoneError, setPhoneError] = useState('');
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [cnicError, setCnicError] = useState('');

  const { signup } = useAuth();

  const countries = [
    { code: 'PK', callingCode: '+92', flag: 'PK', name: 'Pakistan' },
    { code: 'US', callingCode: '+1', flag: 'US', name: 'United States' },
    { code: 'GB', callingCode: '+44', flag: 'GB', name: 'United Kingdom' },
    { code: 'CA', callingCode: '+1', flag: 'CA', name: 'Canada' },
    { code: 'AU', callingCode: '+61', flag: 'AU', name: 'Australia' },
    { code: 'IN', callingCode: '+91', flag: 'IN', name: 'India' },
  ];

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    setPhoneError('');
    setShowCountryMenu(false);
  };

  const formatPhoneNumber = (text: string, countryCode: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    switch (countryCode) {
      case 'US':
      case 'CA':
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
      case 'PK':
        if (cleaned.length <= 3) return cleaned;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 10)}`;
      default:
        return cleaned;
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text, selectedCountry.code);
    setPhoneNumber(formatted);
    
    if (text.length > 0) {
      try {
        const fullNumber = `${selectedCountry.callingCode}${text.replace(/\D/g, '')}`;
        const isValid = isValidPhoneNumber(fullNumber);
        if (!isValid && text.replace(/\D/g, '').length > 3) {
          setPhoneError('Invalid phone number format');
        } else {
          setPhoneError('');
        }
      } catch (error) {
        if (text.replace(/\D/g, '').length > 3) {
          setPhoneError('Invalid phone number format');
        }
      }
    } else {
      setPhoneError('');
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
    if (!firstName.trim()) return false;
    if (!lastName.trim()) return false;
    if (!email.includes('@')) return false;
    if (phoneError || !phoneNumber.trim()) return false;
    if (cnicError || cnic.replace(/\D/g, '').length !== 13) return false;
    if (password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  const handleSignup = () => {
    if (validateForm()) {
      signup();
      navigation.navigate('RoleSelection');
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#007AFF"
              style={{ margin: 0 }}
            />
          </TouchableOpacity>
          
          <Image 
            source={require('../../assets/images/logo-blue.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Join RideShare</Text>
          <Text style={styles.welcomeSubtitle}>Create your account to start sharing rides</Text>
        </View>

        {/* Form Section */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            {/* Name Fields */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={styles.input}
                  mode="outlined"
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#007AFF"
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
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#007AFF"
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
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              contentStyle={styles.inputContent}
            />

            {/* Phone Number */}
            <View style={styles.phoneContainer}>
              <Menu
                visible={showCountryMenu}
                onDismiss={() => setShowCountryMenu(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryMenu(true)}
                  >
                    <Text style={styles.countryCode}>{selectedCountry.flag} {selectedCountry.callingCode}</Text>
                    <IconButton icon="chevron-down" size={20} iconColor="#666666" style={styles.chevronIcon} />
                  </TouchableOpacity>
                }
              >
                {countries.map((country) => (
                  <Menu.Item
                    key={country.code}
                    onPress={() => handleCountryChange(country)}
                    title={`${country.flag} ${country.name} ${country.callingCode}`}
                  />
                ))}
              </Menu>
              
              <TextInput
                label="Phone number"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                style={styles.phoneInput}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#007AFF"
                placeholder={getPhonePlaceholder(selectedCountry.code)}
                error={!!phoneError}
                contentStyle={styles.inputContent}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            {/* CNIC */}
            <TextInput
              label="CNIC (i.e. xxxxx-xxxxxxx-x)"
              value={cnic}
              onChangeText={handleCnicChange}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              placeholder="42101-1234567-8"
              error={!!cnicError}
              contentStyle={styles.inputContent}
            />
            {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}

            {/* Password */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              contentStyle={styles.inputContent}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {/* Confirm Password */}
            <TextInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              mode="outlined"
              outlineColor="#E0E0E0"
              activeOutlineColor="#007AFF"
              contentStyle={styles.inputContent}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            {/* Sign Up Button */}
            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={!validateForm()}
            >
              Create Account
            </Button>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <Button 
              mode="outlined" 
              onPress={() => console.log('Google Sign-Up pressed')}
              style={styles.googleButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.googleButtonLabel}
            >
              Continue with Google
            </Button>
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
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
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
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  formContent: {
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginRight: 8,
    minWidth: 100,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
  },
  chevronIcon: {
    margin: 0,
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#FF3B30',
    marginTop: -12,
    marginBottom: 8,
  },
  signupButton: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    marginHorizontal: 16,
  },
  googleButton: {
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  googleButtonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  signinSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  signinText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
  },
  signinLink: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#007AFF',
  },
});

export default SignupScreen; 