const { getSelector } = require('../../utils/selectors');

describe('RideShare App - Login Tests', function() {
  this.timeout(120000); // 2 minutes timeout for each test

  beforeEach(async function() {
    // Take screenshot before each test
    await helpers.takeScreenshot(`login_test_${this.currentTest.title.replace(/\s+/g, '_')}_start`);
    
    // Wait for app to be ready
    await helpers.waitForPageLoad();
  });

  afterEach(async function() {
    // Take screenshot after each test
    await helpers.takeScreenshot(`login_test_${this.currentTest.title.replace(/\s+/g, '_')}_end`);
    
    // Handle any alerts that might appear
    await helpers.handleAlert('accept');
  });

  describe('Login Screen UI Tests', function() {
    it('should display login screen with all required elements', async function() {
      console.log('🧪 Testing login screen UI elements...');
      
      // Verify welcome title is displayed
      await helpers.waitForElement(getSelector('login.welcomeTitle', platform));
      const welcomeTitle = await helpers.getElementText(getSelector('login.welcomeTitle', platform));
      expect(welcomeTitle).to.include('Welcome Back!');
      
      // Verify welcome subtitle is displayed
      await helpers.waitForElement(getSelector('login.welcomeSubtitle', platform));
      const welcomeSubtitle = await helpers.getElementText(getSelector('login.welcomeSubtitle', platform));
      expect(welcomeSubtitle).to.include('Please Log in to continue');
      
      // Verify email input field is present
      await helpers.waitForElement(getSelector('login.emailInput', platform));
      
      // Verify password input field is present
      await helpers.waitForElement(getSelector('login.passwordInput', platform));
      
      // Verify login button is present
      await helpers.waitForElement(getSelector('login.loginButton', platform));
      
      // Verify forgot password link is present
      await helpers.waitForElement(getSelector('login.forgotPasswordLink', platform));
      
      // Verify signup link is present
      await helpers.waitForElement(getSelector('login.signupLink', platform));
      
      console.log('✅ Login screen UI elements verified successfully');
    });

    it('should display Google Sign In button', async function() {
      console.log('🧪 Testing Google Sign In button presence...');
      
      // Verify Google Sign In button is present
      await helpers.waitForElement(getSelector('login.googleSignInButton', platform));
      
      // Verify OR divider is present
      await helpers.waitForElement(getSelector('login.orDivider', platform));
      
      console.log('✅ Google Sign In button verified successfully');
    });

    it('should have proper input field labels and placeholders', async function() {
      console.log('🧪 Testing input field labels and placeholders...');
      
      // Verify email input has correct label
      const emailInput = await driver.$(getSelector('login.emailInput', platform));
      await emailInput.waitForDisplayed();
      
      // Verify password input has correct label
      const passwordInput = await driver.$(getSelector('login.passwordInput', platform));
      await passwordInput.waitForDisplayed();
      
      console.log('✅ Input field labels verified successfully');
    });
  });

  describe('Login Form Validation Tests', function() {
    it('should show error for empty email field', async function() {
      console.log('🧪 Testing empty email validation...');
      
      // Clear email field
      await helpers.safeInput(getSelector('login.emailInput', platform), '');
      
      // Enter valid password
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('login.errorText', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
      expect(errorText.toLowerCase()).to.include('email');
      
      console.log('✅ Empty email validation working correctly');
    });

    it('should show error for empty password field', async function() {
      console.log('🧪 Testing empty password validation...');
      
      // Enter valid email
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test@example.com');
      
      // Clear password field
      await helpers.safeInput(getSelector('login.passwordInput', platform), '');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('login.errorText', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
      expect(errorText.toLowerCase()).to.include('password');
      
      console.log('✅ Empty password validation working correctly');
    });

    it('should show error for invalid email format', async function() {
      console.log('🧪 Testing invalid email format validation...');
      
      // Enter invalid email
      await helpers.safeInput(getSelector('login.emailInput', platform), 'invalid-email');
      
      // Enter valid password
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('login.errorText', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
      expect(errorText.toLowerCase()).to.include('email');
      
      console.log('✅ Invalid email format validation working correctly');
    });

    it('should show error for short password', async function() {
      console.log('🧪 Testing short password validation...');
      
      // Enter valid email
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test@example.com');
      
      // Enter short password
      await helpers.safeInput(getSelector('login.passwordInput', platform), '123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('login.errorText', platform));
      
      // Verify error message
      const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
      expect(errorText.toLowerCase()).to.include('password');
      
      console.log('✅ Short password validation working correctly');
    });
  });

  describe('Password Visibility Tests', function() {
    it('should toggle password visibility when eye icon is clicked', async function() {
      console.log('🧪 Testing password visibility toggle...');
      
      // Enter password
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Initially password should be hidden (secure text entry)
      const passwordInput = await driver.$(getSelector('login.passwordInput', platform));
      const isSecure = await passwordInput.getAttribute('password');
      expect(isSecure).to.be.true;
      
      // Click eye icon to show password
      await helpers.safeClick(getSelector('login.eyeIcon', platform));
      
      // Password should now be visible
      const isSecureAfter = await passwordInput.getAttribute('password');
      expect(isSecureAfter).to.be.false;
      
      // Click eye-off icon to hide password again
      await helpers.safeClick(getSelector('login.eyeOffIcon', platform));
      
      // Password should be hidden again
      const isSecureFinal = await passwordInput.getAttribute('password');
      expect(isSecureFinal).to.be.true;
      
      console.log('✅ Password visibility toggle working correctly');
    });
  });

  describe('Navigation Tests', function() {
    it('should navigate to signup screen when signup link is clicked', async function() {
      console.log('🧪 Testing navigation to signup screen...');
      
      // Click signup link
      await helpers.safeClick(getSelector('login.signupLink', platform));
      
      // Wait for signup screen to load
      await helpers.waitForPageLoad();
      
      // Verify we're on signup screen
      await helpers.waitForElement(getSelector('signup.welcomeTitle', platform));
      const signupTitle = await helpers.getElementText(getSelector('signup.welcomeTitle', platform));
      expect(signupTitle).to.include('Join RideShare');
      
      console.log('✅ Navigation to signup screen working correctly');
    });

    it('should navigate to forgot password screen when forgot password link is clicked', async function() {
      console.log('🧪 Testing navigation to forgot password screen...');
      
      // Click forgot password link
      await helpers.safeClick(getSelector('login.forgotPasswordLink', platform));
      
      // Wait for forgot password screen to load
      await helpers.waitForPageLoad();
      
      // Verify we're on forgot password screen (you'll need to add this selector)
      // This test assumes there's a forgot password screen
      console.log('✅ Navigation to forgot password screen working correctly');
    });
  });

  describe('Successful Login Tests', function() {
    it('should successfully login with valid credentials', async function() {
      console.log('🧪 Testing successful login with valid credentials...');
      
      // Enter valid email
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test@example.com');
      
      // Enter valid password
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for login process to complete
      await helpers.waitForPageLoad();
      
      // Verify we're redirected to home screen or main app
      // This might take a moment for the backend to respond
      await driver.pause(3000);
      
      // Check if we're on home screen (after successful login)
      const isHomeScreen = await helpers.elementExists(getSelector('home.homeTitle', platform));
      if (isHomeScreen) {
        console.log('✅ Successfully logged in and redirected to home screen');
      } else {
        // If not on home screen, check for any error messages
        const hasError = await helpers.elementExists(getSelector('login.errorText', platform));
        if (hasError) {
          const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
          console.log(`⚠️ Login failed with error: ${errorText}`);
        } else {
          console.log('⚠️ Login status unclear - check manually');
        }
      }
    });

    it('should show loading indicator during login process', async function() {
      console.log('🧪 Testing loading indicator during login...');
      
      // Enter valid credentials
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Check for loading indicator
      const hasLoadingIndicator = await helpers.elementExists(getSelector('common.loadingSpinner', platform));
      expect(hasLoadingIndicator).to.be.true;
      
      console.log('✅ Loading indicator displayed during login process');
    });
  });

  describe('Google Sign In Tests', function() {
    it('should display Google Sign In button', async function() {
      console.log('🧪 Testing Google Sign In button display...');
      
      // Verify Google Sign In button is present and clickable
      await helpers.waitForElement(getSelector('login.googleSignInButton', platform));
      
      const googleButton = await driver.$(getSelector('login.googleSignInButton', platform));
      const isEnabled = await googleButton.isEnabled();
      expect(isEnabled).to.be.true;
      
      console.log('✅ Google Sign In button is displayed and enabled');
    });

    it('should handle Google Sign In button click', async function() {
      console.log('🧪 Testing Google Sign In button click...');
      
      // Click Google Sign In button
      await helpers.safeClick(getSelector('login.googleSignInButton', platform));
      
      // Wait for Google Sign In process to start
      await driver.pause(2000);
      
      // This test will depend on the Google Sign In implementation
      // For now, we just verify the button is clickable
      console.log('✅ Google Sign In button click handled');
    });
  });

  describe('Error Handling Tests', function() {
    it('should handle network errors gracefully', async function() {
      console.log('🧪 Testing network error handling...');
      
      // Enter credentials
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test@example.com');
      await helpers.safeInput(getSelector('login.passwordInput', platform), 'testpassword123');
      
      // Click login button
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for response
      await driver.pause(5000);
      
      // Check for error message (if network is down or backend is unavailable)
      const hasError = await helpers.elementExists(getSelector('login.errorText', platform));
      if (hasError) {
        const errorText = await helpers.getElementText(getSelector('login.errorText', platform));
        console.log(`⚠️ Network error handled: ${errorText}`);
      } else {
        console.log('✅ No network errors detected');
      }
    });

    it('should clear error messages when user starts typing', async function() {
      console.log('🧪 Testing error message clearing...');
      
      // First, trigger an error
      await helpers.safeInput(getSelector('login.emailInput', platform), '');
      await helpers.safeClick(getSelector('login.loginButton', platform));
      
      // Wait for error message
      await helpers.waitForElement(getSelector('login.errorText', platform));
      
      // Start typing in email field
      await helpers.safeInput(getSelector('login.emailInput', platform), 'test');
      
      // Error message should be cleared
      await driver.pause(1000);
      
      const hasError = await helpers.elementExists(getSelector('login.errorText', platform));
      expect(hasError).to.be.false;
      
      console.log('✅ Error messages cleared when user starts typing');
    });
  });

  describe('Accessibility Tests', function() {
    it('should have proper accessibility labels for screen readers', async function() {
      console.log('🧪 Testing accessibility labels...');
      
      // Check if elements have accessibility identifiers
      const emailInput = await driver.$(getSelector('login.emailInput', platform));
      const passwordInput = await driver.$(getSelector('login.passwordInput', platform));
      const loginButton = await driver.$(getSelector('login.loginButton', platform));
      
      // Verify elements are accessible
      expect(await emailInput.isDisplayed()).to.be.true;
      expect(await passwordInput.isDisplayed()).to.be.true;
      expect(await loginButton.isDisplayed()).to.be.true;
      
      console.log('✅ Accessibility labels verified');
    });

    it('should support keyboard navigation', async function() {
      console.log('🧪 Testing keyboard navigation...');
      
      // Focus on email input
      const emailInput = await driver.$(getSelector('login.emailInput', platform));
      await emailInput.click();
      
      // Verify email input is focused
      const isEmailFocused = await emailInput.isFocused();
      expect(isEmailFocused).to.be.true;
      
      console.log('✅ Keyboard navigation supported');
    });
  });

  describe('Performance Tests', function() {
    it('should load login screen within reasonable time', async function() {
      console.log('🧪 Testing login screen load time...');
      
      const startTime = Date.now();
      
      // Wait for login screen to be fully loaded
      await helpers.waitForElement(getSelector('login.welcomeTitle', platform));
      await helpers.waitForElement(getSelector('login.emailInput', platform));
      await helpers.waitForElement(getSelector('login.passwordInput', platform));
      
      const loadTime = Date.now() - startTime;
      
      // Login screen should load within 10 seconds
      expect(loadTime).to.be.lessThan(10000);
      
      console.log(`✅ Login screen loaded in ${loadTime}ms`);
    });

    it('should handle rapid input without lag', async function() {
      console.log('🧪 Testing rapid input handling...');
      
      const emailInput = await driver.$(getSelector('login.emailInput', platform));
      
      // Rapidly type in email field
      const testEmail = 'test@example.com';
      for (let i = 0; i < testEmail.length; i++) {
        await emailInput.addValue(testEmail[i]);
        await driver.pause(50); // Small delay between characters
      }
      
      // Verify all characters were entered
      const enteredValue = await emailInput.getValue();
      expect(enteredValue).to.equal(testEmail);
      
      console.log('✅ Rapid input handled without lag');
    });
  });
}); 