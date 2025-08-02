const { remote } = require('webdriverio');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure chai
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.assert = chai.assert;

// Import Appium configuration
const appiumConfig = require('./config/appium.config');

// Global variables
global.driver = null;
global.platform = process.env.PLATFORM || 'android';

// Helper function to get capabilities for GUI
function getGuiCapabilities() {
  const baseCapabilities = appiumConfig.common;
  
  if (platform === 'android') {
    return { ...baseCapabilities, ...appiumConfig.android };
  } else if (platform === 'ios') {
    return { ...baseCapabilities, ...appiumConfig.ios };
  }
  return baseCapabilities;
}

// Helper function to create screenshots directory
function createScreenshotsDir() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  return screenshotsDir;
}

// Global setup - runs before all tests
before(async function() {
  this.timeout(120000); // 2 minutes timeout for setup
  
  console.log(`🚀 Starting Appium GUI tests for ${platform.toUpperCase()}`);
  
  // Create screenshots directory
  createScreenshotsDir();
  
  // Get capabilities
  const capabilities = getGuiCapabilities();
  
  // Connect to Appium GUI server
  const wdioOptions = {
    hostname: appiumConfig.host,
    port: appiumConfig.port,
    path: appiumConfig.path,
    capabilities: capabilities,
    logLevel: 'info',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
  };
  
  try {
    global.driver = await remote(wdioOptions);
    console.log('✅ Successfully connected to Appium GUI server');
    
    // Wait for app to load
    await global.driver.pause(5000);
    
  } catch (error) {
    console.error('❌ Failed to connect to Appium GUI server:', error);
    console.log('💡 Make sure Appium Desktop is running and session is active');
    throw error;
  }
});

// Global teardown - runs after all tests
after(async function() {
  this.timeout(30000); // 30 seconds timeout for teardown
  
  if (global.driver) {
    try {
      await global.driver.deleteSession();
      console.log('✅ Appium GUI session closed successfully');
    } catch (error) {
      console.error('❌ Error closing Appium GUI session:', error);
    }
  }
});

// Helper functions for GUI testing
global.helpers = {
  // Take screenshot
  async takeScreenshot(name) {
    if (global.driver) {
      const screenshotsDir = createScreenshotsDir();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const filepath = path.join(screenshotsDir, filename);
      
      try {
        await global.driver.saveScreenshot(filepath);
        console.log(`📸 Screenshot saved: ${filepath}`);
        return filepath;
      } catch (error) {
        console.error('❌ Failed to take screenshot:', error);
      }
    }
  },
  
  // Wait for element to be visible
  async waitForElement(selector, timeout = 10000) {
    try {
      await global.driver.waitUntil(
        async () => {
          const element = await global.driver.$(selector);
          return await element.isDisplayed();
        },
        {
          timeout: timeout,
          timeoutMsg: `Element ${selector} not visible after ${timeout}ms`
        }
      );
    } catch (error) {
      console.error(`❌ Element ${selector} not found:`, error);
      throw error;
    }
  },
  
  // Safe click with retry
  async safeClick(selector, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const element = await global.driver.$(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        await element.click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await global.driver.pause(1000);
      }
    }
  },
  
  // Safe input with clear
  async safeInput(selector, text) {
    const element = await global.driver.$(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.clearValue();
    await element.setValue(text);
  },
  
  // Check if element exists
  async elementExists(selector) {
    try {
      const element = await global.driver.$(selector);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  },
  
  // Get element text
  async getElementText(selector) {
    const element = await global.driver.$(selector);
    return await element.getText();
  },
  
  // Scroll to element
  async scrollToElement(selector) {
    const element = await global.driver.$(selector);
    await element.scrollIntoView();
  },
  
  // Wait for page to load
  async waitForPageLoad(timeout = 10000) {
    await global.driver.pause(2000); // Basic wait
  },
  
  // Handle alerts (Android/iOS)
  async handleAlert(action = 'accept') {
    try {
      if (platform === 'android') {
        const alert = await global.driver.getAlertText();
        if (action === 'accept') {
          await global.driver.acceptAlert();
        } else {
          await global.driver.dismissAlert();
        }
      } else {
        // iOS alert handling
        if (action === 'accept') {
          await global.driver.acceptAlert();
        } else {
          await global.driver.dismissAlert();
        }
      }
    } catch (error) {
      console.log('No alert to handle or alert already handled');
    }
  },

  // GUI-specific helpers
  async getElementInfo(selector) {
    try {
      const element = await global.driver.$(selector);
      const info = {
        text: await element.getText(),
        displayed: await element.isDisplayed(),
        enabled: await element.isEnabled(),
        location: await element.getLocation(),
        size: await element.getSize()
      };
      console.log(`📋 Element info for ${selector}:`, info);
      return info;
    } catch (error) {
      console.error(`❌ Failed to get element info for ${selector}:`, error);
      return null;
    }
  },

  // Find element by text
  async findElementByText(text) {
    try {
      const element = await global.driver.$(`~${text}`);
      return element;
    } catch (error) {
      console.error(`❌ Element with text "${text}" not found:`, error);
      return null;
    }
  },

  // Get page source for debugging
  async getPageSource() {
    try {
      const source = await global.driver.getPageSource();
      console.log('📄 Page source:', source.substring(0, 500) + '...');
      return source;
    } catch (error) {
      console.error('❌ Failed to get page source:', error);
      return null;
    }
  }
};

// Export for use in tests
module.exports = {
  driver: global.driver,
  helpers: global.helpers,
  platform: global.platform
}; 