# RideShare App - Appium Test Suite

This directory contains comprehensive automated test cases for the RideShare React Native mobile application using Appium.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Test Cases](#test-cases)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Prerequisites

Before running the tests, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Appium** (v2.2.3 or higher)
- **Android Studio** (for Android testing)
- **Xcode** (for iOS testing, macOS only)
- **Java JDK** (v8 or higher)

### Device Requirements
- **Android Device/Emulator** with API level 21+
- **iOS Device/Simulator** with iOS 12+ (macOS only)
- **Physical Device** (recommended for more accurate testing)

### Appium Drivers
```bash
# Install required Appium drivers
appium driver install uiautomator2
appium driver install xcuitest
```

## 📦 Installation

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd RideShare
```

2. **Install test dependencies**:
```bash
cd appium-tests
npm install
```

3. **Install Appium globally** (if not already installed):
```bash
npm install -g appium
```

4. **Verify Appium installation**:
```bash
appium --version
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `appium-tests` directory:

```env
# Platform Configuration
PLATFORM=android  # or ios

# Appium Server Configuration
APPIUM_HOST=localhost
APPIUM_PORT=4723

# Android Configuration
ANDROID_DEVICE_NAME=Android Emulator
ANDROID_PLATFORM_VERSION=13.0
ANDROID_APP_PATH=../android/app/build/outputs/apk/debug/app-debug.apk
ANDROID_UDID=your_device_udid_here

# iOS Configuration (macOS only)
IOS_DEVICE_NAME=iPhone Simulator
IOS_PLATFORM_VERSION=16.0
IOS_APP_PATH=../ios/build/Build/Products/Debug-iphonesimulator/RideShare.app
IOS_UDID=your_device_udid_here
XCODE_ORG_ID=your_org_id_here
```

### Device Setup

#### Android Setup
1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect device** via USB
4. **Verify connection**:
```bash
adb devices
```

#### iOS Setup (macOS only)
1. **Open Xcode** and set up your development team
2. **Build the app** for simulator or device
3. **Verify connection**:
```bash
xcrun simctl list devices
```

## 🧪 Running Tests

### Start Appium Server

In a separate terminal, start the Appium server:

```bash
appium
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run only login tests
npm run test:login

# Run only signup tests
npm run test:signup

# Run all authentication tests
npm run test:auth
```

### Run Tests on Specific Platform

```bash
# Set platform and run tests
PLATFORM=android npm test
PLATFORM=ios npm test
```

### Run Individual Test Files

```bash
# Run specific test file
npx mocha --timeout 60000 --require @babel/register --require ./test-setup.js tests/login/login.test.js
```

## 📁 Test Structure

```
appium-tests/
├── config/
│   └── appium.config.js          # Appium configuration
├── utils/
│   └── selectors.js              # Element selectors
├── tests/
│   ├── login/
│   │   └── login.test.js         # Login test cases
│   └── signup/
│       └── signup.test.js        # Signup test cases
├── screenshots/                  # Test screenshots
├── package.json                  # Dependencies
├── test-setup.js                 # Test setup and helpers
├── .babelrc                      # Babel configuration
└── README.md                     # This file
```

## 🧪 Test Cases

### Login Tests (`tests/login/login.test.js`)

#### UI Tests
- ✅ Login screen displays all required elements
- ✅ Google Sign In button is present
- ✅ Input field labels and placeholders are correct

#### Form Validation Tests
- ✅ Empty email field validation
- ✅ Empty password field validation
- ✅ Invalid email format validation
- ✅ Short password validation

#### Password Visibility Tests
- ✅ Password visibility toggle functionality

#### Navigation Tests
- ✅ Navigation to signup screen
- ✅ Navigation to forgot password screen

#### Successful Login Tests
- ✅ Login with valid credentials
- ✅ Loading indicator during login process

#### Google Sign In Tests
- ✅ Google Sign In button functionality
- ✅ Google Sign In process handling

#### Error Handling Tests
- ✅ Network error handling
- ✅ Error message clearing

#### Accessibility Tests
- ✅ Accessibility labels for screen readers
- ✅ Keyboard navigation support

#### Performance Tests
- ✅ Login screen load time
- ✅ Rapid input handling

### Signup Tests (`tests/signup/signup.test.js`)

#### UI Tests
- ✅ Signup screen displays all required elements
- ✅ Back button and Google Sign Up button presence

#### Form Validation Tests
- ✅ Empty first name validation
- ✅ Empty last name validation
- ✅ Invalid email format validation
- ✅ Invalid CNIC format validation
- ✅ Password mismatch validation
- ✅ Short password validation

#### Gender Selection Tests
- ✅ Gender dropdown functionality
- ✅ Male gender selection
- ✅ Female gender selection

#### CNIC Formatting Tests
- ✅ CNIC input formatting
- ✅ Incomplete CNIC validation

#### Password Visibility Tests
- ✅ Password field visibility toggle
- ✅ Confirm password field visibility toggle

#### Navigation Tests
- ✅ Navigation back to login screen
- ✅ Navigation via signin link

#### Successful Signup Tests
- ✅ Account creation with valid data
- ✅ Loading indicator during signup

#### Google Sign Up Tests
- ✅ Google Sign Up button functionality

#### Form Reset Tests
- ✅ Form clearing on navigation

#### Accessibility Tests
- ✅ Accessibility labels for form elements

#### Performance Tests
- ✅ Signup screen load time
- ✅ Rapid form input handling

## 🔧 Test Helpers

The test suite includes helper functions for common operations:

### Screenshots
```javascript
await helpers.takeScreenshot('test_name');
```

### Element Operations
```javascript
await helpers.waitForElement(selector, timeout);
await helpers.safeClick(selector, maxRetries);
await helpers.safeInput(selector, text);
await helpers.elementExists(selector);
await helpers.getElementText(selector);
```

### Navigation
```javascript
await helpers.scrollToElement(selector);
await helpers.waitForPageLoad(timeout);
```

### Alert Handling
```javascript
await helpers.handleAlert('accept'); // or 'dismiss'
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Appium Server Connection
```bash
# Check if Appium is running
curl http://localhost:4723/status

# Restart Appium server
appium --log appium.log
```

#### 2. Device Connection
```bash
# Android devices
adb devices

# iOS devices (macOS)
xcrun simctl list devices
```

#### 3. App Installation
```bash
# Build Android app
cd android && ./gradlew assembleDebug

# Build iOS app (macOS)
cd ios && xcodebuild -workspace RideShare.xcworkspace -scheme RideShare -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 14'
```

#### 4. Permission Issues
- Ensure device has necessary permissions enabled
- Grant location, camera, and storage permissions
- Enable USB debugging (Android)

#### 5. Test Failures
- Check screenshots in `screenshots/` directory
- Review Appium logs for detailed error messages
- Verify element selectors match your app's UI

### Debug Mode

Run tests with verbose logging:

```bash
# Enable debug logging
DEBUG=* npm test

# Run with Appium logs
appium --log appium.log --log-level debug
```

### Manual Testing

For manual verification of selectors:

```bash
# Start Appium Inspector
appium --allow-insecure chromedriver_autodownload
```

Then open Appium Inspector at `http://localhost:4723`

## 📊 Test Reports

### Screenshots
- Screenshots are automatically captured before and after each test
- Located in `screenshots/` directory
- Named with test name and timestamp

### Logs
- Appium logs: `appium.log`
- Test execution logs in console
- Error details in test output

## 🤝 Contributing

### Adding New Tests

1. **Create test file** in appropriate directory
2. **Use existing selectors** from `utils/selectors.js`
3. **Follow naming conventions**:
   - Test files: `feature.test.js`
   - Test descriptions: descriptive and clear
   - Screenshot names: descriptive

### Adding New Selectors

1. **Update `utils/selectors.js`**
2. **Add platform-specific selectors** if needed
3. **Test selectors** manually before committing

### Code Style

- Use ES6+ syntax
- Follow existing test structure
- Add proper error handling
- Include descriptive console logs

## 📝 Notes

### Platform Differences
- **Android**: Uses UiAutomator2 driver
- **iOS**: Uses XCUITest driver
- **Selectors**: May need platform-specific adjustments

### Test Data
- Use test data that won't conflict with production
- Clean up test data after tests
- Use unique identifiers for test accounts

### Performance
- Tests include performance checks
- Monitor test execution time
- Optimize slow tests

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review Appium documentation
3. Check test logs and screenshots
4. Create issue with detailed description

---

**Happy Testing! 🚀** 