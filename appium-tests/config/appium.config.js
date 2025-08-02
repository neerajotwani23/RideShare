const path = require('path');

// Appium Configuration for RideShare App
const appiumConfig = {
  // Appium Server Configuration
  host: process.env.APPIUM_HOST || 'localhost',
  port: process.env.APPIUM_PORT || 4723,
  path: '/wd/hub',
  
  // Android Configuration
  android: {
    platformName: 'Android',
    automationName: 'UiAutomator2',
    deviceName: process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
    platformVersion: process.env.ANDROID_PLATFORM_VERSION || '13.0',
    app: process.env.ANDROID_APP_PATH || path.join(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
    appPackage: 'com.rideshare.app',
    appActivity: 'com.rideshare.app.MainActivity',
    noReset: false,
    fullReset: true,
    autoGrantPermissions: true,
    newCommandTimeout: 60,
    uiautomator2ServerLaunchTimeout: 60000,
    uiautomator2ServerInstallTimeout: 60000,
    androidInstallTimeout: 90000,
    adbExecTimeout: 60000,
    androidDeviceReadyTimeout: 60000,
    avdLaunchTimeout: 60000,
    avdReadyTimeout: 60000,
    systemPort: 8200,
    chromeDriverPort: 9515,
    // Additional Android capabilities
    disableWindowAnimation: true,
    skipServerInstallation: false,
    skipDeviceInitialization: false,
    skipUnlock: false,
    unlockType: 'pin',
    unlockKey: '1234',
    // For physical devices
    udid: process.env.ANDROID_UDID || undefined,
  },

  // iOS Configuration
  ios: {
    platformName: 'iOS',
    automationName: 'XCUITest',
    deviceName: process.env.IOS_DEVICE_NAME || 'iPhone Simulator',
    platformVersion: process.env.IOS_PLATFORM_VERSION || '16.0',
    app: process.env.IOS_APP_PATH || path.join(__dirname, '../../ios/build/Build/Products/Debug-iphonesimulator/RideShare.app'),
    bundleId: 'com.rideshare.app',
    noReset: false,
    fullReset: true,
    autoAcceptAlerts: true,
    newCommandTimeout: 60,
    webDriverAgentUrl: process.env.WEBDRIVER_AGENT_URL || undefined,
    // Additional iOS capabilities
    showXcodeLog: true,
    showIOSLog: true,
    // For physical devices
    udid: process.env.IOS_UDID || undefined,
    xcodeOrgId: process.env.XCODE_ORG_ID || undefined,
    xcodeSigningId: process.env.XCODE_SIGNING_ID || 'iPhone Developer',
  },

  // Common capabilities
  common: {
    newCommandTimeout: 60,
    noReset: false,
    fullReset: true,
    autoGrantPermissions: true,
    autoAcceptAlerts: true,
    // Screenshot settings
    screenshotOnError: true,
    screenshotOnFailure: true,
    // Performance settings
    disableWindowAnimation: true,
    disableSuppressAccessibilityService: true,
  }
};

module.exports = appiumConfig; 