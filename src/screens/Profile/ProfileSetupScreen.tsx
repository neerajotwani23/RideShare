import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const ProfileSetupScreen = ({ navigation, route }: any) => {
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  const { completeProfileSetup, currentRole } = useAuth();

  useEffect(() => {
    // Get user role from context or route params
    const role = currentRole || route?.params?.role || 'passenger';
    setUserRole(role);
  }, [currentRole, route]);

  const handleSelectPhoto = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add your profile photo',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = () => {
    completeProfileSetup();
    // Navigation will be handled automatically by AppNavigator based on auth state
  };

  const handleSkip = () => {
    // Check if user is a driver and needs to provide vehicle details
    if (userRole === 'driver') {
      Alert.alert(
        'Vehicle Details Required',
        'As a driver, you need to provide vehicle details and documents for verification before you can start offering rides.',
        [
          { text: 'Continue', onPress: () => navigation.navigate('VehicleDetails') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      completeProfileSetup();
      // Navigation will be handled automatically by AppNavigator
    }
  };

  const handleBackPress = () => {
    // Check if we can go back safely
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If no previous screen, this means we're in initial setup flow
      // but RoleSelection might not be available, so navigate to login
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#000000"
          onPress={handleBackPress}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Profile Setup</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleSelectPhoto} style={styles.avatarContainer}>
            {profileImage ? (
              <Avatar.Image size={100} source={{ uri: profileImage }} />
            ) : (
              <Avatar.Icon size={100} icon="account" style={styles.avatar} />
            )}
            <View style={styles.cameraIcon}>
              <IconButton
                icon="camera"
                size={20}
                iconColor="#FFFFFF"
                style={styles.cameraButton}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoText}>Add Profile Photo</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Bio (Optional)</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={styles.bioInput}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#007AFF"
            contentStyle={styles.inputContent}
            outlineStyle={styles.inputOutline}
            placeholder="Tell others about yourself..."
            placeholderTextColor="#999999"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Complete Your Profile Later</Text>
          <Text style={styles.infoText}>
            You can add more details like preferences and settings from your profile page anytime.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Save & Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
  },
  skipButton: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    margin: 0,
  },
  photoText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#666666',
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 8,
  },
  bioInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
  buttonContent: {
    paddingVertical: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
});

export default ProfileSetupScreen; 