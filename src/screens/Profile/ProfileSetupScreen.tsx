import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import COLORS from '../../constants/colors';

const ProfileSetupScreen = ({ navigation, route }: any) => {
  const [bio, setBio] = useState('');
  const [userRole, setUserRole] = useState<string>('');

  const { completeProfileSetup, skipProfileSetup, currentRole, logout } = useAuth();
  const { updateProfile, isLoading } = useApp();

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

  const handleSave = async () => {
    try {
      // Update profile with bio if provided
      if (bio.trim()) {
        await updateProfile({ bio: bio.trim() });
      }
      
      completeProfileSetup();
      // Navigation will be handled automatically by AppNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    }
  };

  const handleSkip = () => {
    // Only passengers can skip profile setup
    if (userRole === 'driver') {
      Alert.alert(
        'Profile Setup Required',
        'As a driver, you need to complete your profile setup before proceeding to vehicle details.',
        [{ text: 'OK' }]
      );
    } else {
      // Passengers can skip profile setup
      Alert.alert(
        'Skip Profile Setup',
        'You can complete your profile later from the settings. Are you sure you want to skip?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Skip', 
            style: 'destructive',
            onPress: () => {
              skipProfileSetup();
              // Navigation will be handled automatically by AppNavigator
            }
          }
        ]
      );
    }
  };

  const handleBackPress = () => {
    // Check if we can go back safely
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If no previous screen, this means we're in initial setup flow
      // Logout the user to return to authentication flow
      Alert.alert(
        'Exit Setup',
        'Are you sure you want to exit? You will be logged out.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: logout }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#000000"
          onPress={handleBackPress}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Profile Setup</Text>
        {userRole === 'passenger' && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleSelectPhoto} style={styles.avatarContainer}>
              <Avatar.Icon size={100} icon="account" style={styles.avatar} />
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
            activeOutlineColor={COLORS.accent}
            contentStyle={styles.inputContent}
            outlineStyle={styles.inputOutline}
            placeholder="Tell others about yourself..."
            placeholderTextColor="#999999"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {userRole === 'driver' ? 'Welcome! Complete Your Profile' : 'Welcome! Set Up Your Profile'}
          </Text>
          <Text style={styles.infoText}>
            {userRole === 'driver' 
              ? 'As a driver, please complete your profile with a photo and bio. This helps passengers trust you. You\'ll then be asked to add your vehicle details.'
              : 'Add a profile photo and bio to help other users recognize you. You can always update these later from your profile settings.'
            }
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
          disabled={isLoading}
          loading={isLoading}
        >
          {userRole === 'driver' ? 'Save & Continue' : 'Save & Continue'}
        </Button>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat-Black',
    fontWeight: '900',
    color: COLORS.secondary,
  },
  skipButton: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#248CFE',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 32,
    textAlignVertical: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: '#248CFE',
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
    color: COLORS.secondary,
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
    borderRadius: 16,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 16,
  },
  infoContainer: {
    backgroundColor: '#F6F8FB',
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
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
  },
  buttonContent: {
    paddingVertical: 14,
  },
  buttonLabel: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
});

export default ProfileSetupScreen; 