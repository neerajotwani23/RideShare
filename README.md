# RideShare

A React Native ride-sharing application with Google Sign-In integration.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- React Native CLI
- Android Studio / Xcode
- Firebase project setup

### Environment Setup

1. **Set up environment variables:**
   ```bash
   npm run setup-env
   ```
   This will create a `.env` file from the template.

2. **Fill in your environment variables in `.env`:**
   ```bash
   # Google Sign-In Configuration
   GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
   
   # Google Maps API Key
   GOOGLE_API_KEY=your_google_maps_api_key_here
   
   # Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   
   # API Configuration
   API_BASE_URL=http://your_dev_ip:8000
   
   # Package name for Firebase configuration
   PACKAGE_NAME=com.rideshare.app
   
   # Other sensitive configurations
   SECRET_KEY=your_secret_key_here
   ```

3. **Generate Firebase configuration:**
   ```bash
   npm run generate-firebase-config
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the app:**
   ```bash
   npm run android
   # or
   npm run ios
   ```

## 🔐 Security

- **Environment variables** are stored in `.env` files (not committed to git)
- **Firebase configuration** is generated from environment variables
- **Sensitive data** is protected and not exposed in the repository

## 📱 Features

- Google Sign-In authentication
- Ride booking and management
- Real-time chat
- Payment integration
- User profiles and ratings

## 🛠️ Development

### Backend Setup
```bash
cd RideShare-Backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Environment Variables
All sensitive configuration is managed through environment variables. See `.env.example` for the required variables.
