import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';
import { api } from '../../services/api';
import { authDebugService } from '../../services/debugAuth';

const VehicleDetailsScreen = ({ navigation }: any) => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingVehicle, setExistingVehicle] = useState<any>(null);
  
  const { completeVehicleDetails, logout } = useAuth();

  // Load existing vehicle data on component mount
  useEffect(() => {
    loadExistingVehicle();
  }, []);

  const loadExistingVehicle = async () => {
    try {
      console.log('🔄 Starting to load existing vehicle and user data...');
      setIsLoadingData(true);
      
      // Check if user is authenticated
      const token = await AsyncStorage.getItem('accessToken');
      console.log('🔑 Token available:', !!token);
      
      // Load both vehicle and user data
      const [vehicles, userProfile] = await Promise.all([
        api.getMyVehicles(),
        api.getProfile()
      ]);
      
      console.log('🚗 Vehicles loaded:', vehicles);
      console.log('👤 User profile loaded:', userProfile);
      console.log('📊 Vehicles array length:', vehicles?.length);
      
      // Set user driving license from profile
      if (userProfile?.driving_license) {
        setDrivingLicense(userProfile.driving_license);
        console.log('🪪 User driving license:', userProfile.driving_license);
      }
      
      if (vehicles && vehicles.length > 0) {
        const vehicle = vehicles[0]; // Get the first vehicle
        console.log('🚗 Vehicle data:', vehicle);
        setExistingVehicle(vehicle);
        
        // Populate form with existing data using correct field names
        const make = vehicle.name_make || '';
        const plate = vehicle.no_plate || '';
        console.log('🔧 Setting make:', make, 'plate:', plate);
        setVehicleMake(make);
        setVehicleModel(vehicle.model || '');
        setVehicleColor(vehicle.color || '');
        setLicensePlate(plate);
        setVehicleRegistration(vehicle.registration || null);
        
        // Also load driving license from user profile if not already set
        if (!drivingLicense && userProfile?.driving_license) {
          setDrivingLicense(userProfile.driving_license);
        }
        
        // Check if vehicle data is incomplete
        if (!make || !plate) {
          console.log('⚠️ Vehicle data is incomplete - missing make or plate');
        } else {
          console.log('✅ Vehicle data loaded successfully');
        }
      } else {
        console.log('ℹ️ No existing vehicles found - this is normal for new users');
      }
    } catch (error) {
      console.error('❌ Error loading vehicle data:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingData(false);
      console.log('🏁 Finished loading vehicle data');
    }
  };

  const handleDocumentUpload = (documentType: 'vehicleReg' | 'drivingLicense') => {
    const documentName = documentType === 'vehicleReg' ? 'Vehicle Registration' : 'Driving License';
    Alert.alert(
      `Upload ${documentName}`,
      `Choose how you want to upload your ${documentName.toLowerCase()} document`,
      [
        { 
          text: 'Camera', 
          onPress: () => {
            console.log(`Camera selected for ${documentType}`);
            // Simulate document upload
            const mockImageUri = `https://via.placeholder.com/300x200/007AFF/FFFFFF?text=${documentName.replace(' ', '+')}`;
            if (documentType === 'vehicleReg') {
              setVehicleRegistration(mockImageUri);
            } else {
              setDrivingLicense(mockImageUri);
            }
          }
        },
        { 
          text: 'Gallery', 
          onPress: () => {
            console.log(`Gallery selected for ${documentType}`);
            // Simulate document upload
            const mockImageUri = `https://via.placeholder.com/300x200/34C759/FFFFFF?text=${documentName.replace(' ', '+')}`;
            if (documentType === 'vehicleReg') {
              setVehicleRegistration(mockImageUri);
            } else {
              setDrivingLicense(mockImageUri);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!vehicleMake.trim()) newErrors.vehicleMake = 'Vehicle make is required';
    if (!vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!vehicleColor.trim()) newErrors.vehicleColor = 'Vehicle color is required';
    if (!licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!drivingLicense) newErrors.drivingLicense = 'Driving license document is required';
    if (!vehicleRegistration) newErrors.vehicleRegistration = 'Vehicle registration document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Update vehicle data
      const vehicleData = {
        name_make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        color: vehicleColor.trim(),
        no_plate: licensePlate.trim(),
        registration: vehicleRegistration,
      };

      // Update user profile with driving license if it has changed
      if (drivingLicense) {
        try {
          await api.updateProfile({
            driving_license: drivingLicense
          });
          console.log('✅ Driving license updated in user profile');
        } catch (profileError) {
          console.error('❌ Failed to update driving license in profile:', profileError);
          // Don't fail the entire save operation if profile update fails
        }
      }

      if (existingVehicle) {
        // Update existing vehicle
        await api.updateVehicle(existingVehicle.id, vehicleData);
        
        // Check if vehicle data is now complete and mark as complete if needed
        const updatedVehicle = { ...existingVehicle, ...vehicleData };
        const isComplete = updatedVehicle.name_make && updatedVehicle.no_plate && drivingLicense;
        
        if (isComplete) {
          await completeVehicleDetails();
          Alert.alert(
            'Vehicle Setup Complete!',
            'Your vehicle details and documents have been updated successfully. You can now start posting rides and earning money!',
            [{ text: 'OK' }]
          );
        } else {
        Alert.alert(
          'Vehicle Updated!',
            'Your vehicle details have been updated. Please complete all required fields to finish setup.',
          [{ text: 'OK' }]
        );
        }
      } else {
        // Create new vehicle
        await api.createVehicle(vehicleData);
        
        // Complete vehicle details setup (only for new vehicles)
        await completeVehicleDetails();
        
        Alert.alert(
          'Vehicle Setup Complete!',
          'Your vehicle details and documents have been saved successfully. You can now start posting rides and earning money!',
          [{ text: 'OK' }]
        );
      }
      
      // Navigation will be handled automatically by AppNavigator
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save vehicle details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatLicensePlate = (text: string) => {
    // Format license plate (e.g., ABC-123 or ABC-1234)
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
    }
  };

  const handleLicensePlateChange = (text: string) => {
    const formatted = formatLicensePlate(text);
    setLicensePlate(formatted);
    if (errors.licensePlate) {
      setErrors({...errors, licensePlate: ''});
    }
  };

  const handleBackPress = () => {
    // Check if we can go back (there's a previous screen in the stack)
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // If no previous screen, this means we're in initial setup flow
      // Show exit confirmation
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

  const handleDebugAuth = async () => {
    try {
      await authDebugService.logAuthDebugInfo();
      Alert.alert(
        'Debug Info',
        'Authentication debug information has been logged to the console. Check the console for details.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Debug Error', `Failed to get debug info: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={COLORS.secondary}
          onPress={handleBackPress}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <IconButton
          icon="bug"
          size={20}
          iconColor={COLORS.secondary}
          onPress={handleDebugAuth}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {isLoadingData ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Loading vehicle details...</Text>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>
                {existingVehicle ? 'Update Vehicle Details' : 'Vehicle Setup Required'}
              </Text>
              <Text style={styles.infoText}>
                {existingVehicle 
                  ? existingVehicle.name_make && existingVehicle.no_plate
                    ? 'Update your vehicle details and documents. Changes will be reflected immediately.'
                    : 'Your vehicle details are incomplete. Please fill in the missing information below.'
                  : 'As a driver, you need to add your vehicle details and upload required documents. This is a one-time setup to verify your account.'
                }
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vehicle Make *</Text>
            <TextInput
              value={vehicleMake}
              onChangeText={(text) => {
                setVehicleMake(text);
                if (errors.vehicleMake) setErrors({...errors, vehicleMake: ''});
              }}
              style={[styles.textInput, errors.vehicleMake ? styles.inputError : null]}
              mode="outlined"
              outlineColor={errors.vehicleMake ? COLORS.error : COLORS.border}
              activeOutlineColor={errors.vehicleMake ? COLORS.error : COLORS.accent}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., Toyota, Honda, Suzuki"
              placeholderTextColor={COLORS.textSecondary}
            />
            {errors.vehicleMake ? <Text style={styles.errorText}>{errors.vehicleMake}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vehicle Model *</Text>
            <TextInput
              value={vehicleModel}
              onChangeText={(text) => {
                setVehicleModel(text);
                if (errors.vehicleModel) setErrors({...errors, vehicleModel: ''});
              }}
              style={[styles.textInput, errors.vehicleModel ? styles.inputError : null]}
              mode="outlined"
              outlineColor={errors.vehicleModel ? COLORS.error : COLORS.border}
              activeOutlineColor={errors.vehicleModel ? COLORS.error : COLORS.accent}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., Corolla, Civic, Alto"
              placeholderTextColor={COLORS.textSecondary}
            />
            {errors.vehicleModel ? <Text style={styles.errorText}>{errors.vehicleModel}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vehicle Color *</Text>
            <TextInput
              value={vehicleColor}
              onChangeText={(text) => {
                setVehicleColor(text);
                if (errors.vehicleColor) setErrors({...errors, vehicleColor: ''});
              }}
              style={[styles.textInput, errors.vehicleColor ? styles.inputError : null]}
              mode="outlined"
              outlineColor={errors.vehicleColor ? COLORS.error : COLORS.border}
              activeOutlineColor={errors.vehicleColor ? COLORS.error : COLORS.accent}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., White, Black, Silver"
              placeholderTextColor={COLORS.textSecondary}
            />
            {errors.vehicleColor ? <Text style={styles.errorText}>{errors.vehicleColor}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>License Plate *</Text>
            <TextInput
              value={licensePlate}
              onChangeText={handleLicensePlateChange}
              style={[styles.textInput, errors.licensePlate ? styles.inputError : null]}
              mode="outlined"
              outlineColor={errors.licensePlate ? COLORS.error : COLORS.border}
              activeOutlineColor={errors.licensePlate ? COLORS.error : COLORS.accent}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., ABC-123"
              placeholderTextColor={COLORS.textSecondary}
              autoCapitalize="characters"
            />
            {errors.licensePlate ? <Text style={styles.errorText}>{errors.licensePlate}</Text> : null}
          </View>

          {/* Document Upload Sections */}
          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            
            {/* Driving License Document */}
            <View style={styles.documentContainer}>
              <Text style={styles.documentLabel}>Driving License Document *</Text>
              <TouchableOpacity
                style={styles.documentUpload}
                onPress={() => handleDocumentUpload('drivingLicense')}
              >
                {drivingLicense ? (
                  <Image source={{ uri: drivingLicense }} style={styles.documentImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadText}>Upload Driving License</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.drivingLicense ? <Text style={styles.errorText}>{errors.drivingLicense}</Text> : null}
            </View>

            {/* Vehicle Registration */}
            <View style={styles.documentContainer}>
              <Text style={styles.documentLabel}>Vehicle Registration *</Text>
              <TouchableOpacity
                style={styles.documentUpload}
                onPress={() => handleDocumentUpload('vehicleReg')}
              >
                {vehicleRegistration ? (
                  <Image source={{ uri: vehicleRegistration }} style={styles.documentImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadText}>Upload Document</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.vehicleRegistration ? <Text style={styles.errorText}>{errors.vehicleRegistration}</Text> : null}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          disabled={isLoadingData || isSaving}
          loading={isSaving}
        >
          {existingVehicle 
            ? existingVehicle.name_make && existingVehicle.no_plate
              ? 'Update Vehicle'
              : 'Complete Vehicle Details'
            : 'Save & Complete Setup'
          }
        </Button>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    margin: 0,
  },
  debugButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  infoContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.primary,
    fontSize: 16,
    color: COLORS.secondary,
    borderRadius: 16,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 16,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.error,
    marginTop: 4,
  },
  documentsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.secondary,
    marginBottom: 20,
  },
  documentContainer: {
    marginBottom: 24,
  },
  documentLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  documentUpload: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderStyle: 'dashed',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  documentError: {
    borderColor: COLORS.error,
  },
  documentPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  documentText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  documentPreview: {
    alignItems: 'center',
    padding: 12,
  },
  documentImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentSuccess: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#248CFE',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
  },
  buttonContent: {
    paddingVertical: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.primary,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default VehicleDetailsScreen; 