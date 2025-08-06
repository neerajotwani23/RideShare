import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Card, IconButton, Avatar } from 'react-native-paper';
import { COLORS } from '../../constants/colors';
import Icon from '../../components/Icon';
import { PhoneNumberInput } from '../../components';
import { useApp } from '../../context/AppContext';
import { fileUploadService } from '../../services/fileUploadService';

const EditProfileScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [gender, setGender] = useState('');
  const [about, setAbout] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isUploading, setIsUploading] = useState(false);
  
  const { userProfile, updateProfile, isLoading, isRefreshing } = useApp();

  // Load user data when component mounts
  useEffect(() => {
    if (userProfile) {
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

  const handleChangeProfilePicture = async () => {
    try {
      setIsUploading(true);
      
      // Upload profile picture using the file upload service
      const uploadResponse = await fileUploadService.uploadProfilePicture();
      
      // Set the profile picture URL
      setProfilePicture(uploadResponse.file_url);
      
      // Update the profile in the app context
      await updateProfile({ profile_picture: uploadResponse.file_url });
      
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      
      // Provide more specific error messages for common issues
      let errorMessage = 'Failed to update profile picture. Please try again.';
      
      if (error.message?.includes('permission denied')) {
        errorMessage = 'Storage permission denied. Please grant storage permission in your device settings and try again.';
      } else if (error.message?.includes('camera')) {
        errorMessage = 'Camera permission denied. Please grant camera permission in your device settings and try again.';
      } else if (error.message?.includes('cancelled')) {
        errorMessage = 'Image selection was cancelled.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const getGenderDisplay = (gender: string) => {
    if (!gender) return 'Not specified';
    // Ensure gender is either 'MALE' or 'FEMALE'
    if (gender === 'MALE') {
      return 'Male';
    } else if (gender === 'FEMALE') {
      return 'Female';
    }
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
              <TouchableOpacity 
                onPress={() => handleChangeProfilePicture()} 
                disabled={isUploading}
              >
                {isUploading ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : profilePicture ? (
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
                {!isUploading && (
                  <View style={styles.changePictureOverlay}>
                    <Icon name="camera" size={24} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.profilePictureText}>
                {isUploading ? 'Uploading...' : 'Tap to change profile picture'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Personal Information - Locked Fields */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            {/* Full Name - Read Only */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                value={fullName}
                style={styles.lockedInput}
                mode="outlined"
                outlineColor={COLORS.border}
                contentStyle={styles.lockedInputContent}
                editable={false}
              />
            </View>

            {/* Email - Read Only */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                style={styles.lockedInput}
                mode="outlined"
                outlineColor={COLORS.border}
                contentStyle={styles.lockedInputContent}
                editable={false}
              />
            </View>

            {/* CNIC - Read Only */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CNIC</Text>
              <TextInput
                value={cnic}
                style={styles.lockedInput}
                mode="outlined"
                outlineColor={COLORS.border}
                contentStyle={styles.lockedInputContent}
                editable={false}
              />
            </View>

            {/* Gender - Read Only */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput
                value={getGenderDisplay(gender)}
                style={styles.lockedInput}
                mode="outlined"
                outlineColor={COLORS.border}
                contentStyle={styles.lockedInputContent}
                editable={false}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Editable Information */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <PhoneNumberInput
                value={phone}
                onChangeText={setPhone}
                label=""
                contentStyle={styles.inputContent}
              />
            </View>

            {/* Bio */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>About</Text>
              <TextInput
                value={about}
                onChangeText={setAbout}
                multiline
                numberOfLines={4}
                style={styles.input}
                mode="outlined"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.secondary}
                contentStyle={styles.inputContent}
                placeholder="Tell others about yourself..."
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleChangePassword}
            style={styles.changePasswordButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.outlinedButtonLabel}
          >
            Change Password
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={isLoading || isUploading}
            loading={isLoading}
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
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  lockedInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lockedInputContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  outlinedButtonLabel: {
    color: COLORS.accent,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default EditProfileScreen; 