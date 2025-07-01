import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const VehicleDetailsScreen = ({ navigation }: any) => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [drivingLicenseFront, setDrivingLicenseFront] = useState<string | null>(null);
  const [drivingLicenseBack, setDrivingLicenseBack] = useState<string | null>(null);
  const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { completeProfileSetup } = useAuth();

  const handleDocumentUpload = (documentType: 'licenseFront' | 'licenseBack' | 'vehicleReg') => {
    Alert.alert(
      'Upload Document',
      'Choose how you want to upload your document',
      [
        { 
          text: 'Camera', 
          onPress: () => {
            console.log(`Camera selected for ${documentType}`);
            // Simulate document upload
            const mockImageUri = 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=Document';
            switch (documentType) {
              case 'licenseFront':
                setDrivingLicenseFront(mockImageUri);
                break;
              case 'licenseBack':
                setDrivingLicenseBack(mockImageUri);
                break;
              case 'vehicleReg':
                setVehicleRegistration(mockImageUri);
                break;
            }
          }
        },
        { 
          text: 'Gallery', 
          onPress: () => {
            console.log(`Gallery selected for ${documentType}`);
            // Simulate document upload
            const mockImageUri = 'https://via.placeholder.com/300x200/34C759/FFFFFF?text=Document';
            switch (documentType) {
              case 'licenseFront':
                setDrivingLicenseFront(mockImageUri);
                break;
              case 'licenseBack':
                setDrivingLicenseBack(mockImageUri);
                break;
              case 'vehicleReg':
                setVehicleRegistration(mockImageUri);
                break;
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
    if (!drivingLicenseFront) newErrors.drivingLicenseFront = 'Driving license front photo is required';
    if (!drivingLicenseBack) newErrors.drivingLicenseBack = 'Driving license back photo is required';
    if (!vehicleRegistration) newErrors.vehicleRegistration = 'Vehicle registration document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Save vehicle details and complete profile setup
      Alert.alert(
        'Success',
        'Vehicle details saved successfully! Your account will be reviewed and activated within 24 hours.',
        [
          { text: 'OK', onPress: () => completeProfileSetup() }
        ]
      );
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
      // If no previous screen, navigate to the main tab that contains profile
      navigation.navigate('MainTabs', { screen: 'Profile' });
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
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Driver Verification Required</Text>
            <Text style={styles.infoText}>
              Please provide your vehicle details and upload required documents for verification.
            </Text>
          </View>

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
              outlineColor={errors.vehicleMake ? "#FF3B30" : "#E0E0E0"}
              activeOutlineColor={errors.vehicleMake ? "#FF3B30" : "#007AFF"}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., Toyota, Honda, Suzuki"
              placeholderTextColor="#999999"
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
              outlineColor={errors.vehicleModel ? "#FF3B30" : "#E0E0E0"}
              activeOutlineColor={errors.vehicleModel ? "#FF3B30" : "#007AFF"}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., Corolla, Civic, Alto"
              placeholderTextColor="#999999"
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
              outlineColor={errors.vehicleColor ? "#FF3B30" : "#E0E0E0"}
              activeOutlineColor={errors.vehicleColor ? "#FF3B30" : "#007AFF"}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., White, Black, Silver"
              placeholderTextColor="#999999"
            />
            {errors.vehicleColor ? <Text style={styles.errorText}>{errors.vehicleColor}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>License Plate Number *</Text>
            <TextInput
              value={licensePlate}
              onChangeText={handleLicensePlateChange}
              style={[styles.textInput, errors.licensePlate ? styles.inputError : null]}
              mode="outlined"
              outlineColor={errors.licensePlate ? "#FF3B30" : "#E0E0E0"}
              activeOutlineColor={errors.licensePlate ? "#FF3B30" : "#007AFF"}
              contentStyle={styles.inputContent}
              outlineStyle={styles.inputOutline}
              placeholder="ABC-1234"
              placeholderTextColor="#999999"
              maxLength={8}
              autoCapitalize="characters"
            />
            {errors.licensePlate ? <Text style={styles.errorText}>{errors.licensePlate}</Text> : null}
          </View>

          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            
            <View style={styles.documentContainer}>
              <Text style={styles.documentLabel}>Driving License (Front) *</Text>
              <TouchableOpacity
                style={[styles.documentUpload, errors.drivingLicenseFront ? styles.documentError : null]}
                onPress={() => handleDocumentUpload('licenseFront')}
              >
                {drivingLicenseFront ? (
                  <View style={styles.documentPreview}>
                    <Image source={{ uri: drivingLicenseFront }} style={styles.documentImage} />
                    <Text style={styles.documentSuccess}>✓ Uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.documentPlaceholder}>
                    <IconButton icon="camera" size={32} iconColor="#666666" />
                    <Text style={styles.documentText}>Tap to upload front side</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.drivingLicenseFront ? <Text style={styles.errorText}>{errors.drivingLicenseFront}</Text> : null}
            </View>

            <View style={styles.documentContainer}>
              <Text style={styles.documentLabel}>Driving License (Back) *</Text>
              <TouchableOpacity
                style={[styles.documentUpload, errors.drivingLicenseBack ? styles.documentError : null]}
                onPress={() => handleDocumentUpload('licenseBack')}
              >
                {drivingLicenseBack ? (
                  <View style={styles.documentPreview}>
                    <Image source={{ uri: drivingLicenseBack }} style={styles.documentImage} />
                    <Text style={styles.documentSuccess}>✓ Uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.documentPlaceholder}>
                    <IconButton icon="camera" size={32} iconColor="#666666" />
                    <Text style={styles.documentText}>Tap to upload back side</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.drivingLicenseBack ? <Text style={styles.errorText}>{errors.drivingLicenseBack}</Text> : null}
            </View>

            <View style={styles.documentContainer}>
              <Text style={styles.documentLabel}>Vehicle Registration *</Text>
              <TouchableOpacity
                style={[styles.documentUpload, errors.vehicleRegistration ? styles.documentError : null]}
                onPress={() => handleDocumentUpload('vehicleReg')}
              >
                {vehicleRegistration ? (
                  <View style={styles.documentPreview}>
                    <Image source={{ uri: vehicleRegistration }} style={styles.documentImage} />
                    <Text style={styles.documentSuccess}>✓ Uploaded</Text>
                  </View>
                ) : (
                  <View style={styles.documentPlaceholder}>
                    <IconButton icon="camera" size={32} iconColor="#666666" />
                    <Text style={styles.documentText}>Tap to upload vehicle card</Text>
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
        >
          Submit for Verification
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
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#1976D2',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputContent: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#FF3B30',
    marginTop: 4,
  },
  documentsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#000000',
    marginBottom: 20,
  },
  documentContainer: {
    marginBottom: 24,
  },
  documentLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#000000',
    marginBottom: 8,
  },
  documentUpload: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderStyle: 'dashed',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  documentError: {
    borderColor: '#FF3B30',
  },
  documentPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  documentText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666666',
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
    color: '#34C759',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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

export default VehicleDetailsScreen; 