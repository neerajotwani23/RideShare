import { launchImageLibrary, launchCamera, ImagePickerResponse, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { api } from './api';

export interface FileUploadResponse {
  message: string;
  file_id: string;
  file_url: string;
  filename: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileUploadService {
  /**
   * Request camera permissions for Android
   */
  private async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Camera permission request failed:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Request storage permissions for Android
   */
  private async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        // For Android 13+ (API 33+), use READ_MEDIA_IMAGES
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Media Permission',
              message: 'This app needs access to your photos to select images.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For older Android versions, use READ_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to your storage to select photos.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn('Storage permission request failed:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * Show image picker options
   */
  private showImagePickerOptions(): Promise<'camera' | 'gallery' | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose how you want to select an image',
        [
          {
            text: 'Camera',
            onPress: () => resolve('camera'),
          },
          {
            text: 'Gallery',
            onPress: () => resolve('gallery'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }

  /**
   * Launch camera to take a photo
   */
  private async launchCameraForImage(): Promise<ImagePickerResponse> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      saveToPhotos: false,
    };

    return new Promise((resolve, reject) => {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          reject(new Error('Camera cancelled'));
        } else if (response.errorCode) {
          reject(new Error(`Camera error: ${response.errorMessage}`));
        } else if (response.assets && response.assets[0]) {
          resolve(response);
        } else {
          reject(new Error('No image selected'));
        }
      });
    });
  }

  /**
   * Launch image library to select a photo
   */
  private async launchImageLibraryForImage(): Promise<ImagePickerResponse> {
    const hasPermission = await this.requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    return new Promise((resolve, reject) => {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          reject(new Error('Gallery cancelled'));
        } else if (response.errorCode) {
          reject(new Error(`Gallery error: ${response.errorMessage}`));
        } else if (response.assets && response.assets[0]) {
          resolve(response);
        } else {
          reject(new Error('No image selected'));
        }
      });
    });
  }

  /**
   * Select image from camera or gallery
   */
  async selectImage(): Promise<ImagePickerResponse> {
    const source = await this.showImagePickerOptions();
    
    if (!source) {
      throw new Error('Image selection cancelled');
    }

    if (source === 'camera') {
      return this.launchCameraForImage();
    } else {
      return this.launchImageLibraryForImage();
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(): Promise<FileUploadResponse> {
    try {
      console.log('📸 Starting profile picture upload...');
      
      const response = await this.selectImage();
      const asset = response.assets![0];
      
      if (!asset.uri) {
        throw new Error('No image URI available');
      }

      console.log('📁 Selected image:', {
        uri: asset.uri,
        type: asset.type,
        fileName: asset.fileName,
        fileSize: asset.fileSize
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'profile_picture.jpg',
      } as any);

      console.log('📤 Uploading to backend...');
      
      // Upload to backend
      const uploadResponse = await api.uploadProfilePicture(formData);
      
      console.log('✅ Upload successful:', uploadResponse);
      return uploadResponse;
    } catch (error) {
      console.error('❌ Profile picture upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Upload driving license
   */
  async uploadDrivingLicense(): Promise<FileUploadResponse> {
    try {
      const response = await this.selectImage();
      const asset = response.assets![0];
      
      if (!asset.uri) {
        throw new Error('No image URI available');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'driving_license.jpg',
      } as any);

      // Upload to backend
      const uploadResponse = await api.uploadDrivingLicense(formData);
      return uploadResponse;
    } catch (error) {
      console.error('Driving license upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload vehicle registration
   */
  async uploadVehicleRegistration(): Promise<FileUploadResponse> {
    try {
      const response = await this.selectImage();
      const asset = response.assets![0];
      
      if (!asset.uri) {
        throw new Error('No image URI available');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'vehicle_registration.jpg',
      } as any);

      // Upload to backend
      const uploadResponse = await api.uploadVehicleRegistration(formData);
      return uploadResponse;
    } catch (error) {
      console.error('Vehicle registration upload failed:', error);
      throw error;
    }
  }

  /**
   * Delete file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await api.deleteFile(fileId);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  }
}

export const fileUploadService = new FileUploadService(); 