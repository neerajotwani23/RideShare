import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, IconButton, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';

// Mock current user data - in real app this would come from context/API
const mockCurrentUser = {
  fullName: 'Ahmed Khan',
  email: 'ahmed.khan@email.com',
  phone: '+92 300 1234567',
  cnic: '42101-1234567-8',
  about: 'Passionate about sustainable transportation and meeting new people through carpooling.',
  gender: 'Male',
};

const EditProfileScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState(mockCurrentUser.fullName);
  const [email, setEmail] = useState(mockCurrentUser.email);
  const [phone, setPhone] = useState(mockCurrentUser.phone);
  const [cnic, setCnic] = useState(mockCurrentUser.cnic);
  const [about, setAbout] = useState(mockCurrentUser.about);
  const [gender, setGender] = useState(mockCurrentUser.gender);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature will redirect you to a secure password change screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In real app, navigate to change password screen
            Alert.alert('Info', 'Change password screen would open here');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.textInput}
                outlineColor={errors.fullName ? COLORS.error : COLORS.border}
                activeOutlineColor={errors.fullName ? COLORS.error : COLORS.accent}
                contentStyle={styles.inputContent}
                left={<TextInput.Icon icon={() => <Icon name="account" size={20} color={COLORS.textSecondary} />} />}
              />
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>About</Text>
              <TextInput
                value={about}
                onChangeText={setAbout}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.textInput}
                outlineColor={errors.about ? COLORS.error : COLORS.border}
                activeOutlineColor={errors.about ? COLORS.error : COLORS.accent}
                contentStyle={styles.inputContent}
                placeholder="Tell us about yourself..."
                placeholderTextColor={COLORS.textSecondary}
              />
              {errors.about ? <Text style={styles.errorText}>{errors.about}</Text> : null}
            </View>



            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput
                value={gender}
                mode="outlined"
                style={styles.textInput}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.accent}
                contentStyle={styles.inputContent}
                editable={false}
                left={<TextInput.Icon icon={() => <Icon name="human-male-female" size={20} color={COLORS.textSecondary} />} />}
                right={<TextInput.Icon icon={() => <Icon name="lock" size={16} color={COLORS.textSecondary} />} />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CNIC</Text>
              <TextInput
                value={cnic}
                onChangeText={(text) => setCnic(formatCNIC(text))}
                mode="outlined"
                style={styles.textInput}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.accent}
                contentStyle={styles.inputContent}
                editable={false}
                maxLength={15}
                left={<TextInput.Icon icon={() => <Icon name="card-account-details" size={20} color={COLORS.textSecondary} />} />}
                right={<TextInput.Icon icon={() => <Icon name="lock" size={16} color={COLORS.textSecondary} />} />}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase());
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                mode="outlined"
                style={styles.textInput}
                outlineColor={errors.email ? COLORS.error : COLORS.border}
                activeOutlineColor={errors.email ? COLORS.error : COLORS.accent}
                contentStyle={styles.inputContent}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon={() => <Icon name="email" size={20} color={COLORS.textSecondary} />} />}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(formatPhone(text));
                  if (errors.phone) setErrors({...errors, phone: ''});
                }}
                mode="outlined"
                style={styles.textInput}
                outlineColor={errors.phone ? COLORS.error : COLORS.border}
                activeOutlineColor={errors.phone ? COLORS.error : COLORS.accent}
                contentStyle={styles.inputContent}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon={() => <Icon name="phone" size={20} color={COLORS.textSecondary} />} />}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.formCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <View style={styles.passwordSection}>
              <View style={styles.passwordInfo}>
                <Icon name="lock" size={20} color={COLORS.textSecondary} style={styles.passwordIcon} />
                <View style={styles.passwordTextContainer}>
                  <Text style={styles.passwordLabel}>Password</Text>
                  <Text style={styles.passwordDescription}>Last changed 30 days ago</Text>
                </View>
              </View>
              <Button
                mode="outlined"
                onPress={handleChangePassword}
                style={styles.changePasswordButton}
                labelStyle={styles.changePasswordLabel}
                contentStyle={styles.changePasswordContent}
              >
                Change
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
            contentStyle={styles.saveButtonContent}
          >
            Save Changes
          </Button>
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
});

export default EditProfileScreen; 