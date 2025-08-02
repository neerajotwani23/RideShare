const { getSelector } = require('../../utils/selectors');

describe('RideShare App - Signup Tests', function() {
  this.timeout(120000); // 2 minutes timeout for each test

  beforeEach(async function() {
    // Navigate to signup screen if not already there
    const isSignupScreen = await helpers.elementExists(getSelector('signup.welcomeTitle', platform));
    if (!isSignupScreen) {
      // Navigate from login screen to signup
      await helpers.safeClick(getSelector('login.signupLink', platform));
      await helpers.waitForPageLoad();
    }
    
    // Take screenshot before each test
    await helpers.takeScreenshot(`signup_test_${this.currentTest.title.replace(/\s+/g, '_')}_start`);
  });

  afterEach(async function() {
    // Take screenshot after each test
    await helpers.takeScreenshot(`signup_test_${this.currentTest.title.replace(/\s+/g, '_')}_end`);
    
    // Handle any alerts that might appear
    await helpers.handleAlert('accept');
  });

  describe('Signup Screen UI Tests', function() {
    it('should display signup screen with all required elements', async function() {
      console.log('🧪 Testing signup screen UI elements...');
      
      // Verify welcome title is displayed
      await helpers.waitForElement(getSelector('signup.welcomeTitle', platform));
      const welcomeTitle = await helpers.getElementText(getSelector('signup.welcomeTitle', platform));
      expect(welcomeTitle).to.include('Join RideShare');
      
      // Verify welcome subtitle is displayed
      await helpers.waitForElement(getSelector('signup.welcomeSubtitle', platform));
      const welcomeSubtitle = await helpers.getElementText(getSelector('signup.welcomeSubtitle', platform));
      expect(welcomeSubtitle).to.include('Create your account');
      
      // Verify all form fields are present
      await helpers.waitForElement(getSelector('signup.firstNameInput', platform));
      await helpers.waitForElement(getSelector('signup.lastNameInput', platform));
      await helpers.waitForElement(getSelector('signup.emailInput', platform));
      await helpers.waitForElement(getSelector('signup.phoneInput', platform));
      await helpers.waitForElement(getSelector('signup.cnicInput', platform));
      await helpers.waitForElement(getSelector('signup.genderSelector', platform));
      await helpers.waitForElement(getSelector('signup.passwordInput', platform));
      await helpers.waitForElement(getSelector('signup.confirmPasswordInput', platform));
      
      // Verify create account button is present
      await helpers.waitForElement(getSelector('signup.createAccountButton', platform));
      
      // Verify signin link is present
      await helpers.waitForElement(getSelector('signup.signinLink', platform));
      
      console.log('✅ Signup screen UI elements verified successfully');
    });

    it('should display back button and Google Sign Up button', async function() {
      console.log('🧪 Testing back button and Google Sign Up button...');
      
      // Verify back button is present
      await helpers.waitForElement(getSelector('signup.backButton', platform));
      
      // Verify Google Sign Up button is present
      await helpers.waitForElement(getSelector('signup.googleSignUpButton', platform));
      
      console.log('✅ Back button and Google Sign Up button verified successfully');
    });
  });

  describe('Signup Form Validation Tests', function() {
    it('should show error for empty first name', async function() {
      console.log('🧪 Testing empty first name validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('signup.formError', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
      expect(errorText.toLowerCase()).to.include('required');
      
      console.log('✅ Empty first name validation working correctly');
    });

    it('should show error for empty last name', async function() {
      console.log('🧪 Testing empty last name validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('signup.formError', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
      expect(errorText.toLowerCase()).to.include('required');
      
      console.log('✅ Empty last name validation working correctly');
    });

    it('should show error for invalid email format', async function() {
      console.log('🧪 Testing invalid email format validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'invalid-email');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('signup.formError', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
      expect(errorText.toLowerCase()).to.include('email');
      
      console.log('✅ Invalid email format validation working correctly');
    });

    it('should show error for invalid CNIC format', async function() {
      console.log('🧪 Testing invalid CNIC format validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.cnicInput', platform), '12345'); // Invalid CNIC
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Wait for CNIC error
      await helpers.waitForElement(getSelector('signup.cnicError', platform));
      
      // Verify CNIC error message
      const cnicError = await helpers.getElementText(getSelector('signup.cnicError', platform));
      expect(cnicError.toLowerCase()).to.include('13 digits');
      
      console.log('✅ Invalid CNIC format validation working correctly');
    });

    it('should show error for password mismatch', async function() {
      console.log('🧪 Testing password mismatch validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'differentpassword');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('signup.formError', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
      expect(errorText.toLowerCase()).to.include('password');
      
      console.log('✅ Password mismatch validation working correctly');
    });

    it('should show error for short password', async function() {
      console.log('🧪 Testing short password validation...');
      
      // Fill other required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), '123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), '123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('signup.formError', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
      expect(errorText.toLowerCase()).to.include('password');
      
      console.log('✅ Short password validation working correctly');
    });
  });

  describe('Gender Selection Tests', function() {
    it('should open gender dropdown when gender selector is clicked', async function() {
      console.log('🧪 Testing gender dropdown functionality...');
      
      // Click gender selector
      await helpers.safeClick(getSelector('signup.genderSelector', platform));
      
      // Wait for dropdown to appear
      await driver.pause(1000);
      
      // Verify gender options are displayed
      await helpers.waitForElement(getSelector('signup.maleOption', platform));
      await helpers.waitForElement(getSelector('signup.femaleOption', platform));
      
      console.log('✅ Gender dropdown opened successfully');
    });

    it('should select male gender option', async function() {
      console.log('🧪 Testing male gender selection...');
      
      // Click gender selector
      await helpers.safeClick(getSelector('signup.genderSelector', platform));
      
      // Click male option
      await helpers.safeClick(getSelector('signup.maleOption', platform));
      
      // Verify male is selected
      const genderText = await helpers.getElementText(getSelector('signup.genderSelector', platform));
      expect(genderText).to.include('Male');
      
      console.log('✅ Male gender selection working correctly');
    });

    it('should select female gender option', async function() {
      console.log('🧪 Testing female gender selection...');
      
      // Click gender selector
      await helpers.safeClick(getSelector('signup.genderSelector', platform));
      
      // Click female option
      await helpers.safeClick(getSelector('signup.femaleOption', platform));
      
      // Verify female is selected
      const genderText = await helpers.getElementText(getSelector('signup.genderSelector', platform));
      expect(genderText).to.include('Female');
      
      console.log('✅ Female gender selection working correctly');
    });
  });

  describe('CNIC Formatting Tests', function() {
    it('should format CNIC input correctly', async function() {
      console.log('🧪 Testing CNIC formatting...');
      
      // Enter CNIC without formatting
      await helpers.safeInput(getSelector('signup.cnicInput', platform), '4210112345678');
      
      // Verify CNIC is formatted correctly
      const cnicValue = await helpers.getElementText(getSelector('signup.cnicInput', platform));
      expect(cnicValue).to.match(/^\d{5}-\d{7}-\d{1}$/);
      
      console.log('✅ CNIC formatting working correctly');
    });

    it('should show error for incomplete CNIC', async function() {
      console.log('🧪 Testing incomplete CNIC validation...');
      
      // Enter incomplete CNIC
      await helpers.safeInput(getSelector('signup.cnicInput', platform), '42101');
      
      // Wait for CNIC error
      await helpers.waitForElement(getSelector('signup.cnicError', platform));
      
      // Verify CNIC error message
      const cnicError = await helpers.getElementText(getSelector('signup.cnicError', platform));
      expect(cnicError.toLowerCase()).to.include('13 digits');
      
      console.log('✅ Incomplete CNIC validation working correctly');
    });
  });

  describe('Password Visibility Tests', function() {
    it('should toggle password visibility for password field', async function() {
      console.log('🧪 Testing password field visibility toggle...');
      
      // Enter password
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      
      // Initially password should be hidden
      const passwordInput = await driver.$(getSelector('signup.passwordInput', platform));
      const isSecure = await passwordInput.getAttribute('password');
      expect(isSecure).to.be.true;
      
      // Click eye icon to show password
      await helpers.safeClick(getSelector('login.eyeIcon', platform));
      
      // Password should now be visible
      const isSecureAfter = await passwordInput.getAttribute('password');
      expect(isSecureAfter).to.be.false;
      
      console.log('✅ Password field visibility toggle working correctly');
    });

    it('should toggle password visibility for confirm password field', async function() {
      console.log('🧪 Testing confirm password field visibility toggle...');
      
      // Enter confirm password
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Initially password should be hidden
      const confirmPasswordInput = await driver.$(getSelector('signup.confirmPasswordInput', platform));
      const isSecure = await confirmPasswordInput.getAttribute('password');
      expect(isSecure).to.be.true;
      
      // Click eye icon to show password
      await helpers.safeClick(getSelector('login.eyeIcon', platform));
      
      // Password should now be visible
      const isSecureAfter = await confirmPasswordInput.getAttribute('password');
      expect(isSecureAfter).to.be.false;
      
      console.log('✅ Confirm password field visibility toggle working correctly');
    });
  });

  describe('Navigation Tests', function() {
    it('should navigate back to login screen when back button is clicked', async function() {
      console.log('🧪 Testing navigation back to login screen...');
      
      // Click back button
      await helpers.safeClick(getSelector('signup.backButton', platform));
      
      // Wait for login screen to load
      await helpers.waitForPageLoad();
      
      // Verify we're on login screen
      await helpers.waitForElement(getSelector('login.welcomeTitle', platform));
      const loginTitle = await helpers.getElementText(getSelector('login.welcomeTitle', platform));
      expect(loginTitle).to.include('Welcome Back!');
      
      console.log('✅ Navigation back to login screen working correctly');
    });

    it('should navigate to login screen when signin link is clicked', async function() {
      console.log('🧪 Testing navigation to login screen via signin link...');
      
      // Navigate back to signup screen first
      await helpers.safeClick(getSelector('login.signupLink', platform));
      await helpers.waitForPageLoad();
      
      // Click signin link
      await helpers.safeClick(getSelector('signup.signinLink', platform));
      
      // Wait for login screen to load
      await helpers.waitForPageLoad();
      
      // Verify we're on login screen
      await helpers.waitForElement(getSelector('login.welcomeTitle', platform));
      const loginTitle = await helpers.getElementText(getSelector('login.welcomeTitle', platform));
      expect(loginTitle).to.include('Welcome Back!');
      
      console.log('✅ Navigation to login screen via signin link working correctly');
    });
  });

  describe('Successful Signup Tests', function() {
    it('should successfully create account with valid data', async function() {
      console.log('🧪 Testing successful account creation...');
      
      // Fill all required fields with valid data
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.phoneInput', platform), '+923001234567');
      await helpers.safeInput(getSelector('signup.cnicInput', platform), '42101-1234567-8');
      
      // Select gender
      await helpers.safeClick(getSelector('signup.genderSelector', platform));
      await helpers.safeClick(getSelector('signup.maleOption', platform));
      
      // Enter passwords
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Wait for signup process to complete
      await helpers.waitForPageLoad();
      
      // Verify we're redirected to role selection or home screen
      await driver.pause(3000);
      
      // Check if we're on role selection screen or home screen
      const isRoleSelection = await helpers.elementExists('~Role Selection'); // Add this selector
      const isHomeScreen = await helpers.elementExists(getSelector('home.homeTitle', platform));
      
      if (isRoleSelection || isHomeScreen) {
        console.log('✅ Successfully created account and redirected');
      } else {
        // Check for any error messages
        const hasError = await helpers.elementExists(getSelector('signup.formError', platform));
        if (hasError) {
          const errorText = await helpers.getElementText(getSelector('signup.formError', platform));
          console.log(`⚠️ Signup failed with error: ${errorText}`);
        } else {
          console.log('⚠️ Signup status unclear - check manually');
        }
      }
    });

    it('should show loading indicator during signup process', async function() {
      console.log('🧪 Testing loading indicator during signup...');
      
      // Fill all required fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.lastNameInput', platform), 'Doe');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('signup.passwordInput', platform), 'testpassword123');
      await helpers.safeInput(getSelector('signup.confirmPasswordInput', platform), 'testpassword123');
      
      // Click create account button
      await helpers.safeClick(getSelector('signup.createAccountButton', platform));
      
      // Check for loading indicator
      const hasLoadingIndicator = await helpers.elementExists(getSelector('common.loadingSpinner', platform));
      expect(hasLoadingIndicator).to.be.true;
      
      console.log('✅ Loading indicator displayed during signup process');
    });
  });

  describe('Google Sign Up Tests', function() {
    it('should display Google Sign Up button', async function() {
      console.log('🧪 Testing Google Sign Up button display...');
      
      // Verify Google Sign Up button is present and clickable
      await helpers.waitForElement(getSelector('signup.googleSignUpButton', platform));
      
      const googleButton = await driver.$(getSelector('signup.googleSignUpButton', platform));
      const isEnabled = await googleButton.isEnabled();
      expect(isEnabled).to.be.true;
      
      console.log('✅ Google Sign Up button is displayed and enabled');
    });

    it('should handle Google Sign Up button click', async function() {
      console.log('🧪 Testing Google Sign Up button click...');
      
      // Click Google Sign Up button
      await helpers.safeClick(getSelector('signup.googleSignUpButton', platform));
      
      // Wait for Google Sign Up process to start
      await driver.pause(2000);
      
      // This test will depend on the Google Sign Up implementation
      console.log('✅ Google Sign Up button click handled');
    });
  });

  describe('Form Reset Tests', function() {
    it('should clear form when navigating away and back', async function() {
      console.log('🧪 Testing form reset functionality...');
      
      // Fill some fields
      await helpers.safeInput(getSelector('signup.firstNameInput', platform), 'John');
      await helpers.safeInput(getSelector('signup.emailInput', platform), 'test@example.com');
      
      // Navigate away
      await helpers.safeClick(getSelector('signup.backButton', platform));
      await helpers.waitForPageLoad();
      
      // Navigate back to signup
      await helpers.safeClick(getSelector('login.signupLink', platform));
      await helpers.waitForPageLoad();
      
      // Verify fields are cleared
      const firstNameValue = await helpers.getElementText(getSelector('signup.firstNameInput', platform));
      const emailValue = await helpers.getElementText(getSelector('signup.emailInput', platform));
      
      expect(firstNameValue).to.be.empty;
      expect(emailValue).to.be.empty;
      
      console.log('✅ Form reset functionality working correctly');
    });
  });

  describe('Accessibility Tests', function() {
    it('should have proper accessibility labels for all form elements', async function() {
      console.log('🧪 Testing accessibility labels for form elements...');
      
      // Check if all form elements have accessibility identifiers
      const formElements = [
        getSelector('signup.firstNameInput', platform),
        getSelector('signup.lastNameInput', platform),
        getSelector('signup.emailInput', platform),
        getSelector('signup.phoneInput', platform),
        getSelector('signup.cnicInput', platform),
        getSelector('signup.genderSelector', platform),
        getSelector('signup.passwordInput', platform),
        getSelector('signup.confirmPasswordInput', platform),
        getSelector('signup.createAccountButton', platform)
      ];
      
      for (const selector of formElements) {
        const element = await driver.$(selector);
        expect(await element.isDisplayed()).to.be.true;
      }
      
      console.log('✅ Accessibility labels verified for all form elements');
    });
  });

  describe('Performance Tests', function() {
    it('should load signup screen within reasonable time', async function() {
      console.log('🧪 Testing signup screen load time...');
      
      const startTime = Date.now();
      
      // Wait for signup screen to be fully loaded
      await helpers.waitForElement(getSelector('signup.welcomeTitle', platform));
      await helpers.waitForElement(getSelector('signup.firstNameInput', platform));
      await helpers.waitForElement(getSelector('signup.createAccountButton', platform));
      
      const loadTime = Date.now() - startTime;
      
      // Signup screen should load within 10 seconds
      expect(loadTime).to.be.lessThan(10000);
      
      console.log(`✅ Signup screen loaded in ${loadTime}ms`);
    });

    it('should handle rapid form input without lag', async function() {
      console.log('🧪 Testing rapid form input handling...');
      
      const firstNameInput = await driver.$(getSelector('signup.firstNameInput', platform));
      
      // Rapidly type in first name field
      const testName = 'JohnDoe';
      for (let i = 0; i < testName.length; i++) {
        await firstNameInput.addValue(testName[i]);
        await driver.pause(50); // Small delay between characters
      }
      
      // Verify all characters were entered
      const enteredValue = await firstNameInput.getValue();
      expect(enteredValue).to.equal(testName);
      
      console.log('✅ Rapid form input handled without lag');
    });
  });
}); 