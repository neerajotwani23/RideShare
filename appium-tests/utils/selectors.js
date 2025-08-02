// Element Selectors for RideShare App
// This file contains all the element selectors used in the test cases

const selectors = {
  // Login Screen Elements
  login: {
    // Main elements
    welcomeTitle: '~Welcome Back!', // accessibility id
    welcomeSubtitle: '~Please Log in to continue.', // accessibility id
    emailInput: '~Email Address', // accessibility id for TextInput
    passwordInput: '~Password', // accessibility id for TextInput
    loginButton: '~Log In', // accessibility id for button
    forgotPasswordLink: '~Forgot password?', // accessibility id
    signupLink: '~Sign up', // accessibility id
    orDivider: '~OR', // accessibility id
    
    // Error messages
    errorText: '~error', // accessibility id for error helper text
    
    // Google Sign In
    googleSignInButton: '~Google Sign In', // accessibility id
    debugGoogleButton: '~Debug Google Sign-In', // accessibility id
    simpleConfigTestButton: '~Simple Config Test', // accessibility id
    
    // Eye icon for password visibility
    eyeIcon: '~eye-outline', // accessibility id
    eyeOffIcon: '~eye-off-outline', // accessibility id
  },

  // Signup Screen Elements
  signup: {
    // Main elements
    backButton: '~arrow-left', // accessibility id
    welcomeTitle: '~Join RideShare', // accessibility id
    welcomeSubtitle: '~Create your account to start sharing rides', // accessibility id
    
    // Form fields
    firstNameInput: '~First name', // accessibility id
    lastNameInput: '~Last name', // accessibility id
    emailInput: '~Email', // accessibility id
    phoneInput: '~Phone number', // accessibility id
    cnicInput: '~CNIC (i.e. xxxxx-xxxxxxx-x)', // accessibility id
    genderSelector: '~Select Gender', // accessibility id
    passwordInput: '~Password', // accessibility id
    confirmPasswordInput: '~Confirm password', // accessibility id
    
    // Buttons
    createAccountButton: '~Create Account', // accessibility id
    googleSignUpButton: '~Google Sign Up', // accessibility id
    signinLink: '~Sign in', // accessibility id
    
    // Gender options
    maleOption: '~Male', // accessibility id
    femaleOption: '~Female', // accessibility id
    
    // Error messages
    formError: '~form-error', // accessibility id
    cnicError: '~cnic-error', // accessibility id
  },

  // Common Elements
  common: {
    // Loading indicators
    loadingSpinner: '~ActivityIndicator', // accessibility id
    
    // Navigation
    homeTab: '~Home', // accessibility id
    profileTab: '~Profile', // accessibility id
    ridesTab: '~Rides', // accessibility id
    walletTab: '~Wallet', // accessibility id
    
    // Alerts and dialogs
    alertTitle: '~Alert Title', // accessibility id
    alertMessage: '~Alert Message', // accessibility id
    alertOKButton: '~OK', // accessibility id
    alertCancelButton: '~Cancel', // accessibility id
    
    // Success messages
    successMessage: '~Success', // accessibility id
  },

  // Home Screen Elements (after login)
  home: {
    // Main elements
    homeTitle: '~Home', // accessibility id
    findRideButton: '~Find Ride', // accessibility id
    postRideButton: '~Post Ride', // accessibility id
    myRidesButton: '~My Rides', // accessibility id
  },

  // Profile Screen Elements
  profile: {
    // Main elements
    profileTitle: '~Profile', // accessibility id
    editProfileButton: '~Edit Profile', // accessibility id
    settingsButton: '~Settings', // accessibility id
    logoutButton: '~Logout', // accessibility id
  }
};

// Platform-specific selectors
const androidSelectors = {
  // Android-specific selectors using resource-id
  login: {
    emailInput: 'id=com.rideshare.app:id/email_input',
    passwordInput: 'id=com.rideshare.app:id/password_input',
    loginButton: 'id=com.rideshare.app:id/login_button',
    forgotPasswordLink: 'id=com.rideshare.app:id/forgot_password_link',
    signupLink: 'id=com.rideshare.app:id/signup_link',
    googleSignInButton: 'id=com.rideshare.app:id/google_signin_button',
  },
  
  signup: {
    firstNameInput: 'id=com.rideshare.app:id/first_name_input',
    lastNameInput: 'id=com.rideshare.app:id/last_name_input',
    emailInput: 'id=com.rideshare.app:id/email_input',
    phoneInput: 'id=com.rideshare.app:id/phone_input',
    cnicInput: 'id=com.rideshare.app:id/cnic_input',
    genderSelector: 'id=com.rideshare.app:id/gender_selector',
    passwordInput: 'id=com.rideshare.app:id/password_input',
    confirmPasswordInput: 'id=com.rideshare.app:id/confirm_password_input',
    createAccountButton: 'id=com.rideshare.app:id/create_account_button',
  }
};

const iosSelectors = {
  // iOS-specific selectors using accessibility identifier
  login: {
    emailInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "Email Address"',
    passwordInput: '-ios predicate string:type == "XCUIElementTypeSecureTextField" AND accessibilityIdentifier == "Password"',
    loginButton: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Log In"',
    forgotPasswordLink: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Forgot password?"',
    signupLink: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Sign up"',
    googleSignInButton: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Google Sign In"',
  },
  
  signup: {
    firstNameInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "First name"',
    lastNameInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "Last name"',
    emailInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "Email"',
    phoneInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "Phone number"',
    cnicInput: '-ios predicate string:type == "XCUIElementTypeTextField" AND accessibilityIdentifier == "CNIC (i.e. xxxxx-xxxxxxx-x)"',
    genderSelector: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Select Gender"',
    passwordInput: '-ios predicate string:type == "XCUIElementTypeSecureTextField" AND accessibilityIdentifier == "Password"',
    confirmPasswordInput: '-ios predicate string:type == "XCUIElementTypeSecureTextField" AND accessibilityIdentifier == "Confirm password"',
    createAccountButton: '-ios predicate string:type == "XCUIElementTypeButton" AND accessibilityIdentifier == "Create Account"',
  }
};

// Helper function to get platform-specific selectors
function getSelectors(platform = 'android') {
  if (platform === 'android') {
    return { ...selectors, ...androidSelectors };
  } else if (platform === 'ios') {
    return { ...selectors, ...iosSelectors };
  }
  return selectors;
}

// Helper function to get selector by key path
function getSelector(keyPath, platform = 'android') {
  const allSelectors = getSelectors(platform);
  const keys = keyPath.split('.');
  let result = allSelectors;
  
  for (const key of keys) {
    if (result && result[key]) {
      result = result[key];
    } else {
      throw new Error(`Selector not found for key path: ${keyPath}`);
    }
  }
  
  return result;
}

module.exports = {
  selectors,
  androidSelectors,
  iosSelectors,
  getSelectors,
  getSelector
}; 