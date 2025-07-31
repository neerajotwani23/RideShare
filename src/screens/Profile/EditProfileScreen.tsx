import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Card, IconButton, ActivityIndicator, Avatar } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';
import { PhoneNumberInput } from '../../components';
import { useApp } from '../../context/AppContext';

const EditProfileScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState('');
  const [about, setAbout] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { userProfile, updateProfile, isLoading, isRefreshing } = useApp();

  // Load user data when component mounts
  useEffect(() => {
    if (userProfile) {
      console.log('Debug - UserProfile data:', userProfile);
      console.log('Debug - Gender field:', userProfile.gender, 'Type:', typeof userProfile.gender);
      
      setFullName(`${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim());
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone_no || '');
      setCnic(userProfile.cnic || '');
      setGender(userProfile.gender || '');
      setAbout(userProfile.bio || '');
      setProfilePicture(userProfile.profile_picture || '');
    }
  }, [userProfile]);



  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const profileData = {
        phone_no: phone,
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

  const handleChangeProfilePicture = () => {
    // TODO: Implement image picker functionality
    Alert.alert(
      'Change Profile Picture',
      'Profile picture change functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  const getGenderDisplay = (gender: any) => {
    if (!gender) return 'Not specified';
    
    // Handle different possible formats of gender
    const genderStr = typeof gender === 'string' ? gender : gender?.value || gender?.name || '';
    
    // Ensure gender is either 'male' or 'female'
    if (genderStr === 'male') {
      return 'Male';
    } else if (genderStr === 'female') {
      return 'Female';
    }
    
    console.log('Debug - Gender value:', gender, 'Type:', typeof gender);
    return 'Not specified';
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

        {/* Profile Picture Section */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity onPress={() => handleChangeProfilePicture()}>
                {profilePicture ? (
                  <Avatar.Image 
                    size={100} 
                    source={{ uri: profilePicture }} 
                    style={styles.profilePicture}
                  />
                ) : (
                  <Avatar.Icon 
                    size={100} 
                    icon="account" 
                    style={styles.profilePicture}
                    color={COLORS.secondary}
                  />
                )}
                <View style={styles.changePictureOverlay}>
                  <Icon name="camera" size={24} color={COLORS.primary} />
                </View>
              </TouchableOpacity>
              <Text style={styles.profilePictureText}>
                Tap to change profile picture
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Personal Information - Locked Fields */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Personal Information (Locked)</Text>
            
            <View style={styles.lockedFieldContainer}>
              <Text style={styles.lockedFieldLabel}>Full Name</Text>
              <View style={styles.lockedFieldValue}>
                <Text style={styles.lockedFieldText}>{fullName || 'Not specified'}</Text>
                <Icon name="lock" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.lockedFieldContainer}>
              <Text style={styles.lockedFieldLabel}>Email Address</Text>
              <View style={styles.lockedFieldValue}>
                <Text style={styles.lockedFieldText}>{email || 'Not specified'}</Text>
                <Icon name="lock" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.lockedFieldContainer}>
              <Text style={styles.lockedFieldLabel}>CNIC</Text>
              <View style={styles.lockedFieldValue}>
                <Text style={styles.lockedFieldText}>{cnic || 'Not specified'}</Text>
                <Icon name="lock" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.lockedFieldContainer}>
              <Text style={styles.lockedFieldLabel}>Gender</Text>
              <View style={styles.lockedFieldValue}>
                <Text style={styles.lockedFieldText}>{getGenderDisplay(gender)}</Text>
                <Icon name="lock" size={16} color={COLORS.textSecondary} />
              </View>
            </View>


          </Card.Content>
        </Card>

        {/* Editable Information */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Editable Information</Text>
            
            <PhoneNumberInput
              value={phone}
              onChangeText={setPhone}
              label="Phone Number"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              error={errors.phone}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              mode="outlined"
              label="About (Optional)"
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.accent}
              theme={{ roundness: 12 }}
              placeholder="Tell us about yourself (optional)"
            />



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

        {/* Security Section */}
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
  backButton: {
    width: 48,
  },
  scrollView: {
    flex: 1,
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
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  profilePicture: {
    marginBottom: 12,
  },
  changePictureOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profilePictureText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  lockedFieldContainer: {
    marginBottom: 16,
  },
  lockedFieldLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  lockedFieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lockedFieldText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.secondary,
    flex: 1,
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
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.error,
    marginTop: -12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    marginTop: 8,
  },
  changePasswordButton: {
    borderColor: COLORS.accent,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
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
});

export default EditProfileScreen; 