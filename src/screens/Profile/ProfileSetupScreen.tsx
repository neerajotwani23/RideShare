import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { api } from '../../services/api';
import { fileUploadService } from '../../services/fileUploadService';
import { navigationDebugService } from '../../services/debugNavigation';

const ProfileSetupScreen = ({ navigation, route }: any) => {
  const [bio, setBio] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const { completeProfileSetup, skipProfileSetup, currentRole, logout } = useAuth();

  useEffect(() => {
    // Get user role from context or route params
    const role = currentRole || route?.params?.role || 'passenger';
    setUserRole(role);
  }, [currentRole, route]);

  const handleSelectPhoto = async () => {
    try {
      setIsUploading(true);
      
      // Upload profile picture using the file upload service
      const uploadResponse = await fileUploadService.uploadProfilePicture();
      
      // Set the profile picture URL
      setProfilePicture(uploadResponse.file_url);
      
      Alert.alert('Success', 'Profile picture uploaded successfully!');
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Update profile with bio and profile picture if provided
      const profileData: any = {};
      
      if (bio.trim()) {
        profileData.bio = bio.trim();
      }
      
      if (profilePicture) {
        profileData.profile_picture = profilePicture;
      }
      
      if (Object.keys(profileData).length > 0) {
        await api.updateProfile(profileData);
      }
      
      completeProfileSetup();
      // Navigation will be handled automatically by AppNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    skipProfileSetup();
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

  const handleDebugNavigation = async () => {
    try {
      await navigationDebugService.logNavigationDebugInfo();
      Alert.alert(
        'Debug Info',
        'Navigation debug information has been logged to the console. Check the console for details.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Debug Error', `Failed to get debug info: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={handleBackPress}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={handleSelectPhoto} 
            style={styles.avatarContainer}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            ) : profilePicture ? (
              <Avatar.Image 
                size={100} 
                source={{ uri: profilePicture }} 
                style={styles.avatar} 
              />
            ) : (
              <Avatar.Icon size={100} icon="account" style={styles.avatar} />
            )}
            {!isUploading && (
              <View style={styles.cameraIcon}>
                <IconButton
                  icon="camera"
                  size={20}
                  iconColor="#FFFFFF"
                  style={styles.cameraButton}
                />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.photoText}>
            {isUploading ? 'Uploading...' : 'Add Profile Photo'}
          </Text>
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
              ? 'As a driver, please add either a profile photo OR bio (or both). This helps passengers trust you. You\'ll then be asked to add your vehicle details.'
              : 'Add either a profile photo OR bio (or both) to help other users recognize you. You can always update these later from your profile settings.'
            }
          </Text>
          <Text style={styles.requirementText}>
            💡 Tip: You only need to add one of these (photo or bio) to continue
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
          {isLoading ? 'Saving...' : 'Save Profile'}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#248CFE',
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
  requirementText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#248CFE',
    marginTop: 8,
    fontStyle: 'italic',
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
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
});

export default ProfileSetupScreen; 