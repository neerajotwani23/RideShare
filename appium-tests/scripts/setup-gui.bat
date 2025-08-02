@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo RideShare Appium GUI Setup - Windows
echo ==========================================

:: Colors for output
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:: Check Node.js
call :print_status "Checking Node.js installation..."
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Node.js is not installed. Please install Node.js v18 or higher."
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_success "Node.js is installed: !NODE_VERSION!"
)

:: Check npm
call :print_status "Checking npm installation..."
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "npm is not installed. Please install npm."
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_success "npm is installed: !NPM_VERSION!"
)

:: Install project dependencies
call :print_status "Installing project dependencies..."
npm install
if %errorlevel% neq 0 (
    call :print_error "Failed to install project dependencies."
    pause
    exit /b 1
)
call :print_success "Project dependencies installed successfully"

:: Check Mocha installation
call :print_status "Checking Mocha installation..."
npx mocha --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "Mocha not found. Installing Mocha..."
    npm install -g mocha
    if %errorlevel% neq 0 (
        call :print_warning "Failed to install Mocha globally. Will use npx."
    ) else (
        call :print_success "Mocha installed globally"
    )
) else (
    for /f "tokens=*" %%i in ('npx mocha --version') do set MOCHA_VERSION=%%i
    call :print_success "Mocha is available: !MOCHA_VERSION!"
)

:: Create environment file
call :print_status "Setting up environment configuration..."
if not exist .env (
    if exist env.example (
        copy env.example .env >nul
        call :print_success "Created .env file from template"
        call :print_warning "Please update .env file with your device configuration"
    ) else (
        call :print_warning "env.example not found. Please create .env file manually"
    )
) else (
    call :print_success ".env file already exists"
)

:: Check Android setup
call :print_status "Checking Android setup..."
where adb >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "ADB not found. Please install Android SDK and add it to PATH"
    call :print_warning "Make sure ANDROID_HOME is set in environment variables"
) else (
    call :print_success "ADB is available"
    
    :: Check for connected devices
    adb devices | findstr /v "List of devices" | findstr /v "^$" >nul
    if %errorlevel% equ 0 (
        call :print_success "Found connected Android device(s)"
        adb devices
    ) else (
        call :print_warning "No Android devices connected. Please connect a device or start an emulator"
    )
)

:: Create screenshots directory
call :print_status "Creating screenshots directory..."
if not exist screenshots mkdir screenshots
call :print_success "Screenshots directory created"

:: Build Android app
call :print_status "Building Android app..."
if exist "..\android" (
    cd ..\android
    if exist gradlew.bat (
        call :print_status "Building debug APK..."
        call gradlew.bat assembleDebug
        if %errorlevel% equ 0 (
            call :print_success "Android app built successfully"
        ) else (
            call :print_warning "Failed to build Android app. Please check your Android setup"
        )
    ) else (
        call :print_warning "Gradle wrapper not found. Please run 'gradle wrapper' in android directory"
    )
    cd ..\appium-tests
) else (
    call :print_warning "Android directory not found. Please build the app manually"
)

:: Update GUI config with correct paths
call :print_status "Updating Appium GUI configuration..."
set "CURRENT_DIR=%CD%"
set "APP_PATH=%CURRENT_DIR%\..\android\app\build\outputs\apk\debug\app-debug.apk"
set "CONFIG_PATH=%CURRENT_DIR%\config\appium-gui-config.json"

:: Create updated config
echo {> "%CONFIG_PATH%"
echo   "platformName": "Android",>> "%CONFIG_PATH%"
echo   "automationName": "UiAutomator2",>> "%CONFIG_PATH%"
echo   "deviceName": "Android Device",>> "%CONFIG_PATH%"
echo   "platformVersion": "13.0",>> "%CONFIG_PATH%"
echo   "app": "%APP_PATH:\=\\%",>> "%CONFIG_PATH%"
echo   "appPackage": "com.rideshare.app",>> "%CONFIG_PATH%"
echo   "appActivity": "com.rideshare.app.MainActivity",>> "%CONFIG_PATH%"
echo   "noReset": false,>> "%CONFIG_PATH%"
echo   "fullReset": true,>> "%CONFIG_PATH%"
echo   "autoGrantPermissions": true,>> "%CONFIG_PATH%"
echo   "newCommandTimeout": 60,>> "%CONFIG_PATH%"
echo   "uiautomator2ServerLaunchTimeout": 60000,>> "%CONFIG_PATH%"
echo   "uiautomator2ServerInstallTimeout": 60000,>> "%CONFIG_PATH%"
echo   "androidInstallTimeout": 90000,>> "%CONFIG_PATH%"
echo   "adbExecTimeout": 60000,>> "%CONFIG_PATH%"
echo   "androidDeviceReadyTimeout": 60000,>> "%CONFIG_PATH%"
echo   "systemPort": 8200,>> "%CONFIG_PATH%"
echo   "chromeDriverPort": 9515,>> "%CONFIG_PATH%"
echo   "disableWindowAnimation": true,>> "%CONFIG_PATH%"
echo   "skipServerInstallation": false,>> "%CONFIG_PATH%"
echo   "skipDeviceInitialization": false,>> "%CONFIG_PATH%"
echo   "skipUnlock": false,>> "%CONFIG_PATH%"
echo   "unlockType": "pin",>> "%CONFIG_PATH%"
echo   "unlockKey": "1234">> "%CONFIG_PATH%"
echo }>> "%CONFIG_PATH%"

call :print_success "Appium GUI configuration updated"

:: Test Mocha installation
call :print_status "Testing Mocha installation..."
npx mocha --version >nul 2>&1
if %errorlevel% equ 0 (
    call :print_success "Mocha is working correctly"
) else (
    call :print_error "Mocha is not working. Please check installation."
)

echo ==========================================
call :print_success "GUI Setup completed successfully!"
echo ==========================================
echo.
echo Next steps for Appium GUI:
echo 1. Download Appium Desktop from: https://github.com/appium/appium-desktop/releases
echo 2. Install and open Appium Desktop
echo 3. Start the server (Host: localhost, Port: 4723)
echo 4. Create new session with capabilities from: config\appium-gui-config.json
echo 5. Use Appium Inspector to find element selectors
echo 6. Run tests: npm run test:gui:login
echo.
echo GUI Configuration file: config\appium-gui-config.json
echo.
pause 