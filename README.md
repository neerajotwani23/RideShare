# RideShare

A React Native ride-sharing application with Google Sign-In integration.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- React Native CLI
- Android Studio / Xcode
- Firebase project setup

### Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your environment variables in `.env`:**
   ```bash
   # Google Sign-In Configuration
   GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
   
   # API Configuration
   DEV_API_URL=http://your_dev_ip:8000
   PROD_API_URL=https://your-production-api.com
   
   # Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   FIREBASE_PROJECT_NUMBER=your_firebase_project_number_here
   FIREBASE_MOBILE_SDK_APP_ID=your_firebase_mobile_sdk_app_id_here
   
   # Groq AI Configuration
   GROQ_API_KEY=your_groq_api_key_here
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
