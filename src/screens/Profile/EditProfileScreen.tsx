import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';
import { useApp } from '../../context/AppContext';

const EditProfileScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { userProfile, updateProfile, isLoading, isRefreshing } = useApp();

  // Load user data when component mounts
  useEffect(() => {
    if (userProfile) {
      setFullName(`${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim());
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone_no || '');
      setCnic(userProfile.cnic || '');
      setAbout(userProfile.bio || '');
    }
  }, [userProfile]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+92\s?3[0-9]{2}\s?[0-9]{7}$/.test(phone);
  };

  const validateCNIC = (cnic: string) => {
    return /^\d{5}-\d{7}-\d{1}$/.test(cnic);
  };

  const formatCNIC = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    } else if (cleaned.length <= 12) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    } else {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
    }
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/[^0-9+]/g, '');
    if (!cleaned.startsWith('+92')) {
      if (cleaned.startsWith('92')) {
        return '+' + cleaned;
      } else if (cleaned.startsWith('3')) {
        return '+92 ' + cleaned;
      } else {
        return '+92 ' + cleaned;
      }
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid Pakistani phone number';
    }

    if (!validateCNIC(cnic)) {
      newErrors.cnic = 'Please enter a valid CNIC (12345-1234567-1)';
    }

    if (!about.trim()) {
      newErrors.about = 'About section cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const profileData = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_no: phone,
        cnic,
        bio: about,
      };

      await updateProfile(profileData);
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  if (isRefreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={() => navigation.goBack()}
            style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 48 }} />
      </View>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
              <TextInput
              style={styles.input}
              mode="outlined"
              label="Full Name"
                value={fullName}
                onChangeText={setFullName}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={!!errors.fullName}
              />
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

              <TextInput
              style={styles.input}
                mode="outlined"
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={!!errors.email}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

              <TextInput
              style={styles.input}
                mode="outlined"
              label="Phone Number"
              value={phone}
              onChangeText={(text) => setPhone(formatPhone(text))}
              keyboardType="phone-pad"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={!!errors.phone}
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

              <TextInput
              style={styles.input}
              mode="outlined"
              label="CNIC"
                value={cnic}
                onChangeText={(text) => setCnic(formatCNIC(text))}
              keyboardType="numeric"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={!!errors.cnic}
            />
            {errors.cnic ? <Text style={styles.errorText}>{errors.cnic}</Text> : null}

              <TextInput
              style={[styles.input, styles.textArea]}
                mode="outlined"
              label="About"
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={!!errors.about}
            />
            {errors.about ? <Text style={styles.errorText}>{errors.about}</Text> : null}

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
            >
              Save Changes
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Security</Text>
            
              <Button
                mode="outlined"
                onPress={handleChangePassword}
                style={styles.changePasswordButton}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, { color: COLORS.accent }]}
              >
              Change Password
              </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  headerRight: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.secondary,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.error,
    marginTop: 4,
  },

  passwordSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  passwordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  passwordIcon: {
    marginRight: 12,
  },
  passwordTextContainer: {
    flex: 1,
  },
  passwordLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  passwordDescription: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  changePasswordButton: {
    borderColor: COLORS.secondary,
    borderRadius: 8,
  },
  changePasswordLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  changePasswordContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  actionButtons: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.primary,
  },
  saveButtonContent: {
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
  },
  backButton: {
    width: 48,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default EditProfileScreen; 