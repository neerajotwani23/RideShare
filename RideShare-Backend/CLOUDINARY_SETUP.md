# Cloudinary Setup Guide

## Overview
Cloudinary is a cloud-based service that provides solutions for image and video management. It's much simpler to set up than Google Drive and doesn't require Google Workspace.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up For Free"
3. Fill in your details and create an account
4. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. After logging in, you'll be taken to your dashboard
2. Look for the "Account Details" section
3. You'll find:
   - **Cloud Name** (e.g., `mycloud`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 3: Update Environment Variables

Update your `.env` file in the `RideShare-Backend` directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

## Step 4: Install Cloudinary Dependencies

The Cloudinary Python library is already added to `requirements.txt`. Install it:

```bash
pip install cloudinary==1.40.0
```

## Step 5: Test the Setup

1. Start your backend server
2. Try uploading a profile picture from the app
3. Check your Cloudinary dashboard to see if files are uploaded

## Features

- **Automatic Image Optimization**: Cloudinary automatically optimizes images
- **Multiple Formats**: Supports images, videos, and documents
- **CDN**: Fast global delivery
- **Free Tier**: 25 GB storage and 25 GB bandwidth per month
- **No Google Workspace Required**: Works with any Google account

## File Structure in Cloudinary

Files will be organized in folders:
- `rideshare/profile_pictures/` - User profile pictures
- `rideshare/driving_licenses/` - Driving license documents
- `rideshare/vehicle_registrations/` - Vehicle registration documents

## Security

- API Secret should be kept secure
- Files are uploaded with unique names to prevent conflicts
- Public URLs are generated for easy access

## Troubleshooting

1. **"Invalid credentials" error**: Check your API key and secret
2. **"Cloud name not found" error**: Verify your cloud name
3. **Upload fails**: Check your internet connection and Cloudinary service status

## Benefits Over Google Drive

- ✅ No Google Workspace required
- ✅ Simpler setup
- ✅ Better image optimization
- ✅ Faster uploads
- ✅ Built-in CDN
- ✅ No storage quota issues
- ✅ Free tier available 