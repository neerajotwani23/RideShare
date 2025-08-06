# 🚀 Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for file uploads in the RideShare app.

## 📋 Overview

The app now supports file uploads using Google Drive for:
- **Profile Pictures** (5MB max, images only)
- **Driving License Documents** (10MB max, images/PDFs)
- **Vehicle Registration Documents** (10MB max, images/PDFs)

## 🔧 Backend Setup

### 1. Install Dependencies

The required dependencies are already added to `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 2. Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Drive API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

3. **Create Service Account**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in service account details:
     - Name: `rideshare-file-upload`
     - Description: `Service account for RideShare file uploads`
   - Click "Create and Continue"

4. **Grant Permissions**
   - Role: "Editor" (or create custom role with Drive permissions)
   - Click "Done"

5. **Generate JSON Key**
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the JSON file

### 3. Environment Variables

Add these environment variables to your backend:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_CREDENTIALS_PATH=./credentials.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

### 4. Google Drive Folder Setup

1. **Create a folder in Google Drive**
   - Go to [Google Drive](https://drive.google.com/)
   - Create a new folder named "RideShare Files"

2. **Get Folder ID**
   - Right-click the folder
   - Click "Share" > "Copy link"
   - Extract the folder ID from the URL:
     ```
     https://drive.google.com/drive/folders/FOLDER_ID_HERE
     ```

3. **Share folder with service account**
   - Click "Share" on the folder
   - Add your service account email (from JSON file)
   - Give "Editor" permissions

### 5. Place Credentials File

1. **Save the JSON credentials file**
   - Place the downloaded JSON file in your backend root directory
   - Rename it to `credentials.json`
   - **IMPORTANT**: Add `credentials.json` to `.gitignore`

2. **Update .gitignore**
   ```gitignore
   # Google Drive credentials
   credentials.json
   *.json
   !package.json
   !package-lock.json
   ```

## 📱 Frontend Setup

### 1. Install Dependencies

The required dependencies are already added to `package.json`:
```bash
npm install
# or
yarn install
```

### 2. Android Permissions

Add these permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 3. iOS Permissions

Add these keys to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take profile pictures and document photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs access to photo library to select profile pictures and documents.</string>
```

## 🧪 Testing the Setup

### 1. Backend Testing

1. **Start the backend server**
   ```bash
   cd RideShare-Backend
   python -m uvicorn app.main:app --reload
   ```

2. **Test file upload endpoint**
   ```bash
   curl -X POST "http://localhost:8000/upload/profile-picture" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "file=@test_image.jpg"
   ```

### 2. Frontend Testing

1. **Start the React Native app**
   ```bash
   npm run android
   # or
   npm run ios
   ```

2. **Test file uploads**
   - Go to Profile Setup screen
   - Tap "Add Profile Photo"
   - Select camera or gallery
   - Verify upload works

## 🔒 Security Considerations

### 1. File Validation
- **File types**: Only images and PDFs allowed
- **File sizes**: 5MB for profile pictures, 10MB for documents
- **Virus scanning**: Consider implementing virus scanning for uploaded files

### 2. Access Control
- **Service account**: Use least privilege principle
- **Folder permissions**: Restrict folder access to service account only
- **Public URLs**: Files are made publicly accessible for app display

### 3. Data Privacy
- **File retention**: Implement file deletion policies
- **User consent**: Ensure users consent to file uploads
- **GDPR compliance**: Consider data protection regulations

## 🚨 Troubleshooting

### Common Issues

1. **"Google Drive service not available"**
   - Check if `credentials.json` exists and is valid
   - Verify Google Drive API is enabled
   - Check service account permissions

2. **"Failed to upload file to Google Drive"**
   - Check folder permissions
   - Verify folder ID is correct
   - Check internet connectivity

3. **"Camera permission denied"**
   - Grant camera permissions in app settings
   - Check Android/iOS permission configuration

4. **"File size too large"**
   - Reduce image quality in app settings
   - Compress images before upload
   - Check file size limits

### Debug Logs

Enable debug logging by setting environment variable:
```bash
export LOG_LEVEL=DEBUG
```

## 📚 API Endpoints

### File Upload Endpoints

| Endpoint | Method | Description | File Types | Max Size |
|----------|--------|-------------|------------|----------|
| `/upload/profile-picture` | POST | Upload profile picture | Images | 5MB |
| `/upload/driving-license` | POST | Upload driving license | Images/PDFs | 10MB |
| `/upload/vehicle-registration` | POST | Upload vehicle registration | Images/PDFs | 10MB |
| `/upload/delete/{file_id}` | DELETE | Delete file from Google Drive | Any | N/A |

### Response Format

```json
{
  "message": "File uploaded successfully",
  "file_id": "google_drive_file_id",
  "file_url": "https://drive.google.com/file/d/...",
  "filename": "user_123_profile_picture.jpg"
}
```

## 🔄 File Management

### Automatic Cleanup
- Old profile pictures are replaced when new ones are uploaded
- Document files are updated when new versions are uploaded
- Consider implementing automatic cleanup for unused files

### File Organization
Files are organized in Google Drive as:
```
RideShare Files/
├── profile_pictures/
│   ├── user_123_profile.jpg
│   └── user_456_profile.png
├── driving_licenses/
│   ├── user_123_license.jpg
│   └── user_456_license.pdf
└── vehicle_registrations/
    ├── user_123_registration.jpg
    └── user_456_registration.pdf
```

## 🎯 Next Steps

1. **Implement file compression** for better performance
2. **Add file preview** functionality
3. **Implement file versioning** for documents
4. **Add bulk upload** capabilities
5. **Implement file backup** strategy

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Drive API documentation
3. Check React Native Image Picker documentation
4. Contact the development team

---

**Note**: This setup requires a Google Cloud account and may incur costs based on API usage and storage. 