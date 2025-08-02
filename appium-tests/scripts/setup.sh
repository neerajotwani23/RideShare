#!/bin/bash

# RideShare App - Appium Test Setup Script
# This script sets up the Appium test environment

set -e

echo "🚀 Setting up RideShare Appium Test Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Check if Appium is installed
check_appium() {
    print_status "Checking Appium installation..."
    if command -v appium &> /dev/null; then
        APPIUM_VERSION=$(appium --version)
        print_success "Appium is installed: $APPIUM_VERSION"
    else
        print_warning "Appium is not installed. Installing Appium..."
        npm install -g appium
        print_success "Appium installed successfully"
    fi
}

# Install Appium drivers
install_appium_drivers() {
    print_status "Installing Appium drivers..."
    
    # Install UiAutomator2 driver for Android
    print_status "Installing UiAutomator2 driver..."
    appium driver install uiautomator2
    
    # Install XCUITest driver for iOS (macOS only)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Installing XCUITest driver for iOS..."
        appium driver install xcuitest
    else
        print_warning "Skipping XCUITest driver installation (macOS required for iOS testing)"
    fi
    
    print_success "Appium drivers installed successfully"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Project dependencies installed successfully"
}

# Create environment file
create_env_file() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Created .env file from template"
            print_warning "Please update .env file with your device configuration"
        else
            print_warning "env.example not found. Please create .env file manually"
        fi
    else
        print_success ".env file already exists"
    fi
}

# Check Android setup
check_android_setup() {
    print_status "Checking Android setup..."
    
    if command -v adb &> /dev/null; then
        print_success "ADB is available"
        
        # Check for connected devices
        DEVICES=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
        if [ $DEVICES -gt 0 ]; then
            print_success "Found $DEVICES connected Android device(s)"
            adb devices
        else
            print_warning "No Android devices connected. Please connect a device or start an emulator"
        fi
    else
        print_warning "ADB not found. Please install Android SDK and add it to PATH"
    fi
}

# Check iOS setup (macOS only)
check_ios_setup() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Checking iOS setup..."
        
        if command -v xcrun &> /dev/null; then
            print_success "Xcode command line tools are available"
            
            # Check for available simulators
            SIMULATORS=$(xcrun simctl list devices | grep "iPhone" | grep "Booted\|Shutdown" | wc -l)
            if [ $SIMULATORS -gt 0 ]; then
                print_success "Found $SIMULATORS iOS simulators"
            else
                print_warning "No iOS simulators found. Please create a simulator in Xcode"
            fi
        else
            print_warning "Xcode command line tools not found. Please install Xcode"
        fi
    else
        print_warning "Skipping iOS setup (macOS required for iOS testing)"
    fi
}

# Create screenshots directory
create_screenshots_dir() {
    print_status "Creating screenshots directory..."
    mkdir -p screenshots
    print_success "Screenshots directory created"
}

# Build Android app
build_android_app() {
    print_status "Building Android app..."
    
    if [ -d "../android" ]; then
        cd ../android
        if [ -f "gradlew" ]; then
            print_status "Building debug APK..."
            ./gradlew assembleDebug
            print_success "Android app built successfully"
        else
            print_warning "Gradle wrapper not found. Please run 'gradle wrapper' in android directory"
        fi
        cd ../appium-tests
    else
        print_warning "Android directory not found. Please build the app manually"
    fi
}

# Build iOS app (macOS only)
build_ios_app() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Building iOS app..."
        
        if [ -d "../ios" ]; then
            cd ../ios
            if [ -f "Podfile" ]; then
                print_status "Installing CocoaPods dependencies..."
                pod install
                print_success "CocoaPods dependencies installed"
            fi
            cd ../appium-tests
            print_warning "Please build iOS app manually in Xcode"
        else
            print_warning "iOS directory not found. Please build the app manually"
        fi
    fi
}

# Main setup function
main() {
    echo "=========================================="
    echo "RideShare Appium Test Setup"
    echo "=========================================="
    
    # Check prerequisites
    check_nodejs
    check_npm
    check_appium
    
    # Install dependencies
    install_appium_drivers
    install_dependencies
    
    # Setup environment
    create_env_file
    create_screenshots_dir
    
    # Check platform-specific setup
    check_android_setup
    check_ios_setup
    
    # Build apps
    build_android_app
    build_ios_app
    
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Update .env file with your device configuration"
    echo "2. Connect your device or start an emulator"
    echo "3. Start Appium server: appium"
    echo "4. Run tests: npm test"
    echo ""
    echo "For more information, see README.md"
}

# Run main function
main "$@" 